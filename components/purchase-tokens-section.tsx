import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseTokensCard } from "@/components/purchase-tokens-card";
import { Skeleton } from "@/components/ui/skeleton";

export function PurchaseTokensSection() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gray-950">Purchase BARK Tokens</CardTitle>
        <p className="text-center text-muted-foreground mt-2">Secure your BARK tokens now and join our community</p>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <PurchaseTokensCard />
        </Suspense>
      </CardContent>
    </Card>
  );
}

