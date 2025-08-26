// src/app/page.js

import HeroSection from "@/components/HeroSection";
import RecentlyAddedSection from "@/components/RecentlyAddedSection";
import TrendingSection from "@/components/TrendingSection";
import BrowseByGenreSection from "@/components/BrowseByGenreSection";
import FeaturedComposersSection from "@/components/FeaturedComposersSection";
import SignUpCtaSection from "@/components/SignUpCtaSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <RecentlyAddedSection />
      <TrendingSection />
      <BrowseByGenreSection />
      <FeaturedComposersSection />
      <SignUpCtaSection />
    </main>
  );
}