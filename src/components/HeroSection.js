// src/components/HeroSection.js

// ✅ NOTE: Removed "use client" so this is a Server Component.
// No client-only APIs are used; this avoids hydration flashes.
import Link from "next/link";
import Container from "@/components/layout/Container";
import styles from "./HeroSection.module.css";

/**
 * Optional background image:
 * If you later add a hero image to /public (e.g., /hero.jpg),
 * you can enable it by setting the CSS variable inline, like:
 *
 * <section className={styles.heroSection} style={{'--hero-bg-image': 'url(/hero.jpg)'}}>
 *   ...
 * </section>
 *
 * By default it's clean with a subtle gradient background (no image required).
 */

export default function HeroSection() {
  return (
    // aria-labelledby links section to the H1 for better accessibility
    <section className={styles.heroSection} aria-labelledby="hero-title">
      <Container>
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.heroTitle}>
            Thư viện Hợp âm &amp; Sheet nhạc cho Người yêu nhạc Việt
          </h1>

          <p className={styles.heroSubtitle}>
            Tìm kiếm, tùy chỉnh tông, và tải về hàng ngàn bài hát một cách dễ dàng và hoàn toàn miễn
            phí.
          </p>

          <Link href="/songs" className={styles.heroCtaButton}>
            Khám phá Ngay
          </Link>
        </div>
      </Container>
    </section>
  );
}
