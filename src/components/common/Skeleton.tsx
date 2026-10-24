import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  height?: string | number;
  width?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  height,
  width,
}) => {
  const baseClasses = 'animate-pulse bg-slate-200/80 dark:bg-slate-700/50';

  if (variant === 'circular') {
    return (
      <div
        className={`rounded-full ${baseClasses} ${className}`}
        style={{ width: width || 48, height: height || 48 }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full animate-pulse bg-slate-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
          </div>
        </div>
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
        </div>
      </div>
    );
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={`rounded-xl ${baseClasses} ${className}`}
        style={{ width: width || '100%', height: height || 120 }}
      />
    );
  }

  return (
    <div
      className={`rounded-md ${baseClasses} ${className}`}
      style={{ width: width || '100%', height: height || 16 }}
    />
  );
};

export const WorkerCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-32" />
            <div className="h-3 bg-slate-200 rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-20" />
      </div>
      <div className="h-10 bg-slate-100 rounded-xl w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-4/5" />
      </div>
      <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
        <div className="h-10 bg-slate-100 rounded-lg" />
        <div className="h-10 bg-slate-100 rounded-lg" />
        <div className="h-10 bg-slate-100 rounded-lg" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-slate-200 rounded-xl flex-1" />
        <div className="h-9 bg-slate-200 rounded-xl flex-1" />
      </div>
    </div>
  );
};
