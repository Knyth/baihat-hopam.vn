// src/components/layout/Footer.js
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Cột 1: Giới thiệu */}
        <div className={styles.column}>
          <h3 className={styles.logo}>baihat-hopam.vn</h3>
          <p className={styles.description}>
            Nơi chia sẻ và khám phá hợp âm, sheet nhạc cho cộng đồng yêu nhạc Việt. Xây dựng với
            niềm đam mê và sự tận tâm.
          </p>
        </div>

        {/* Cột 2: Khám phá */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Khám phá</h4>
          <ul className={styles.linkList}>
            <li>
              <Link href="/songs?sort=newest">Bài hát Mới</Link>
            </li>
            <li>
              <Link href="/songs?sort=views">Thịnh hành</Link>
            </li>
            {/* <li><Link href="/genres">Thể loại</Link></li> */}
            {/* <li><Link href="/composers">Tác giả</Link></li> */}
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Hỗ trợ</h4>
          <ul className={styles.linkList}>
            <li>
              <Link href="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link href="/contact">Liên hệ & Góp ý</Link>
            </li>
            {/* <li><Link href="/faq">Câu hỏi thường gặp</Link></li> */}
            <li>
              <Link href="/dmca">Chính sách Bản quyền</Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Kết nối */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Kết nối</h4>
          <p>Sắp ra mắt...</p>
          {/* (Trong tương lai sẽ thêm icon mạng xã hội ở đây) */}
        </div>
      </div>
      <div className={styles.copyright}>
        © {currentYear} baihat-hopam.vn - A project by Captain. All Rights Reserved.
      </div>
    </footer>
  );
}
