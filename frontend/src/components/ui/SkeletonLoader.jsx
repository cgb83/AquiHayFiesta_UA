import React from 'react';
import '../../styles/SkeletonLoader.css';

export function SkeletonMedia() {
  return (
    <div className="skeleton-media">
      <div className="skeleton skeleton-thumb" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-subtitle" />
    </div>
  );
}

export function SkeletonGallery() {
  return (
    <div className="mb-lg">
      <div className="skeleton skeleton-section-title" />
      <div className="media-grid">
        {[...Array(4)].map((_, i) => (
          <SkeletonMedia key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonContent() {
  return (
    <div className="fiesta-content-skeleton">
      <SkeletonGallery />
      <SkeletonGallery />
      <SkeletonGallery />
    </div>
  );
}
