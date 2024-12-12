import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { InitialTokenOffering } from "@/components/initial-token-offering";
import { TokenSaleProgressCard } from "@/components/token-sale-progress-card";
import { PurchaseTokensSection } from "@/components/purchase-tokens-section";
import { TokenInfo } from "@/components/token-info";
import { FAQ } from "@/components/faq";
import { Disclaimer } from "@/components/disclaimer";
import ClientWalletProvider from '@/components/client-wallet-provider';

export default function Home() {
  return (
    <ClientWalletProvider>
      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-8">
            <InitialTokenOffering />
            <TokenSaleProgressCard />
          </div>

          <PurchaseTokensSection />

          <TokenInfo />

          <FAQ />

          <Disclaimer />
        </main>

        <Footer />
      </div>
    </ClientWalletProvider>
  );
}

