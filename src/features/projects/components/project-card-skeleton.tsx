import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-row items-center gap-4 border border-border/70 bg-card rounded-xl p-4">
      <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg" />
      <div className="flex flex-col flex-grow min-w-0 gap-2">
        <Skeleton className="h-5 w-1/3" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3.5 w-10" />
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 pl-2">
        <Skeleton className="h-3.5 w-20" />
      </div>
    </div>
  );
}
