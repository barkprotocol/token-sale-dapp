import "@/app/styles/globals.css"
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { WalletProviderWrapper } from "@/components/wallet-provider-wrapper"
import { WalletConnectionProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
        <WalletProviderWrapper>
          <WalletConnectionProvider>

            {children}
            <Toaster />
          </WalletConnectionProvider>
        </WalletProviderWrapper>
      </body>
    </html>
  )
}

