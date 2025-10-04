import { cn } from "@/lib/utils";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-muted", className)} />
);

export const ProfileSkeleton = () => (
  <div className=" grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-12">
    {/* Right Column (Sidebar) */}
    <aside className="order-1 md:order-2 w-full md:w-auto">
      <div className=" rounded pt-14  shadow-sm md:sticky md:top-20">
        <div className="px-4 py-6 flex flex-col items-center">
          <Skeleton className="h-20 w-20 rounded-full -mt-10 mb-3 border-4 border-background" />
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mt-4 w-full text-center pb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-5 w-12 mx-auto mb-1" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </aside>

    {/* Left Side (Questions) */}
    <div className="order-2 md:order-1 min-w-0">
      <div className="flex gap-4 border-b pb-2 mb-4">
        <Skeleton className="h-6 w-24 border-b-2 border-muted" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);
