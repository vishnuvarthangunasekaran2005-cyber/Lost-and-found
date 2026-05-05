// frontend/src/pages/FoundItemsPage.jsx
import { useEffect, useState } from 'react';
import { getFoundItems } from '../api/foundItemApi';
import ItemGrid from '../components/items/ItemGrid';
import ItemFilters from '../components/items/ItemFilters';
import Pagination from '../components/common/Pagination';
import usePagination from '../hooks/usePagination';
import styles from './ItemsPage.module.css';

export default function FoundItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const { page, size, totalPages, setTotalPages, goToPage } = usePagination();

  useEffect(() => {
    setLoading(true);
    getFoundItems({ ...filters, page, size })
      .then(r => {
        setItems(r.data.data?.content || []);
        setTotalPages(r.data.data?.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, page, size]);

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Found Items</h1>
        <p className="text-muted">Browse all reported found items</p>
      </div>
      <ItemFilters filters={filters} onChange={f => { setFilters(f); goToPage(0); }} type="found" />
      <ItemGrid items={items} type="found" loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
