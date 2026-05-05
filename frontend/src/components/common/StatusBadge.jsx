// frontend/src/components/common/StatusBadge.jsx
const STATUS_STYLES = {
  LOST: { background: '#B12704', color: '#fff' },
  MATCHED: { background: '#FF9900', color: '#111' },
  RETURNED: { background: '#007600', color: '#fff' },
  UNCLAIMED: { background: '#565959', color: '#fff' },
  CLAIMED: { background: '#0066c0', color: '#fff' },
  VERIFIED: { background: '#007600', color: '#fff' },
  PENDING: { background: '#FF9900', color: '#111' },
  APPROVED: { background: '#007600', color: '#fff' },
  REJECTED: { background: '#B12704', color: '#fff' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { background: '#ccc', color: '#111' };
  return (
    <span className="badge" style={style}>{status}</span>
  );
}
