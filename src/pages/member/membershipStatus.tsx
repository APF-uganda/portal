import { CalendarDays} from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import StatusAlert from "../../components/membershipstatuspage-components/statusAlert";
import OverviewCard from "../../components/membershipstatuspage-components/overViewCard";
import BenefitsCard from "../../components/membershipstatuspage-components/BenefitsCard";

const MembershipStatus = () => {
    return (
        <DashboardLayout>
            <div className="p-10 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Membership Status</h1>
                        <p className="text-gray-500 mt-2 text-lg">Monitor and manage your APF membership details and benefits</p>
                    </div>
                    
                    <div className="bg-[#F3F4F6] text-[#5B21B6] px-5 py-2.5 rounded-2xl flex items-center gap-3 font-bold border border-[#DDD6FE]">
                        <CalendarDays className="text-xl"></CalendarDays>
                        January 19, 2026
                    </div>
                </div>

                                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch w-full max-w-[1600px] mx-auto">
                    <StatusAlert />
                    <OverviewCard />
                    <BenefitsCard />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MembershipStatus;