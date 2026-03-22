import { Clock, Banknote } from 'lucide-react';
import { PaymentStatCard } from '../payment-components/statcard';
import { DashboardStats } from '../payment-components/types';

interface PaymentStatsProps {
  stats: DashboardStats | null;
}


export const PaymentStats = ({ stats }: PaymentStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      
      <PaymentStatCard 
        title="Pending Renewals" 
        value={`${(stats?.pending_revenue ?? 0).toLocaleString()}`} 
        change={stats?.growth_rates?.pending ?? 0}
        icon={Clock}
        iconBg="bg-amber-500"
        color="border-yellow-500" 
      />

      <PaymentStatCard 
        title="Total Revenue" 
        value={`UGX ${(stats?.total_revenue ?? 0).toLocaleString()}`} 
        change={stats?.growth_rates?.revenue ?? 0}
        icon={Banknote}
        iconBg="bg-emerald-600"
        color="border-green-500" 
      />
    </div>
  );
};
