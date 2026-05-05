// frontend/src/pages/MyClaimsPage.jsx
import { useEffect, useState } from 'react';
import { getMyClaims } from '../api/claimApi';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import usePagination from '../hooks/usePagination';
import styles from './MyClaimsPage.module.css';

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page, size, totalPages, setTotalPages, goToPage } = usePagination(0, 10);

  useEffect(() => {
    setLoading(true);
    getMyClaims({ page, size })
      .then(r => {
        setClaims(r.data.data?.content || []);
        setTotalPages(r.data.data?.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, size]);

  return (
    <div className="container">
      <h1 className={styles.title}>My Claims</h1>
      {loading ? <LoadingSpinner /> : (
        <>
          {claims.length === 0 ? (
            <div className={styles.empty}>No claims submitted yet.</div>
          ) : (
            <div className={styles.list}>
              {claims.map(claim => (
                <div key={claim.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.claimId}>Claim #{claim.id?.slice(-6)}</span>
                    <StatusBadge status={claim.status} />
                  </div>
                  <p className={styles.desc}>{claim.description}</p>
                  {claim.reviewNote && (
                    <p className={styles.note}>
                      <strong>Review Note:</strong> {claim.reviewNote}
                    </p>
                  )}
                  <p className="text-muted" style={{fontSize:'12px'}}>
                    Submitted: {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
}
