// frontend/src/components/admin/PendingItemsTable.jsx
import { approveItem, rejectItem } from '../../api/adminApi';
import { toast } from 'react-toastify';
import StatusBadge from '../common/StatusBadge';
import styles from './PendingItemsTable.module.css';

export default function PendingItemsTable({ items, type, onRefresh }) {
  const handleApprove = async (id) => {
    try {
      await approveItem(id, type);
      toast.success('Item approved');
      onRefresh?.();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (id) => {
    try {
      await rejectItem(id, type);
      toast.success('Item rejected');
      onRefresh?.();
    } catch { toast.error('Failed to reject'); }
  };

  if (!items?.length) return <p className="text-muted">No pending {type} items.</p>;

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr><th>Title</th><th>Category</th><th>Location</th><th>Reporter</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.location}</td>
              <td>{item.reporterName}</td>
              <td>{item.reportedDate ? new Date(item.reportedDate).toLocaleDateString() : '-'}</td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(item.id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(item.id)}>Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
