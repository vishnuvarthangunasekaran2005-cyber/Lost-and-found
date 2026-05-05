// frontend/src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from './Sidebar.module.css';

const MENU_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/lost-items', label: 'Lost Items', icon: '🔍' },
  { path: '/found-items', label: 'Found Items', icon: '📦' },
  { path: '/report-lost', label: 'Report Lost', icon: '📝', auth: true },
  { path: '/report-found', label: 'Report Found', icon: '📝', auth: true },
  { path: '/my-items', label: 'My Reports', icon: '📋', auth: true },
  { path: '/my-claims', label: 'My Claims', icon: '🙋', auth: true },
];

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  const filteredItems = MENU_ITEMS.filter(item => !item.auth || currentUser);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <span className={styles.logo}>FindIt<span>.</span></span>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <nav className={styles.nav}>
          {filteredItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={onClose}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}