import React, { useState, useEffect } from "react";
import { Menu, User, Mail } from "lucide-react";
import api from "../Api/Api";

const AdminNav = ({ setSidebarOpen }) => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get("/users");
        const admin = response.data.find(user => user.role?.toLowerCase() === "admin");
        if (admin) {
          setAdminData({
            name: admin.name || "Admin",
            email: admin.email || "admin@example.com"
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        setAdminData({
          name: "admin",
          email: "admin@example.com"
        });
      }
    };

    fetchAdminData();
  }, []);
  return (
    <header className="bg-white shadow-sm z-40 border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      {/* menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 flex justify-end">
          <div className="flex items-center space-x-4">
           {/* admin name&email */}
            <div className="flex items-center space-x-3 bg-blue-100 rounded-lg px-4 py-2 border border-gray-200">
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {adminData?.name || "Loading..."}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {adminData?.email || "loading..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;