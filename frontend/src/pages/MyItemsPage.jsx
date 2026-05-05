// frontend/src/pages/MyItemsPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ItemCard from '../components/common/ItemCard';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import usePagination from '../hooks/usePagination';
import styles from './MyItemsPage.module.css';

export default function MyItemsPage() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('lost');
  const { page, size, totalPages, setTotalPages, goToPage } = usePagination(0, 8);

  useEffect(() => {
    setLoading(true);
    const endpoint = tab === 'lost' ? '/lost-items' : '/found-items';
    axiosInstance.get(endpoint, { params: { page, size } })
      .then(r => {
        const data = r.data.data;
        if (tab === 'lost') setLostItems(data.content || []);
        else setFoundItems(data.content || []);
        setTotalPages(data.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab, page, size]);

  const items = tab === 'lost' ? lostItems : foundItems;

  return (
    <div className="container">
      <div className={styles.header}>
        <h1>My Reports</h1>
        <div className={styles.actions}>
          <Link to="/report-lost" className="btn btn-primary btn-sm">+ Report Lost</Link>
          <Link to="/report-found" className="btn btn-dark btn-sm">+ Report Found</Link>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'lost' ? styles.active : ''}`} onClick={() => { setTab('lost'); goToPage(0); }}>
          Lost Items
        </button>
        <button className={`${styles.tab} ${tab === 'found' ? styles.active : ''}`} onClick={() => { setTab('found'); goToPage(0); }}>
          Found Items
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>No {tab} items reported yet.</p>
              <Link to={`/report-${tab}`} className="btn btn-primary mt-16">Report {tab === 'lost' ? 'Lost' : 'Found'} Item</Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {items.map(item => <ItemCard key={item.id} item={item} type={tab} />)}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
}
