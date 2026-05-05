// frontend/src/pages/ProfilePage.jsx
import useAuth from '../hooks/useAuth';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { currentUser } = useAuth();

  return (
    <div className="container">
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.avatar}>{currentUser?.name?.[0]?.toUpperCase()}</div>
          <h2 className={styles.name}>{currentUser?.name}</h2>
          <p className={styles.email}>{currentUser?.email}</p>
          <div className={styles.roles}>
            {currentUser?.roles?.map(r => (
              <span key={r} className={styles.role}>{r.replace('ROLE_', '')}</span>
            ))}
          </div>
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Member ID</span>
              <span className={styles.infoVal}>{currentUser?.id?.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
