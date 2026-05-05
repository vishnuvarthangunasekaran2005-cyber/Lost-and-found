// frontend/src/components/common/ItemCard.jsx
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import styles from './ItemCard.module.css';

const PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect fill="%23EAEDED" width="300" height="200"/><text fill="%23999" font-size="40" x="50%25" y="50%25" text-anchor="middle" dy=".3em">📦</text></svg>';

export default function ItemCard({ item, type = 'lost' }) {
  const imageUrl = item.imageUrl ? `/api/files/${item.imageUrl}` : PLACEHOLDER;
  const detailPath = `/items/${type}/${item.id}`;
  const date = item.lostDate || item.foundDate || item.reportedDate;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={item.title} className={styles.image}
          onError={e => { e.target.src = PLACEHOLDER; }} />
        <div className={styles.statusOverlay}>
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{item.category}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <div className={styles.meta}>
          <span>📍 {item.location}</span>
          <span>📅 {date ? new Date(date).toLocaleDateString() : 'N/A'}</span>
        </div>
        <p className={styles.desc}>{item.description}</p>
      </div>
      <div className={styles.footer}>
        <span className={styles.reporter}>By {item.reporterName}</span>
        <Link to={detailPath} className="btn btn-primary btn-full btn-sm">View Details</Link>
      </div>
    </div>
  );
}
