import { Dashboard } from "@/components/dahboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          <Skeleton className="w-full h-96" />
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
