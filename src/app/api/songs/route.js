// src/app/api/songs/route.js
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('query') || '').trim();
    const sort = (searchParams.get('sort') || 'latest').trim(); // latest | popular | name_asc

    // --- WHERE ---
    const whereClause = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { composer: { name: { contains: q, mode: 'insensitive' } } },
          ],
        }
      : {};

    // --- ORDER BY ---
    let orderByClause;
    if (sort === 'name_asc') {
      orderByClause = { title: 'asc' };
    } else if (sort === 'popular') {
      orderByClause = { views: 'desc' }; // nếu chưa có cột views sẽ bỏ qua case này
    } else {
      orderByClause = { createdAt: 'desc' }; // ⬅️ đúng tên cột
    }

    const songs = await prisma.song.findMany({
      where: whereClause,
      orderBy: orderByClause,
      select: {
        id: true,
        title: true,
        slug: true,
        composer: { select: { name: true, slug: true } },
      },
    });

    return Response.json({ songs });
  } catch (err) {
    console.error('Error fetching songs:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch songs' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
