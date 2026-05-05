// frontend/src/pages/IncomingClaimsPage.jsx
import { useEffect, useState } from 'react';
import { getMyFoundItems } from '../api/foundItemApi';
import { getClaimsForItem, approveClaim, rejectClaim } from '../api/claimApi';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import styles from './IncomingClaimsPage.module.css';

export default function IncomingClaimsPage() {
  const [myItems, setMyItems] = useState([]);
  const [claimsMap, setClaimsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getMyFoundItems({ page: 0, size: 50 })
      .then(r => {
        const mine = r.data.data?.content || [];
        setMyItems(mine);
        return Promise.all(mine.map(item =>
          getClaimsForItem(item.id).then(cr => ({ id: item.id, claims: cr.data.data || [] })).catch(() => ({ id: item.id, claims: [] }))
        ));
      })
      .then(results => {
        const map = {};
        results.forEach(r => { map[r.id] = r.claims; });
        setClaimsMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (claimId, itemId) => {
    try {
      await approveClaim(claimId, '');
      toast.success('Claim approved!');
      const cr = await getClaimsForItem(itemId);
      setClaimsMap(m => ({ ...m, [itemId]: cr.data.data || [] }));
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (claimId, itemId) => {
    try {
      await rejectClaim(claimId, 'Not verified');
      toast.success('Claim rejected');
      const cr = await getClaimsForItem(itemId);
      setClaimsMap(m => ({ ...m, [itemId]: cr.data.data || [] }));
    } catch { toast.error('Failed to reject'); }
  };

  if (loading) return <LoadingSpinner />;

  const itemsWithClaims = myItems.filter(i => (claimsMap[i.id] || []).length > 0);

  return (
    <div className="container">
      <h1 className={styles.title}>📬 Incoming Claims</h1>
      <p className="text-muted" style={{ marginBottom: '20px' }}>People claiming items you found</p>

      {itemsWithClaims.length === 0 ? (
        <div className={styles.empty}>No claims on your found items yet.</div>
      ) : (
        itemsWithClaims.map(item => (
          <div key={item.id} className={styles.itemBlock}>
            <div className={styles.itemHeader} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <div>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemLoc}>📍 {item.location}</span>
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.claimCount}>{claimsMap[item.id]?.length} claim(s)</span>
                <span>{expanded === item.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === item.id && (
              <div className={styles.claimsList}>
                {claimsMap[item.id].map(claim => (
                  <div key={claim.id} className={styles.claimCard}>
                    <div className={styles.claimTop}>
                      <div>
                        <span className={styles.claimantName}>👤 {claim.claimantName}</span>
                        <StatusBadge status={claim.status} />
                      </div>
                      <span className={styles.claimDate}>{claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : ''}</span>
                    </div>

                    <p className={styles.claimDesc}>{claim.description}</p>

                    {claim.claimantContact && (
                      <div className={styles.contactBox}>
                        <span className={styles.contactLabel}>📞 Contact to return item:</span>
                        <span className={styles.contactVal}>{claim.claimantContact}</span>
                        <a href={`mailto:${claim.claimantContact}`} className="btn btn-outline btn-sm" style={{ marginLeft: '8px' }}>✉️ Email</a>
                        <a href={`tel:${claim.claimantContact}`} className="btn btn-outline btn-sm" style={{ marginLeft: '4px' }}>📱 Call</a>
                      </div>
                    )}

                    {claim.status === 'PENDING' && (
                      <div className={styles.actions}>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(claim.id, item.id)}>✅ Approve & Contact</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(claim.id, item.id)}>❌ Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
