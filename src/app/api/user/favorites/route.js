// src/app/api/user/favorites/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

export async function GET(request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const favorites = await prisma.userFavorite.findMany({
      where: { userId: user.userId },
      include: { song: { select: { id: true, title: true, slug: true, composer: { select: { name: true } } } } },
      orderBy: { added_at: 'desc' },
    });
    return NextResponse.json(favorites.map(fav => fav.song), { status: 200 });
  } catch (error) {
    console.error("API GET Favorites Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { songId } = await request.json();
    if (!songId) return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
    const newFavorite = await prisma.userFavorite.create({
      data: { userId: user.userId, songId: songId },
    });
    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error("API POST Favorite Error:", error);
    if (error.code === 'P2002') return NextResponse.json({ error: 'Song already in favorites' }, { status: 409 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}