"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FeedSkeleton = () => {
  return (
    <div>
      {/* Scrollable News Feed Skeleton */}
      <div className="w-full overflow-x-hidden p-2">
        <Skeleton className=" mb-2 h-6 w-52"></Skeleton>
        <div className="flex gap-4">
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              className="min-w-[320px] max-w-[320px] rounded-sm my-0 border-none shadow overflow-hidden"
            >
              <div className="relative w-full h-[120px]"></div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-12 ">
        <div>
          {/* Ask Box Skeleton */}
          {/* <div className="w-full mx-auto my-2 space-y-2">
            <div className="flex items-center gap-3 rounded-full border px-2 py-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div> */}

          {/* Question Cards Skeleton */}
          <div role="list" aria-label="Question feed">
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
                className="mb-4 border-b border-t-0 border-x-0 shadow-none  rounded-lg overflow-hidden"
              >
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Card className="border-none shadow rounded-lg p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-5/6 mt-2" />
              <Skeleton className="h-3 w-2/3 mt-2" />
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedSkeleton;
