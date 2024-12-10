'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">About BARK Token</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              BARK Token is a revolutionary cryptocurrency built on the Solana blockchain, designed to power the future of decentralized pet care and animal welfare initiatives.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
            <p>
              Our mission is to create a global, decentralized ecosystem that supports animal shelters, veterinary research, and pet-related services. By leveraging blockchain technology, we aim to increase transparency, reduce costs, and improve the lives of animals worldwide.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Key Features</h2>
            <ul className="list-disc pl-6">
              <li>Fast and low-cost transactions on the Solana blockchain</li>
              <li>Smart contract integration for automated donations to animal welfare organizations</li>
              <li>Reward system for pet owners and animal care professionals</li>
              <li>Decentralized governance allowing token holders to vote on project decisions</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
