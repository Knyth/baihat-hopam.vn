// src/app/composers/[slug]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { toSlug, normalizeName } from "@/utils/text";
import styles from "./page.module.css";

// Selects (JS thuần)
const composerSelectLight = {
  id: true,
  name: true,
  slug: true,
  description: true,
  bio: true,
  imageUrl: true,
};

const composerSelectFull = {
  ...composerSelectLight,
  songs: {
    select: {
      id: true,
      title: true,
      slug: true,
      originalKey: true,
      rhythm: true,
      tempo: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  },
};

// ---------- SEO ----------
export async function generateMetadata({ params }) {
  const { slug } = await params; // Next 15: phải await params
  if (!slug) return {};

  const composer = await prisma.composer.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!composer) return {};

  const title = `Nhạc sĩ ${composer.name}`;
  const description =
    composer.description ||
    `Các bài hát nổi bật của nhạc sĩ ${composer.name} trên baihat-hopam.vn.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

// ---------- Helper: tìm composer an toàn theo slug ----------
async function findComposerBySlugSafe(slug) {
  // 1) Exact slug
  const exact = await prisma.composer.findUnique({
    where: { slug },
    select: composerSelectFull,
  });
  if (exact) return exact;

  // 2) Fallback: so khớp gần đúng
  const light = await prisma.composer.findMany({ select: composerSelectLight });

  // a) Tìm theo slug
  const fromSlug = light.find((c) => c.slug === slug);
  if (fromSlug) {
    const full = await prisma.composer.findUnique({
      where: { slug: fromSlug.slug },
      select: composerSelectFull,
    });
    if (full) return full;
  }

  // b) Tìm theo tên chuẩn hoá
  const target = slug.replace(/-/g, " ");
  const normTarget = normalizeName(target);
  const byName = light.find((c) => normalizeName(c.name) === normTarget || toSlug(c.name) === slug);
  if (byName) {
    const full = await prisma.composer.findUnique({
      where: { slug: byName.slug },
      select: composerSelectFull,
    });
    if (full) return full;
  }

  return null;
}

// ---------- Page ----------
export default async function ComposerPage({ params }) {
  const { slug } = await params; // Next 15: phải await params
  if (!slug) return notFound();

  const composer = await findComposerBySlugSafe(slug);
  if (!composer) return notFound();

  return (
    // Header/Hero/Recently/Trending/Footer render từ layout; ở đây chỉ là CONTENT
    <main>
      <div
        className="container"
        style={{
          // fallback để chắc chắn 1140px đúng spec
          maxWidth: "1140px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {/* === HERO CARD === */}
        <section className={styles.hero}>
          {composer.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={composer.imageUrl} alt={composer.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder} aria-hidden />
          )}

          <div className={styles.heroBody}>
            <h1 className={styles.pageTitle}>Nhạc sĩ {composer.name}</h1>

            {(composer.description || composer.bio) && (
              <p className={styles.description}>{composer.description || composer.bio}</p>
            )}

            <div className={styles.meta}>
              <span className={styles.badge}>Nhạc sĩ</span>
              {Array.isArray(composer.songs) && <span>{composer.songs.length} bài hát</span>}
            </div>
          </div>
        </section>

        {/* === DANH SÁCH BÀI HÁT === */}
        <section>
          {composer.songs?.length ? (
            <ul className={styles.list}>
              {composer.songs.map((s) => (
                <li key={s.id} className={styles.item}>
                  <Link href={`/songs/${s.slug}`} className={styles.songLink}>
                    {s.title}
                  </Link>
                  <div className={styles.subline}>{composer.name}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>Chưa có bài hát nào được ghi nhận cho tác giả này.</div>
          )}
        </section>
      </div>
    </main>
  );
}
