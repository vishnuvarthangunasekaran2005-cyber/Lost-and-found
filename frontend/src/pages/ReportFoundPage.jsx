// frontend/src/pages/ReportFoundPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFoundItem } from '../api/foundItemApi';
import ImageUpload from '../components/common/ImageUpload';
import { toast } from 'react-toastify';
import styles from './ReportPage.module.css';

const CATEGORIES = [
  { id: 'Electronics', icon: '📱' }, { id: 'Accessories', icon: '👜' },
  { id: 'Bags', icon: '🎒' }, { id: 'Jewelry', icon: '💍' },
  { id: 'Keys', icon: '🔑' }, { id: 'Documents', icon: '📄' },
  { id: 'Clothing', icon: '👕' }, { id: 'Other', icon: '📦' },
];

export default function ReportFoundPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', foundDate: '', contactInfo: '' });
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
        foundDate: form.foundDate ? new Date(form.foundDate).toISOString() : undefined
      })], { type: 'application/json' }));
      if (image) fd.append('image', image);
      const res = await createFoundItem(fd);
      toast.success('Found item reported successfully!');
      navigate(`/items/found/${res.data.data.id}`);
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
          <h1>Report a Found Item</h1>
          <p className="text-muted">Help reunite someone with their lost belongings.</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Item Details</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Item Title *</label>
                <input className="form-control" required value={form.title}
                  onChange={e => set('title', e.target.value)} placeholder="e.g. Found Black Wallet" />
              </div>
              <div className="form-group">
                <label>Date Found</label>
                <input className="form-control" type="date" value={form.foundDate}
                  onChange={e => set('foundDate', e.target.value)} max={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-control" required rows={4} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the item — color, brand, condition, any identifying features..." />
            </div>
            <div className="form-group">
              <label>Location Found *</label>
              <input className="form-control" required value={form.location}
                onChange={e => set('location', e.target.value)} placeholder="e.g. Central Park, New York" />
            </div>
            <div className="form-group">
              <label>Contact Info (phone / email for finder to reach you)</label>
              <input className="form-control" value={form.contactInfo}
                onChange={e => set('contactInfo', e.target.value)} placeholder="e.g. +1 234 567 8900 or you@email.com" />
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
            <ImageUpload onFileSelect={setImage} label="Upload a photo of the found item" />
          </div>

          <div className={styles.submitRow}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : '📦 Report Found Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
