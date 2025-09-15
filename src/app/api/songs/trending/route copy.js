// src/app/api/songs/trending/route.js
// UPDATED: tính "thịnh hành trong X ngày" + fallback all-time + limit param

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // === Params với giới hạn an toàn ===
    const limitParam = Number(searchParams.get('limit'));
    const daysParam = Number(searchParams.get('days'));
    const take = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 10) : 8;
    const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 30) : 7;

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // === Chỉ select field cần thiết để nhẹ payload ===
    const baseSelect = {
      id: true,
      slug: true,
      title: true,
      views: true,
      composer: { select: { name: true } },
      artists: { select: { artist: { select: { name: true } } } },
    };

    // 1) Top trong cửa sổ 7 ngày (mặc định)
    const inWindow = await prisma.song.findMany({
      where: { createdAt: { gte: since } },
      orderBy: [{ views: 'desc' }, { updatedAt: 'desc' }],
      take,
      select: baseSelect,
    });

    let songs = inWindow;

    // 2) Fallback nếu chưa đủ: lấy thêm top all-time (tránh trùng)
    if (songs.length < take) {
      const needed = take - songs.length;
      const excludeIds = songs.map((s) => s.id);
      const fillers = await prisma.song.findMany({
        where: excludeIds.length ? { id: { notIn: excludeIds } } : {},
        orderBy: [{ views: 'desc' }, { updatedAt: 'desc' }],
        take: needed,
        select: baseSelect,
      });
      songs = [...songs, ...fillers];
    }

    // 3) Chuẩn hóa artists → [{ name }]
    const data = songs.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      views: s.views,
      composer: s.composer || null,
      artists: (s.artists || []).map((a) => a.artist),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
