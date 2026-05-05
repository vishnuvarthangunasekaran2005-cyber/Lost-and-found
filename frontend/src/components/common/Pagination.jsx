// frontend/src/components/common/Pagination.jsx
import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i);

  return (
    <div className={styles.pagination}>
      <button className={styles.btn} disabled={page === 0} onClick={() => onPageChange(page - 1)}>‹ Prev</button>
      {pages.map(p => (
        <button key={p} className={`${styles.btn} ${p === page ? styles.active : ''}`} onClick={() => onPageChange(p)}>
          {p + 1}
        </button>
      ))}
      <button className={styles.btn} disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>Next ›</button>
    </div>
  );
}
