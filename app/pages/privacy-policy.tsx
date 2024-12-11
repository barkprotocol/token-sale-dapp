import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Information Collection</h2>
            <p>We collect personal information that you provide to us when participating in the BARK Token sale.</p>

            <h2>2. Use of Information</h2>
            <p>We use your information to process your token purchase and to comply with legal obligations.</p>

            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information with service providers or as required by law.</p>

            <h2>4. Data Security</h2>
            <p>We implement reasonable security measures to protect your personal information.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>

            <h2>6. Cookies</h2>
            <p>We use cookies to improve your experience on our website. You can manage cookie preferences in your browser settings.</p>

            <h2>7. Changes to Privacy Policy</h2>
            <p>We may update this privacy policy. Check this page regularly for any changes.</p>

            <h2>8. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at privacy@barkprotocol.com.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

