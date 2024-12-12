import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenSaleProgress } from "@/components/token-sale-progress";
import { Skeleton } from "@/components/ui/skeleton";

export function TokenSaleProgressCard() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gray-950">BARK Token Sale Progress</CardTitle>
        <p className="text-center text-muted-foreground mt-2">Track the real-time progress of our token sales</p>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <TokenSaleProgress />
        </Suspense>
      </CardContent>
    </Card>
  );
}

