// frontend/src/components/items/ItemFilters.jsx
import useDebounce from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import styles from './ItemFilters.module.css';

const CATEGORIES = ['Electronics', 'Accessories', 'Bags', 'Jewelry', 'Keys', 'Documents', 'Clothing', 'Other'];

export default function ItemFilters({ filters, onChange, type = 'lost' }) {
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const debounced = useDebounce(keyword, 400);

  useEffect(() => {
    onChange({ ...filters, keyword: debounced });
  }, [debounced]);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className={styles.bar}>
      <input className="form-control" placeholder="Search..." value={keyword}
        onChange={e => setKeyword(e.target.value)} style={{ flex: 2 }} />
      <select className="form-control" value={filters.category || ''} onChange={e => set('category', e.target.value)}>
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input className="form-control" placeholder="Location" value={filters.location || ''}
        onChange={e => set('location', e.target.value)} />
      <select className="form-control" value={filters.status || ''} onChange={e => set('status', e.target.value)}>
        <option value="">All Statuses</option>
        {type === 'lost'
          ? ['LOST', 'MATCHED', 'RETURNED'].map(s => <option key={s} value={s}>{s}</option>)
          : ['UNCLAIMED', 'CLAIMED', 'VERIFIED'].map(s => <option key={s} value={s}>{s}</option>)
        }
      </select>
      <button className="btn btn-outline btn-sm" onClick={() => { setKeyword(''); onChange({}); }}>Clear</button>
    </div>
  );
}
