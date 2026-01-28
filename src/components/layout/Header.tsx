import { FC } from "react";
import { FiBell } from "react-icons/fi";

type HeaderProps = {
  title: string;
};

const Header: FC <HeaderProps> = ({
title
}) => {
      return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3 h-20 rounded-md">
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-gray-700 pl-4">
      {title}
      </h2>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative">
          <FiBell className="text-xl text-gray-600" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            2
          </span>
        </button>
        
        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#5F2F8B] flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-700">Alex Doe</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};



export default Header;