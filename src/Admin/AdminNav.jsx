import React from "react";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";

const AdminNav = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm z-40 border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop toggle button */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="hidden lg:flex p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        {/* <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div> */}

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button> */}

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">muhammed Nabhan</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;