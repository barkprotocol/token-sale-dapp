import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenSaleProgress } from "@/components/TokenSaleProgress";
import { Counter } from "@/components/Counter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SolanaWalletProvider, WalletConnectionProvider } from "@/components/wallet-provider";
import { PurchaseTokensCard } from "@/components/PurchaseTokensCard";
import { AcceptedCurrencyCard } from "@/components/AcceptedCurrencyCard";
import { Disclaimer } from "@/components/Disclaimer";

export default function Home() {
  return (
    <SolanaWalletProvider>
      <WalletConnectionProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
          <Header />

          <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
            <Hero />
            <div className="w-full max-w-4xl space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center bark-gradient">Time Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <Counter />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center bark-gradient">Initial Token Offering</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <TokenSaleProgress />
                </CardContent>
              </Card>
              <AcceptedCurrencyCard />
              <PurchaseTokensCard />
              <Disclaimer />
            </div>
          </main>

          <Footer />
        </div>
      </WalletConnectionProvider>
    </SolanaWalletProvider>
  );
}

