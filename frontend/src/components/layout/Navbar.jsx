// frontend/src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { NotificationContext } from '../../context/NotificationContext';
import { useContext } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { notifications, unreadCount, markRead } = useContext(NotificationContext);
  const [search, setSearch] = useState('');
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/lost-items?keyword=${encodeURIComponent(search)}`);
  };

  const handleLogout = () => {
    logout();
    setShowUser(false);
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.top}>
        <Link to="/" className={styles.logo}>FindIt<span>.</span></Link>

        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            placeholder="Search lost or found items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn}>🔍</button>
        </form>

        <div className={styles.actions}>
          {currentUser && (
            <div className={styles.userMenu} ref={notifRef}>
              <button className={styles.iconBtn} onClick={() => setShowNotif(v => !v)}>
                🔔
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              {showNotif && (
                <div className={styles.notifDropdown}>
                  {notifications.length === 0 ? (
                    <div className={styles.notifEmpty}>No notifications</div>
                  ) : notifications.slice(0, 10).map(n => (
                    <div
                      key={n.id}
                      className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}
                      onClick={() => {
                        markRead(n.id);
                        setShowNotif(false);
                        if (n.type === 'CLAIM') {
                          navigate('/incoming-claims');
                        } else if (n.type === 'CLAIM_APPROVED' || n.type === 'CLAIM_REJECTED') {
                          navigate('/my-claims');
                        } else if (n.type === 'MATCH' && n.referenceId) {
                          navigate(`/items/lost/${n.referenceId}`);
                        }
                      }}
                      style={{cursor:'pointer'}}
                    >
                      <div className={styles.notifTitle}>{n.title}</div>
                      <div className={styles.notifMsg}>{n.message}</div>
                      <div style={{fontSize:'11px',color:'#000',marginTop:'2px'}}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentUser ? (
            <div className={styles.userMenu} ref={userRef}>
              <button className={styles.userBtn} onClick={() => setShowUser(v => !v)}>
                Hello, {currentUser.name?.split(' ')[0]} ▾
              </button>
              {showUser && (
                <div className={styles.dropdown}>
                  <Link to="/my-items" className={styles.dropdownItem} onClick={() => setShowUser(false)}>My Reports</Link>
                  <Link to="/my-claims" className={styles.dropdownItem} onClick={() => setShowUser(false)}>My Claims</Link>
                  <Link to="/incoming-claims" className={styles.dropdownItem} onClick={() => setShowUser(false)}>📬 Incoming Claims</Link>
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setShowUser(false)}>Profile</Link>
                  {(currentUser.roles?.includes('ROLE_ADMIN') || currentUser.roles?.includes('ROLE_STAFF')) && (
                    <Link to="/admin" className={styles.dropdownItem} onClick={() => setShowUser(false)}>Admin Panel</Link>
                  )}
                  <hr className={styles.dropdownDivider} />
                  <button className={styles.dropdownItem} onClick={handleLogout} style={{width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer'}}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.quickBtn}>Sign In</Link>
          )}

          <div className={styles.quickBtns}>
            <Link to="/report-lost" className={styles.quickBtn}>+ Report Lost</Link>
            <Link to="/report-found" className={styles.quickBtn}>+ Report Found</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
