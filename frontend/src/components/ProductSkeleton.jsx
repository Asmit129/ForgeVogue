import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="glass-card flex flex-col h-full bg-[var(--bg-card)] overflow-hidden animate-pulse">
      {/* Image Area Skeleton */}
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-black)]/40 w-full" />

      {/* Content Area Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-3 w-1/3 bg-white/10 rounded-full" />
          <div className="h-4 w-4 bg-white/10 rounded-full" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-white/10 rounded-full mb-2" />
        <div className="h-5 w-1/2 bg-white/10 rounded-full mb-6" />

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-[var(--border-glass)] flex items-end justify-between">
          <div className="flex-1">
            <div className="h-3 w-1/4 bg-white/10 rounded-full mb-2" />
            <div className="h-6 w-1/2 bg-white/10 rounded-full" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
