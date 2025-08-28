import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Sử dụng Prisma client tập trung

export async function GET(request, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Song slug is required' }, { status: 400 });
  }

  try {
    const song = await prisma.song.findUnique({
      where: { 
        slug: slug 
      },
      // SỬ DỤNG SELECT ĐỂ TỐI ƯU VÀ BẢO MẬT
      select: {
        id: true,
        title: true,
        slug: true,
        lyrics_chords: true,
        original_key: true,
        rhythm: true,
        tempo: true,
        views: true,
        created_at: true,
        composer: { 
          select: { 
            name: true, 
            slug: true 
          } 
        },
        artists: { 
          select: { 
            artist: { 
              select: { 
                name: true, 
                slug: true 
              } 
            } 
          } 
        },
        genres: { 
          select: { 
            genre: { 
              select: { 
                name: true, 
                slug: true 
              } 
            } 
          } 
        }
      },
    });

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    // Định dạng lại dữ liệu artists và genres để frontend dễ sử dụng
    const formattedSong = {
        ...song,
        artists: song.artists.map(a => a.artist),
        genres: song.genres.map(g => g.genre)
    };

    return NextResponse.json(formattedSong);

  } catch (error) {
    console.error(`Failed to fetch song with slug: ${slug}`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}