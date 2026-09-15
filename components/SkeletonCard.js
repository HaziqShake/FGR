'use client';

import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="game-card glass skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="content">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-specs">
          <div className="skeleton-chip shimmer"></div>
          <div className="skeleton-chip shimmer"></div>
          <div className="skeleton-chip shimmer"></div>
        </div>
        <div className="skeleton-tags">
          <div className="skeleton-tag shimmer"></div>
          <div className="skeleton-tag shimmer"></div>
          <div className="skeleton-tag shimmer"></div>
        </div>
        <div className="skeleton-btn shimmer"></div>
      </div>
    </div>
  );
}
