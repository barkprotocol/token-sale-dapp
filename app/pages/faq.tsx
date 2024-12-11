import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is BARK Token?</AccordionTrigger>
                <AccordionContent>
                  BARK Token is a digital asset built on the Solana blockchain, designed to [insert specific use case or purpose of BARK Token].
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How can I participate in the BARK Token sale?</AccordionTrigger>
                <AccordionContent>
                  To participate in the BARK Token sale, you need to connect your Solana wallet on our website and follow the instructions to purchase tokens during the sale period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What is the total supply of BARK Tokens?</AccordionTrigger>
                <AccordionContent>
                  The total supply of BARK Tokens is 1,000,000,000 (1 billion) tokens.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What can I do with BARK Tokens?</AccordionTrigger>
                <AccordionContent>
                  BARK Tokens can be used for [insert specific use cases, e.g., governance, staking, accessing platform features, etc.]. The utility of BARK Tokens will expand as our ecosystem grows.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How can I store my BARK Tokens safely?</AccordionTrigger>
                <AccordionContent>
                  BARK Tokens can be stored in any Solana-compatible wallet. We recommend using hardware wallets for maximum security or reputable software wallets like Phantom or Solflare.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

