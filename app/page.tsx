import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenSaleProgress } from "@/components/TokenSaleProgress";
import { Counter } from "@/components/Counter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { PurchaseTokensCard } from "@/components/PurchaseTokensCard";
import { Disclaimer } from "@/components/Disclaimer";
import dynamic from 'next/dynamic';

const WalletProviderWrapper = dynamic(
  () => import('@/components/wallet-provider-wrapper').then((mod) => mod.WalletProviderWrapper),
  { ssr: false }
);

export default function Home() {
  return (
    <WalletProviderWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Header />

        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
          <Hero />
          <div className="w-full max-w-4xl space-y-8">
            <Card className="shadow-smooth">
              <CardHeader>
                <CardTitle className="text-2xl text-center bark-gradient">Time Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <Counter />
              </CardContent>
            </Card>
            <Card className="shadow-smooth">
              <CardHeader>
                <CardTitle className="text-2xl text-center bark-gradient">BARK Token Sale Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <TokenSaleProgress />
              </CardContent>
            </Card>
            <Card className="shadow-smooth">
              <CardHeader>
                <CardTitle className="text-2xl text-center bark-gradient">Purchase BARK Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <PurchaseTokensCard />
              </CardContent>
            </Card>
            <Disclaimer />
          </div>
        </main>

        <Footer />
      </div>
    </WalletProviderWrapper>
  );
}

