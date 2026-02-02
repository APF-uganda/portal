import { useState } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import ReportCard from "../../components/reports-Components/reportsCard";
import CustomGenerator from "../../components/reports-Components/customGenerator";
import RecentReports from "../../components/reports-Components/recentReports";



const ReportsAnalytics = () => {
    const [collapsed, setCollapsed] = useState(false);
  
    return (
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
  
        <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
          <Header title="Reports & Analytics" />
  
          <div className="flex-1 bg-[#F4F2FE] p-8 space-y-10">
            <div className="max-w-[1400px] mx-auto space-y-10">
              
              <div>
                <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Available Reports</h1>
                <p className="text-slate-500 mt-1">Generate, analyze, and download detailed reports and analytics</p>
              </div>
  
             
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                <ReportCard 
              
                  title="Membership Report" 
                  date="Dec 22, 2024" 
                  description="Overview of all members, categories, and status. Track member growth, retention, and demographics." 
                />
                <ReportCard 
                  title="General Report" 
                  date="Dec 20, 2024" 
                  description="Revenue, payments, and outstanding dues analysis. Financial performance and trends." 
                />
                <ReportCard 
                  title="Event Reporting" 
                  date="Dec 18, 2024" 
                  description="Event attendants, engagement metrics, and participation analysis across all events." 
                />
                <ReportCard 
                  title="Compliance Report" 
                  date="Dec 15, 2024" 
                  description="CPD tracking and certificate verification status. Compliance monitoring and audit trails." 
                />
                <ReportCard 
                  title="Growth Report" 
                  date="Dec 10, 2024" 
                  description="New member acquisition and retention trends. Growth analysis and forecasting." 
                />
              </div>
  
              <CustomGenerator />
              <RecentReports />
            </div>
          </div>
          
          <Footer />
        </main>
      </div>
    );
  };
  
  export default ReportsAnalytics;