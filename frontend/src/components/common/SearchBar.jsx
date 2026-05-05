// frontend/src/components/common/SearchBar.jsx
import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.btn}>Search</button>
    </form>
  );
}