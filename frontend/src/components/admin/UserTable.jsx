// frontend/src/components/admin/UserTable.jsx
import { useState } from 'react';
import { updateUserRole } from '../../api/adminApi';
import { toast } from 'react-toastify';
import styles from './UserTable.module.css';

const ROLES = ['ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN'];

export default function UserTable({ users, onRefresh }) {
  const [updating, setUpdating] = useState(null);

  const handleRoleChange = async (userId, role) => {
    setUpdating(userId);
    try {
      await updateUserRole(userId, role);
      toast.success('Role updated');
      onRefresh?.();
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Roles</th><th>Joined</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone || '-'}</td>
              <td>{u.roles?.join(', ')}</td>
              <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
              <td>
                <select
                  className="form-control"
                  style={{ width: 'auto', fontSize: '12px', padding: '4px 8px' }}
                  value={u.roles?.[0] || 'ROLE_USER'}
                  onChange={e => handleRoleChange(u.id, e.target.value)}
                  disabled={updating === u.id}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r.replace('ROLE_', '')}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
