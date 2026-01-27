import { FC } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBell,
  FiInbox,
  FiLogOut,
  FiUser,  
} from "react-icons/fi";
import {
  MdDashboard,
  MdInsights,
} from "react-icons/md";
import {
  FaFileAlt,
  FaMoneyBill,
  FaComments,
} from "react-icons/fa";

const Sidebar: FC = () => {
  return (
    <aside className="w-75 bg-[#EBF3E8] text-[#6A7270] flex flex-col justify-between h-screen shadow-lg">
      {/* Top Section */}
      <div className="p-6">
        <img src="/favicon.png" alt="APF Logo" className="h-10 mb-4" />

        <nav className="space-y-2">
          <NavItem icon={<MdDashboard />} label="Dashboard" to="/admin/dashboard" highlight />
          <NavItem icon={<FiInbox />} label="Inbox" to="/admin/inbox" badgeCount={99} />
          <NavItem icon={<FiUser />} label="Membership Applications" to="/admin/applications" />
          <NavItem icon={<FiUser />} label="Profile" to="/admin/profile" />
          <NavItem icon={<FaFileAlt />} label="Documents" to="/admin/documents" />
          <NavItem icon={<FaMoneyBill />} label="Payments & Renewals" to="/admin/payments" />
          <NavItem icon={<MdInsights />} label="Reports & Analytics" to="/admin/reports" />
          <NavItem icon={<FaComments />} label="Community Forum" to="/admin/forum" />
          <NavItem icon={<FiBell />} label="Notifications" to="/admin/notifications" />
          
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-[#D6EAD9]">
        <NavItem icon={<FiLogOut />} label="Logout" to="/logout" />
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  badgeCount?: number;
  highlight?: boolean;
}

const NavItem: FC<NavItemProps> = ({ icon, label, to, badgeCount, highlight }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
        isActive || highlight
          ? "bg-[#D588FE] text-black font-semibold"
          : "hover:bg-[#D588FE] hover:text-black"
      }`
    }
  >
    <span className="text-[18px]">{icon}</span>
    <span className="flex-1">{label}</span>
    {badgeCount !== undefined && (
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {badgeCount}
      </span>
    )}
  </NavLink>
);

export default Sidebar;