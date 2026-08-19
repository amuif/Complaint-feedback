import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface HierarchySkeletonProps {
  count?: number;
  showTitle?: boolean;
}

export function HierarchySkeleton({ count = 3, showTitle = false }: HierarchySkeletonProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {showTitle && (
        <div className="mb-6 space-y-2">
          <Skeleton className="h-9 w-48 rounded-md" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden shadow rounded-lg flex flex-col h-72 border border-muted"
          >
            <CardHeader className="bg-orange-500/20 h-16 rounded-t-lg p-0" />

            <div className="flex justify-center -mt-10">
              <Skeleton className="h-20 w-20 rounded-full border-4 border-background" />
            </div>

            <CardContent className="text-center my-auto flex-1 flex flex-col items-center justify-center p-4 space-y-2.5">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </CardContent>

            <CardFooter className="mt-auto flex justify-center pb-4">
              <Skeleton className="h-4 w-20 rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default HierarchySkeleton;
