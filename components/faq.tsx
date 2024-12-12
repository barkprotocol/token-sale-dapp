'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

const faqItems = [
  {
    question: "What is BARK Token?",
    answer: "BARK Token is a digital asset built on the Solana blockchain, designed to revolutionize the pet care and animal welfare industry. It aims to create a decentralized ecosystem supporting animal shelters, veterinary research, and pet-related services."
  },
  {
    question: "How can I participate in the BARK Token sale?",
    answer: "To participate in the BARK Token sale, you need to connect your Solana wallet on our website and follow the instructions to purchase tokens during the sale period. Make sure you have sufficient SOL or USDC in your wallet for the purchase."
  },
  {
    question: "What is the total supply of BARK Tokens?",
    answer: "The total supply of BARK Tokens is 18,446,744,073 tokens. This fixed supply ensures scarcity and potential value appreciation over time."
  },
  {
    question: "What can I do with BARK Tokens?",
    answer: "BARK Tokens can be used for various purposes within our ecosystem, including donations to animal welfare organizations, accessing premium pet care services, participating in governance decisions, and potentially earning rewards through staking."
  },
  {
    question: "How can I store my BARK Tokens safely?",
    answer: "BARK Tokens can be stored in any Solana-compatible wallet. We recommend using hardware wallets for maximum security or reputable software wallets like Phantom or Solflare. Always ensure you're using official wallet apps and never share your private keys or seed phrases."
  },
  {
    question: "When will BARK Tokens be listed on exchanges?",
    answer: "We are actively working on partnerships with various cryptocurrency exchanges. While we can't provide specific dates, we aim to list BARK Tokens on reputable exchanges shortly after the token sale concludes. Stay tuned to our official channels for announcements."
  }
]

export function FAQ() {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-bark-primary text-white p-6">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <QuestionMarkCircledIcon className="w-8 h-8 mr-2" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-bark-accent transition-colors duration-200">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700 mt-2 mb-4 leading-relaxed">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

