'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const range = 2; // How many pages to show around current

  pages.push(1);

  if (currentPage > range + 2) pages.push('...');

  for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - range - 1) pages.push('...');

  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="pagination">
      <button
        className="pag-btn prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>

      <div className="page-numbers">
        {pages.map((p, idx) => (
          p === '...' ? (
            <span key={`dots-${idx}`} className="dots">...</span>
          ) : (
            <button
              key={p}
              className={`num-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        ))}
      </div>

      <button
        className="pag-btn next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
