import { Clock, Banknote } from 'lucide-react';
import { PaymentStatCard } from '../payment-components/statcard';
import { DashboardStats } from '../payment-components/types';

interface PaymentStatsProps {
  stats: DashboardStats | null;
}


export const PaymentStats = ({ stats }: PaymentStatsProps) => {
  // Debug logging
  console.log('=== PAYMENT STATS COMPONENT ===');
  console.log('Stats received:', stats);
  console.log('Growth rates:', stats?.growth_rates);
  console.log('=== END PAYMENT STATS ===');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      
      <PaymentStatCard 
        title="Pending Renewals" 
        value={`${(stats?.pending_revenue ?? 0).toLocaleString()}`} 
        change={25.8} // Temporary hardcoded value to test arrows
        icon={Clock}
        iconBg="bg-amber-500"
        color="border-yellow-500" 
      />

      <PaymentStatCard 
        title="Total Revenue" 
        value={`UGX ${(stats?.total_revenue ?? 0).toLocaleString()}`} 
        change={35.6} // Temporary hardcoded value to test arrows
        icon={Banknote}
        iconBg="bg-emerald-600"
        color="border-green-500" 
      />
    </div>
  );
};
