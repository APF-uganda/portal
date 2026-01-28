import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBell,
  FiInbox,
  FiLogOut,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdDashboard, MdInsights } from "react-icons/md";
import { FaFileAlt, FaMoneyBill, FaComments } from "react-icons/fa";

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-[#EBF3E8] text-[#6A7270] flex flex-col h-screen shadow-lg transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-purple-700 hover:text-black"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {/* Top Section */}
      <div className="flex-1 overflow-y-auto px-2">
        {!collapsed && (
          <img
            src="/favicon.png"
            alt="APF Logo"
            className="h-10 pt-0 mt-0 mb-4"
          />
        )}

        <nav className="space-y-2">
          <NavItem icon={<MdDashboard />} label="Dashboard" to="/admin/dashboard" collapsed={collapsed} highlight />
          <NavItem icon={<FiInbox />} label="Inbox" to="/admin/inbox" badgeCount={99} collapsed={collapsed} />
          <NavItem icon={<FiUser />} label="Membership Applications" to="/admin/approval" collapsed={collapsed} />
          <NavItem icon={<FiUser />} label="Profile" to="/admin/profile" collapsed={collapsed} />
          <NavItem icon={<FaFileAlt />} label="Documents" to="/admin/documents" collapsed={collapsed} />
          <NavItem icon={<FaMoneyBill />} label="Payments & Renewals" to="/admin/payments" collapsed={collapsed} />
          <NavItem icon={<MdInsights />} label="Reports & Analytics" to="/admin/reports" collapsed={collapsed} />
          <NavItem icon={<FaComments />} label="Community Forum" to="/admin/forum" collapsed={collapsed} />
          <NavItem icon={<FiBell />} label="Notifications" to="/admin/notifications" collapsed={collapsed} />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 mb-2 border-t border-[#D6EAD9]">
        <NavItem icon={<FiLogOut />} label="Logout" to="/logout" collapsed={collapsed} />
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
  collapsed?: boolean;
}

const NavItem: FC<NavItemProps> = ({ icon, label, to, badgeCount, highlight, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
        isActive || highlight
          ? "bg-[#D588FE] text-black font-semibold"
          : "hover:bg-[#D588FE] hover:text-black"
      }`
    }
  >
    <span className="text-[18px]">{icon}</span>
    {!collapsed && <span className="flex-1">{label}</span>}
    {badgeCount !== undefined && !collapsed && (
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {badgeCount}
      </span>
    )}

    {/* Tooltip when collapsed */}
    {collapsed && (
      <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </span>
    )}
  </NavLink>
);

export default Sidebar;