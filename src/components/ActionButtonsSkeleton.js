// src/components/ActionButtonsSkeleton.js

// import styles from './ActionButtonsSkeleton.module.css';

// export default function ActionButtonsSkeleton() {
//   return (
//     <div className={styles.skeletonContainer}>
//       <div className={`${styles.skeletonButton} ${styles.skeletonFavorite}`}></div>
//       <div className={`${styles.skeletonButton} ${styles.skeletonPdf}`}></div>
//     </div>
//   );
// }

// src/components/ActionButtonsSkeleton.js
import styles from "./ActionButtonsSkeleton.module.css";

export default function ActionButtonsSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonButton}></div>
      <div className={styles.skeletonButton}></div>
    </div>
  );
}
