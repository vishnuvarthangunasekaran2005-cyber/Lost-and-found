// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLostItems } from '../api/lostItemApi';
import { getFoundItems } from '../api/foundItemApi';
import ItemCard from '../components/common/ItemCard';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [stats, setStats] = useState({ lost: 0, found: 0, returned: 0 });

  useEffect(() => {
    getLostItems({ page: 0, size: 8 }).then(r => {
      const data = r.data.data;
      setLostItems(data.content || []);
      setStats(s => ({ ...s, lost: data.totalElements || 0 }));
    }).catch(() => {});
    getFoundItems({ page: 0, size: 8 }).then(r => {
      const data = r.data.data;
      setFoundItems(data.content || []);
      setStats(s => ({ ...s, found: data.totalElements || 0 }));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Lost Something? Found Something?</h1>
          <p className={styles.heroSub}>FindIt connects people with their lost belongings using smart matching technology.</p>
          <div className={styles.heroBtns}>
            <Link to="/report-lost" className="btn btn-primary btn-lg">Report Lost Item</Link>
            <Link to="/report-found" className="btn btn-dark btn-lg">Report Found Item</Link>
            <Link to="/lost-items" className="btn btn-outline btn-lg" style={{color:'#fff',borderColor:'#fff'}}>Browse Items</Link>
          </div>
        </div>
      </section>

      <div className="container">
        <section className={styles.statsStrip}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.lost}</span>
            <span className={styles.statLabel}>Items Reported Lost</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.found}</span>
            <span className={styles.statLabel}>Items Found</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>🔗</span>
            <span className={styles.statLabel}>Smart Matching</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>🔒</span>
            <span className={styles.statLabel}>Secure & Verified</span>
          </div>
        </section>

        <section className={styles.section}>
          <div className="flex-between mb-16">
            <h2 className="section-title">Recent Lost Items</h2>
            <Link to="/lost-items" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          <div className="scroll-x">
            {lostItems.length === 0
              ? <p className="text-muted">No lost items yet.</p>
              : lostItems.map(item => <ItemCard key={item.id} item={item} type="lost" />)
            }
          </div>
        </section>

        <section className={styles.section}>
          <div className="flex-between mb-16">
            <h2 className="section-title">Recent Found Items</h2>
            <Link to="/found-items" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          <div className="scroll-x">
            {foundItems.length === 0
              ? <p className="text-muted">No found items yet.</p>
              : foundItems.map(item => <ItemCard key={item.id} item={item} type="found" />)
            }
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2 className="section-title">How It Works</h2>
          <div className={styles.steps}>
            {[
              { icon: '📝', step: '1', title: 'Report', desc: 'Report your lost or found item with details and a photo.' },
              { icon: '🔗', step: '2', title: 'Match', desc: 'Our algorithm automatically matches lost and found items.' },
              { icon: '🤝', step: '3', title: 'Reunite', desc: 'Submit a claim and get your item back safely.' },
            ].map(s => (
              <div key={s.step} className={styles.step}>
                <div className={styles.stepIcon}>{s.icon}</div>
                <div className={styles.stepNum}>Step {s.step}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
