// src/components/SongListContainer.js
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import SongList from "./SongList";
import SongListSkeleton from "./SongListSkeleton";

export default function SongListContainer({ genres }) {
  const searchParams = useSearchParams();

  // === trending mode ===
  const sortParam = searchParams.get("sort") || "newest";
  const isTrendingMode = sortParam === "trending";

  // Cho phép override qua URL: /songs?sort=trending&limit=8
  const limitParam = Number(searchParams.get("limit"));
  const pageSize = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 5), 50) : 5; // <<< mặc định 5
  // Chỗ này cho phép SỐ LƯỢNG bài displayed trong Thịnh hành page "Math.max(limitParam, 5)"

  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // paging
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setSongs([]);
    setPage(1);
    setHasMore(false);
  }, [searchParams, isTrendingMode]);

  const API_BASE_URL = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    [],
  );

  const fetchTrendingPage = useCallback(
    async (pageToFetch) => {
      const url = `${API_BASE_URL}/api/songs/trending?mode=list&limit=${encodeURIComponent(pageSize)}&page=${encodeURIComponent(pageToFetch)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trending page");
      const json = await res.json();
      const items = Array.isArray(json?.items) ? json.items : [];
      const more = !!json?.hasMore;
      return { items, more };
    },
    [API_BASE_URL, pageSize],
  );

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        if (isTrendingMode) {
          const { items, more } = await fetchTrendingPage(1);
          setSongs(items);
          setHasMore(more);
          setPage(1);
        } else {
          const queryString = searchParams.toString();
          const songsUrl = `${API_BASE_URL}/api/songs?${queryString}`;
          const res = await fetch(songsUrl);
          if (!res.ok) throw new Error("Failed to fetch songs");
          const data = await res.json();
          setSongs(data.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch songs:", e);
        setSongs([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [API_BASE_URL, isTrendingMode, searchParams, fetchTrendingPage]);

  const handleLoadMore = async () => {
    try {
      const next = page + 1;
      const { items, more } = await fetchTrendingPage(next);
      setSongs((prev) => [...prev, ...items]);
      setHasMore(more);
      setPage(next);
    } catch (e) {
      console.error("Load more failed:", e);
    }
  };

  // Sidebar values (ẩn khi trending)
  const initialSelectedGenres = searchParams.get("genre")?.split(",") || [];
  const initialComposer = searchParams.get("composer") || "";
  const initialSort = sortParam;

  return (
    <div className="container list-page-layout">
      {!isTrendingMode && (
        <aside className="list-sidebar">
          <FilterSidebar
            genres={genres}
            initialSelectedGenres={initialSelectedGenres}
            initialComposer={initialComposer}
            initialSort={initialSort}
          />
        </aside>
      )}

      <main className="list-main-content">
        <h1 className="text-4xl font-bold" style={{ marginBottom: "0.25rem" }}>
          {isTrendingMode ? "Thịnh hành" : "Thư viện Hợp âm"}
        </h1>
        {isTrendingMode && (
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Top bài được xem nhiều trong <strong>7 ngày gần đây</strong>.
          </p>
        )}

        {isLoading ? (
          <SongListSkeleton />
        ) : songs.length > 0 ? (
          <>
            <SongList songs={songs} />
            {isTrendingMode && hasMore && (
              <div style={{ marginTop: "1rem" }}>
                <button className="button-primary" onClick={handleLoadMore}>
                  Tải thêm
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Không tìm thấy bài hát nào khớp với bộ lọc của bạn.</p>
        )}
      </main>
    </div>
  );
}
