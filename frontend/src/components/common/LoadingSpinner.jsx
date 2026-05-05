// frontend/src/components/common/LoadingSpinner.jsx
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 40 }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} style={{ width: size, height: size }} />
    </div>
  );
}
