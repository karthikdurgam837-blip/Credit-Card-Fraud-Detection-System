import React from 'react';
import { cn } from '@/src/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-slate-200 rounded-md animate-shimmer", className)} />
  );
}
