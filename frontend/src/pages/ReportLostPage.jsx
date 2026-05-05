// frontend/src/pages/ReportLostPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLostItem } from '../api/lostItemApi';
import ImageUpload from '../components/common/ImageUpload';
import { toast } from 'react-toastify';
import styles from './ReportPage.module.css';

const CATEGORIES = [
  { id: 'Electronics', icon: '📱' }, { id: 'Accessories', icon: '👜' },
  { id: 'Bags', icon: '🎒' }, { id: 'Jewelry', icon: '💍' },
  { id: 'Keys', icon: '🔑' }, { id: 'Documents', icon: '📄' },
  { id: 'Clothing', icon: '👕' }, { id: 'Other', icon: '📦' },
];

export default function ReportLostPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', lostDate: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('item', new Blob([JSON.stringify({
        ...form,
        lostDate: form.lostDate ? new Date(form.lostDate).toISOString() : undefined
      })], { type: 'application/json' }));
      if (image) fd.append('image', image);
      const res = await createLostItem(fd);
      toast.success('Lost item reported successfully!');
      navigate(`/items/lost/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Report a Lost Item</h1>
          <p className="text-muted">Provide as much detail as possible to help find your item.</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Item Details</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Item Title *</label>
                <input className="form-control" required value={form.title}
                  onChange={e => set('title', e.target.value)} placeholder="e.g. Black Leather Wallet" />
                <span className="text-muted" style={{fontSize:'12px'}}>{form.title.length}/100</span>
              </div>
              <div className="form-group">
                <label>Date Lost</label>
                <input className="form-control" type="date" value={form.lostDate}
                  onChange={e => set('lostDate', e.target.value)} max={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-control" required rows={4} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the item in detail — color, brand, unique features..." />
              <span className="text-muted" style={{fontSize:'12px'}}>{form.description.length}/500</span>
            </div>
            <div className="form-group">
              <label>Location Lost *</label>
              <input className="form-control" required value={form.location}
                onChange={e => set('location', e.target.value)} placeholder="e.g. Central Park, New York" />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Category *</h3>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map(c => (
                <button key={c.id} type="button"
                  className={`${styles.catBtn} ${form.category === c.id ? styles.catActive : ''}`}
                  onClick={() => set('category', c.id)}>
                  <span className={styles.catIcon}>{c.icon}</span>
                  <span className={styles.catLabel}>{c.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Item Photo</h3>
            <ImageUpload onFileSelect={setImage} label="Upload a photo of the lost item" />
          </div>

          <div className={styles.submitRow}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : '🔍 Report Lost Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
