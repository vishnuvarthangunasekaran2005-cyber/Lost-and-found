// frontend/src/hooks/usePagination.js
import { useState } from 'react';

export default function usePagination(initialPage = 0, initialSize = 12) {
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);

  const goToPage = (p) => setPage(p);
  const nextPage = () => setPage(p => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setPage(p => Math.max(p - 1, 0));

  return { page, size, totalPages, setTotalPages, goToPage, nextPage, prevPage };
}
