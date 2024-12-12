'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Scroll } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-bark-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-bark-primary text-white p-6">
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
              <Scroll className="mr-2 h-8 w-8" />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <Section title="1. Information Collection">
                We collect personal information that you provide to us when participating in the BARK Token sale.
              </Section>

              <Section title="2. Use of Information">
                We use your information to process your token purchase and to comply with legal obligations.
              </Section>

              <Section title="3. Information Sharing">
                We do not sell your personal information. We may share information with service providers or as required by law.
              </Section>

              <Section title="4. Data Security">
                We implement reasonable security measures to protect your personal information.
              </Section>

              <Section title="5. Your Rights">
                You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.
              </Section>

              <Section title="6. Cookies">
                We use cookies to improve your experience on our website. You can manage cookie preferences in your browser settings.
              </Section>

              <Section title="7. Changes to Privacy Policy">
                We may update this privacy policy. Check this page regularly for any changes.
              </Section>

              <Section title="8. Contact Us">
                If you have any questions about this privacy policy, please contact us at{' '}
                <a href="mailto:privacy@barkprotocol.com" className="text-bark-accent hover:underline">
                  privacy@barkprotocol.com
                </a>.
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
    <section className="border-b border-bark-accent pb-4">
      <h2 className="text-2xl font-semibold text-bark-primary mb-2">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{children}</p>
    </section>
  )
}

