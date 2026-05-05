// frontend/src/components/items/MatchCard.jsx
import { Link } from 'react-router-dom';
import styles from './MatchCard.module.css';

const PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="%23EAEDED" width="80" height="80"/><text fill="%23999" font-size="30" x="50%25" y="50%25" text-anchor="middle" dy=".3em">📦</text></svg>';

export default function MatchCard({ match }) {
  const item = match.foundItem || match.lostItem;
  if (!item) return null;
  const type = match.foundItem ? 'found' : 'lost';
  const imageUrl = item.imageUrl ? `/api/files/${item.imageUrl}` : PLACEHOLDER;

  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={item.title} className={styles.img} onError={e => { e.target.src = PLACEHOLDER; }} />
      <div className={styles.info}>
        <div className={styles.score}>
          <span className={styles.scoreNum}>{Math.round(match.score)}%</span>
          <span className={styles.scoreLabel}>Match</span>
        </div>
        <h4 className={styles.title}>{item.title}</h4>
        <p className={styles.location}>📍 {item.location}</p>
        <div className={styles.breakdown}>
          <span>Category: {match.categoryScore}pts</span>
          <span>Location: {match.locationScore}pts</span>
          <span>Keywords: {match.keywordScore}pts</span>
        </div>
        <Link to={`/items/${type}/${item.id}`} className="btn btn-primary btn-sm" style={{marginTop:'8px'}}>
          View Item
        </Link>
      </div>
    </div>
  );
}
