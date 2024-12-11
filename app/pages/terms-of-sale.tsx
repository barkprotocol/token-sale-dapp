'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsOfSale() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#e1d8c7] to-[#d1c8b7] text-gray-900 p-6">
            <CardTitle className="text-3xl font-bold text-center">Terms of Sale</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <Section title="1. Acceptance of Terms">
                By participating in the BARK Token sale, you agree to be bound by these Terms of Sale.
              </Section>

              <Section title="2. Eligibility">
                You must be of legal age in your jurisdiction to participate in this token sale.
              </Section>

              <Section title="3. Token Purchase">
                BARK Tokens are sold on a first-come, first-served basis. The purchase is final and non-refundable.
              </Section>

              <Section title="4. Risks">
                Purchasing BARK Tokens involves significant risk. You acknowledge and assume all risks associated with digital assets and blockchain technology.
              </Section>

              <Section title="5. Compliance">
                You are responsible for complying with all applicable laws and regulations in your jurisdiction.
              </Section>

              <Section title="6. Disclaimers">
                BARK Protocol provides no guarantees regarding the future value or utility of BARK Tokens.
              </Section>

              <Section title="7. Updates to Terms">
                These terms may be updated. It is your responsibility to check for updates regularly.
              </Section>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{children}</p>
    </section>
  )
}

