// frontend/src/components/claims/ClaimForm.jsx
import { useState } from 'react';
import { createClaim } from '../../api/claimApi';
import ImageUpload from '../common/ImageUpload';
import { toast } from 'react-toastify';
import styles from './ClaimForm.module.css';

export default function ClaimForm({ foundItemId, onSuccess, onCancel }) {
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) { toast.error('Please describe your claim'); return; }
    if (!contact.trim()) { toast.error('Please provide your contact info'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('claim', new Blob([JSON.stringify({ foundItemId, description, claimantContact: contact })], { type: 'application/json' }));
      if (proofFile) fd.append('proof', proofFile);
      await createClaim(fd);
      toast.success('Claim submitted successfully!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Submit a Claim</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Contact Info (phone / email) *</label>
            <input className="form-control" value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="e.g. +1 234 567 8900 or you@email.com" />
          </div>
          <div className="form-group">
            <label>Describe why this item belongs to you *</label>
            <textarea className="form-control" rows={4} value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide details that prove ownership (serial number, unique features, etc.)" />
            <span className="text-muted" style={{fontSize:'12px'}}>{description.length}/500</span>
          </div>
          <div className="form-group">
            <label>Proof Image (optional)</label>
            <ImageUpload onFileSelect={setProofFile} label="Upload proof of ownership" />
          </div>
          <div className={styles.actions}>
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
