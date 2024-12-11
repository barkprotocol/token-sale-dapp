'use client'

import Link from "next/link";
import { Logo } from "./logo";
import { WalletButton } from "./wallet-button";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <nav className="flex items-center space-x-6">
            <Link 
              href="./pages/about" 
              className="text-sm font-medium hover:text-gray-600 transition-colors font-inter"
            >
              About
            </Link>
            <Link 
              href="./pages/faq" 
              className="text-sm font-medium hover:text-gray-600 transition-colors font-inter"
            >
              FAQ
            </Link>
            <WalletButton variant="default" className="px-4 py-2" />
          </nav>
        </div>
      </div>
    </header>
  );
}

