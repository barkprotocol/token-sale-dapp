import { Metadata } from 'next'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about"

export const metadata: Metadata = {
  title: 'About BARK Token',
  description: 'Learn about BARK, our mission, key features, and the team behind the project.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AboutContent />
      </main>
      <Footer />
    </div>
  )
}

