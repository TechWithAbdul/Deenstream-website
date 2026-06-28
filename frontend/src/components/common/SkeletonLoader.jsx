import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="w-full space-y-4 animate-pulse p-6 bg-malachite/20 rounded-2xl border border-gold/5">
      <div className="h-6 bg-malachite/60 rounded-md w-1/4"></div>
      <div className="h-24 bg-malachite/40 rounded-xl w-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-malachite/40 rounded-md w-full"></div>
        <div className="h-4 bg-malachite/40 rounded-md w-5/6"></div>
      </div>
    </div>
  );
}