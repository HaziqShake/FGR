'use client';

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

      <style jsx>{`
        .skeleton-image {
          height: 380px;
          width: 100%;
        }
        .content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .skeleton-title {
          height: 20px;
          width: 80%;
          margin-bottom: 24px;
          border-radius: 4px;
        }
        .skeleton-specs {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 24px;
        }
        .skeleton-chip {
          height: 18px;
          width: 25%;
          border-radius: 4px;
        }
        .skeleton-tags {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 24px;
        }
        .skeleton-tag {
          height: 16px;
          width: 20%;
          border-radius: 4px;
        }
        .skeleton-btn {
          height: 38px;
          width: 100%;
          border-radius: 8px;
          margin-top: auto;
        }

        @media (max-width: 650px) {
          .skeleton-image { height: 220px; }
          .content { padding: 0.75rem; }
          .skeleton-title { height: 16px; margin-bottom: 0.5rem; }
          .skeleton-specs { gap: 0.25rem; margin-bottom: 0.5rem; }
          .skeleton-chip { height: 14px; }
          .skeleton-tags { gap: 0.25rem; margin-bottom: 1rem; }
          .skeleton-tag { height: 14px; }
          .skeleton-btn { height: 32px; }
        }
      `}</style>
    </div>
  );
}
