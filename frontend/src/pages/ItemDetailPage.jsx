// frontend/src/pages/ItemDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLostItem } from '../api/lostItemApi';
import { getFoundItem } from '../api/foundItemApi';
import { deleteLostItem } from '../api/lostItemApi';
import { deleteFoundItem } from '../api/foundItemApi';
import StatusBadge from '../components/common/StatusBadge';
import MatchCard from '../components/items/MatchCard';
import ClaimForm from '../components/claims/ClaimForm';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import styles from './ItemDetailPage.module.css';

const PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23EAEDED" width="400" height="300"/><text fill="%23999" font-size="60" x="50%25" y="50%25" text-anchor="middle" dy=".3em">📦</text></svg>';

export default function ItemDetailPage() {
  const { type, id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaim, setShowClaim] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetch = type === 'lost' ? getLostItem : getFoundItem;
    fetch(id).then(r => setItem(r.data.data)).catch(() => toast.error('Item not found')).finally(() => setLoading(false));
  }, [id, type]);

  const handleDelete = async () => {
    try {
      if (type === 'lost') await deleteLostItem(id);
      else await deleteFoundItem(id);
      toast.success('Item deleted');
      navigate(type === 'lost' ? '/lost-items' : '/found-items');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!item) return <div className="container"><p>Item not found.</p></div>;

  const imageUrl = item.imageUrl ? `/api/files/${item.imageUrl}` : PLACEHOLDER;
  const isOwner = currentUser?.id === item.reportedBy;
  const isAdmin = currentUser?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_STAFF'].includes(r));
  const date = item.lostDate || item.foundDate;

  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.imageSection}>
          <img src={imageUrl} alt={item.title} className={styles.image}
            onError={e => { e.target.src = PLACEHOLDER; }} />
        </div>

        <div className={styles.details}>
          <div className={styles.topRow}>
            <span className={styles.category}>{item.category}</span>
            <StatusBadge status={item.status} />
          </div>
          <h1 className={styles.title}>{item.title}</h1>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}><span className={styles.metaLabel}>📍 Location</span><span>{item.location}</span></div>
            <div className={styles.metaItem}><span className={styles.metaLabel}>📅 Date</span><span>{date ? new Date(date).toLocaleDateString() : 'N/A'}</span></div>
            <div className={styles.metaItem}><span className={styles.metaLabel}>👤 Reported by</span><span>{item.reporterName}</span></div>
            <div className={styles.metaItem}><span className={styles.metaLabel}>📋 Reported on</span><span>{item.reportedDate ? new Date(item.reportedDate).toLocaleDateString() : 'N/A'}</span></div>
            {type === 'found' && item.contactInfo && (
              <div className={styles.metaItem} style={{gridColumn:'1/-1',background:'#fff8e7',padding:'10px',borderRadius:'4px',border:'1px solid #FF9900'}}>
                <span className={styles.metaLabel}>📞 Contact Finder</span>
                <span style={{fontWeight:700,color:'#E47911'}}>{item.contactInfo}</span>
              </div>
            )}
          </div>

          <div className={styles.descSection}>
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className={styles.actions}>
            {type === 'found' && currentUser && !isOwner && (
              <button className="btn btn-primary btn-lg" onClick={() => setShowClaim(true)}>
                🙋 Submit a Claim
              </button>
            )}
            {(isOwner || isAdmin) && (
              <>
                <button className="btn btn-outline" onClick={() => navigate(`/report-${type}?edit=${id}`)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {type === 'lost' && item.matches?.length > 0 && (
        <section className={styles.matchSection}>
          <h2 className="section-title">Potential Matches ({item.matches.length})</h2>
          <div className={styles.matchGrid}>
            {item.matches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {showClaim && <ClaimForm foundItemId={id} onSuccess={() => setShowClaim(false)} onCancel={() => setShowClaim(false)} />}
      {showDelete && (
        <ConfirmModal
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
