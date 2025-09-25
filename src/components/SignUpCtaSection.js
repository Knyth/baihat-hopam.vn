// src/components/SignUpCtaSection.js

import Link from "next/link";
import styles from "./SignUpCtaSection.module.css";

export const dynamic = "force-static";

export default function SignUpCtaSection() {
  return (
    <section className={styles.wrapper} aria-labelledby="cta-title">
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 id="cta-title" className={styles.title}>
            Tham gia cộng đồng baihat-hopam.vn
          </h2>
          <p className={styles.subtitle}>
            Lưu bài hát yêu thích, tạo playlist, và khám phá hợp âm Việt nhanh hơn.
          </p>

          <div className={styles.actions}>
            <Link href="/auth/register" className={styles.primaryBtn}>
              Đăng ký miễn phí
            </Link>
            <Link href="/auth" className={styles.secondaryBtn}>
              Đăng nhập
            </Link>
          </div>

          <p className={styles.smallNote}>Miễn phí • Không spam • Huỷ bất cứ lúc nào</p>
        </div>
      </div>
    </section>
  );
}
