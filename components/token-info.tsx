import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, FileText, Users, Zap } from 'lucide-react';

function InfoItem({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string }) {
  return (
    <div className="flex items-center space-x-4 bg-secondary bg-opacity-50 p-5 rounded-xl transition-all duration-300 hover:bg-opacity-70">
      <Icon className="h-8 w-8 text-[#d0c8b9]" />
      <div>
        <h3 className="font-semibold text-xl text-primary mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

export function TokenInfo() {
  return (
    <Card className="shadow-smooth hover:shadow-md transition-all duration-300 bg-card overflow-hidden">
      <CardHeader className="pb-4 pt-8 bg-white">
        <CardTitle className="text-3xl font-bold text-center text-gray-950">BARK Token Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 text-card-foreground pb-8 pt-6">
        <p className="text-xl text-center text-gray-700 mb-6 max-w-2xl mx-auto">
          BARK is the native token of the BARK Protocol, powering transactions and governance within our ecosystem.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={Coins} title="Max Supply" value="18,446,744,073 BARK" />
          <InfoItem icon={Users} title="Initial Circulating Supply" value="11,500,000,000 BARK" />
          <InfoItem icon={FileText} title="Token Type" value="SPL Token (Solana)" />
          <InfoItem icon={Zap} title="Use Cases" value="Governance, Staking, Platform Fees" />
        </div>
      </CardContent>
    </Card>
  );
}

