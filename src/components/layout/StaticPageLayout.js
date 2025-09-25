// src/components/layout/StaticPageLayout.js
import styles from "./StaticPageLayout.module.css";

export default function StaticPageLayout({ title, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
