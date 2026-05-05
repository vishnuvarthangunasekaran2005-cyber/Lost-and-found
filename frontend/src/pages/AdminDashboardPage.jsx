// frontend/src/pages/AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import { getStats, getUsers, getPendingItems } from '../api/adminApi';
import StatsCards from '../components/admin/StatsCards';
import UserTable from '../components/admin/UserTable';
import PendingItemsTable from '../components/admin/PendingItemsTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './AdminDashboardPage.module.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingLost, setPendingLost] = useState([]);
  const [pendingFound, setPendingFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, pendingRes] = await Promise.all([
        getStats(), getUsers({ page: 0, size: 50 }), getPendingItems({ page: 0, size: 20 })
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data?.content || []);
      setPendingLost(pendingRes.data.data?.lostItems?.content || []);
      setPendingFound(pendingRes.data.data?.foundItems?.content || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <h1 className={styles.title}>Admin Dashboard</h1>
      <StatsCards stats={stats} />

      <div className={styles.tabs}>
        {['overview', 'pending', 'users'].map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '📊 Overview' : t === 'pending' ? '⏳ Pending Items' : '👥 Users'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>System Overview</h2>
          <p className="text-muted">Use the tabs above to manage pending items and users.</p>
        </div>
      )}

      {tab === 'pending' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pending Lost Items ({pendingLost.length})</h2>
          <PendingItemsTable items={pendingLost} type="lost" onRefresh={fetchData} />
          <h2 className={styles.sectionTitle} style={{marginTop:'24px'}}>Pending Found Items ({pendingFound.length})</h2>
          <PendingItemsTable items={pendingFound} type="found" onRefresh={fetchData} />
        </div>
      )}

      {tab === 'users' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>All Users ({users.length})</h2>
          <UserTable users={users} onRefresh={fetchData} />
        </div>
      )}
    </div>
  );
}
