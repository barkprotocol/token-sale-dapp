import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutContent() {
  return (
    <>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Our Team</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            The BARK Token project is led by a team of passionate individuals with diverse backgrounds in blockchain technology, animal welfare, and business development.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-xl font-semibold">Jane Doe</h3>
              <p className="text-sm text-gray-600">Founder & CEO</p>
              <p className="mt-2">
                With over 10 years of experience in animal welfare and 5 years in blockchain, Jane leads the vision and strategy for BARK Token.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">John Smith</h3>
              <p className="text-sm text-gray-600">CTO</p>
              <p className="mt-2">
                A veteran software engineer with expertise in Solana and Ethereum, John oversees the technical development of the BARK Token ecosystem.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Emily Brown</h3>
              <p className="text-sm text-gray-600">Head of Partnerships</p>
              <p className="mt-2">
                Emily brings her extensive network in the pet care industry to forge strategic partnerships and drive adoption of BARK Token.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Michael Lee</h3>
              <p className="text-sm text-gray-600">Lead Smart Contract Developer</p>
              <p className="mt-2">
                With a background in both veterinary science and blockchain development, Michael ensures our smart contracts align with real-world animal welfare needs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

