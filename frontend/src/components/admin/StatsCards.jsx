// frontend/src/components/admin/StatsCards.jsx
import styles from './StatsCards.module.css';

const CARDS = [
  { key: 'totalLostItems', label: 'Total Lost', icon: '🔍', color: '#B12704' },
  { key: 'totalFoundItems', label: 'Total Found', icon: '📦', color: '#0066c0' },
  { key: 'returnedItems', label: 'Returned', icon: '✅', color: '#007600' },
  { key: 'totalMatches', label: 'Matches', icon: '🔗', color: '#FF9900' },
  { key: 'pendingClaims', label: 'Pending Claims', icon: '⏳', color: '#565959' },
  { key: 'totalUsers', label: 'Users', icon: '👥', color: '#131921' },
  { key: 'pendingApprovals', label: 'Pending Approvals', icon: '📋', color: '#E47911' },
];

export default function StatsCards({ stats }) {
  if (!stats) return null;
  return (
    <div className={styles.grid}>
      {CARDS.map(c => (
        <div key={c.key} className={styles.card} style={{ borderTop: `3px solid ${c.color}` }}>
          <div className={styles.icon}>{c.icon}</div>
          <div className={styles.value}>{stats[c.key] ?? 0}</div>
          <div className={styles.label}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}
