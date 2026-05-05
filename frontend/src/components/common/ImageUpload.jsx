// frontend/src/components/common/ImageUpload.jsx
import { useState, useRef } from 'react';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ onFileSelect, label = 'Upload Image' }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, WEBP allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB');
      return;
    }
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
      {preview ? (
        <img src={preview} alt="preview" className={styles.preview} />
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.icon}>📷</span>
          <p>{label}</p>
          <p className="text-muted">Drag & drop or click to browse</p>
          <p className="text-muted" style={{fontSize:'11px'}}>JPG, PNG, WEBP · Max 5MB</p>
        </div>
      )}
    </div>
  );
}
