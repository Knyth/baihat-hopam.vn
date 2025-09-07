// src/app/page.js

// import HeroSection from "@/components/HeroSection";
// import RecentlyAddedSection from "@/components/RecentlyAddedSection";
// import TrendingSection from "@/components/TrendingSection";
// import BrowseByGenreSection from "@/components/BrowseByGenreSection";
// import FeaturedComposersSection from "@/components/FeaturedComposersSection";
// import SignUpCtaSection from "@/components/SignUpCtaSection";

// export default function HomePage() {
//   return (
//     <main>
//       <HeroSection />
//       <RecentlyAddedSection />
//       <TrendingSection />
//       <BrowseByGenreSection />
//       <FeaturedComposersSection />
//       <SignUpCtaSection />
//     </main>
//   );
// }



// =================NEW=====================

// src/app/page.js

import prisma from '@/lib/prisma';
// import HeroSection from '@/components/HeroSection'; // Tạm thời comment nếu chưa có
import RecentlyAddedSection from '@/components/RecentlyAddedSection';
import Container from '@/components/layout/Container';

async function getRecentSongs() {
  try {
    const songs = await prisma.song.findMany({
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        artists: {
          include: {
            artist: {
              select: { name: true }
            }
          }
        }
      }
    });
    return songs.map(song => ({
      ...song,
      artists: song.artists.map(sa => sa.artist)
    }));
  } catch (error) {
    console.error("Failed to fetch recent songs:", error);
    return []; // Quan trọng: Luôn trả về mảng rỗng khi có lỗi
  }
}

export default async function HomePage() {
  const recentSongs = await getRecentSongs();

  return (
    <main>
      {/* <HeroSection /> */}
      <Container>
        <RecentlyAddedSection songs={recentSongs} />
      </Container>
    </main>
  );
}