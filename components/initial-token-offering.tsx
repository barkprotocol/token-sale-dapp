import { Suspense } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Counter } from "@/components/counter";
import { Skeleton } from "@/components/ui/skeleton";

export function InitialTokenOffering() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Image
          src="https://ucarecdn.com/7189bddb-77f6-41c6-a65c-3666826d9044/Desktop2.png?height=400&width=800"
          alt="BARK Token Offering"
          width={800}
          height={400}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark-primary/80 to-bark-secondary/80 flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-white">Initial Token Offering</CardTitle>
            <p className="text-center text-gray-300 mt-2">Join the BARK token sale and be part of the future of BARK Protocol</p>
          </CardHeader>
        </div>
      </div>
      <CardContent className="bg-white p-6">
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <Counter />
        </Suspense>
      </CardContent>
    </Card>
  );
}

