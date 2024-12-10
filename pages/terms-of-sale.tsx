import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsOfSale() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Sale</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By participating in the BARK Token sale, you agree to be bound by these Terms of Sale.</p>

            <h2>2. Eligibility</h2>
            <p>You must be of legal age in your jurisdiction to participate in this token sale.</p>

            <h2>3. Token Purchase</h2>
            <p>BARK Tokens are sold on a first-come, first-served basis. The purchase is final and non-refundable.</p>

            <h2>4. Risks</h2>
            <p>Purchasing BARK Tokens involves significant risk. You acknowledge and assume all risks associated with digital assets and blockchain technology.</p>

            <h2>5. Compliance</h2>
            <p>You are responsible for complying with all applicable laws and regulations in your jurisdiction.</p>

            <h2>6. Disclaimers</h2>
            <p>BARK Protocol provides no guarantees regarding the future value or utility of BARK Tokens.</p>

            <h2>7. Updates to Terms</h2>
            <p>These terms may be updated. It is your responsibility to check for updates regularly.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

