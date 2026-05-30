import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BoardLoading() {
  return (
    <div className="grid grid-cols-6 gap-3 items-start">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="rounded-2xl pt-2 flex flex-col min-w-0">
          <CardHeader className="flex flex-row items-center gap-0 pl-2 shrink-0">
            <Skeleton className="h-12 w-full rounded-md" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-2 py-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
