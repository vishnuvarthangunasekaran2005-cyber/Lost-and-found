// frontend/src/components/items/ItemGrid.jsx
import ItemCard from '../common/ItemCard';
import styles from './ItemGrid.module.css';

export default function ItemGrid({ items, type, loading }) {
  if (loading) return <div className={styles.empty}>Loading...</div>;
  if (!items?.length) return <div className={styles.empty}>No items found.</div>;

  return (
    <div className={styles.grid}>
      {items.map(item => <ItemCard key={item.id} item={item} type={type} />)}
    </div>
  );
}
