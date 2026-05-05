// frontend/src/pages/LostItemsPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLostItems } from '../api/lostItemApi';
import ItemGrid from '../components/items/ItemGrid';
import ItemFilters from '../components/items/ItemFilters';
import Pagination from '../components/common/Pagination';
import usePagination from '../hooks/usePagination';
import styles from './ItemsPage.module.css';

export default function LostItemsPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ keyword: searchParams.get('keyword') || '' });
  const { page, size, totalPages, setTotalPages, goToPage } = usePagination();

  useEffect(() => {
    setLoading(true);
    getLostItems({ ...filters, page, size })
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
        <h1 className={styles.title}>Lost Items</h1>
        <p className="text-muted">Browse all reported lost items</p>
      </div>
      <ItemFilters filters={filters} onChange={f => { setFilters(f); goToPage(0); }} type="lost" />
      <ItemGrid items={items} type="lost" loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
