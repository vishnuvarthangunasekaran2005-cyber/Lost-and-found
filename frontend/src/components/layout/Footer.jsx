// frontend/src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>FindIt<span>.</span></span>
          <p>Helping reunite people with their lost belongings.</p>
        </div>
        <div className={styles.links}>
          <Link to="/lost-items">Lost Items</Link>
          <Link to="/found-items">Found Items</Link>
          <Link to="/report-lost">Report Lost</Link>
          <Link to="/report-found">Report Found</Link>
        </div>
        <div className={styles.copy}>© {new Date().getFullYear()} FindIt. All rights reserved.</div>
      </div>
    </footer>
  );
}
