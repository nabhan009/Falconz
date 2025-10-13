

// import React, { useEffect, useState } from "react";
// import api from "../Api/Api";
// import { toast } from "react-toastify";

// function AllUsers() {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch all users except admin
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/users");
//         // Filter out admin users
//         const filteredUsers = res.data.filter(
//           (user) => user.role.toLowerCase() !== "admin"
//         );
//         setUsers(filteredUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         toast.error("Failed to load users!");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ✅ Handle Block/Unblock user
//   const handleBlockToggle = async (userId, isBlock) => {
//     try {
//       await api.patch(`/users/${userId}`, { isBlock: !isBlock });

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === userId ? { ...u, isBlock: !isBlock } : u
//         )
//       );

//       toast.success(`User ${!isBlock ? "Blocked" : "Unblocked"} successfully!`);
//     } catch (error) {
//       console.error("Error updating user block status:", error);
//       toast.error("Failed to update user status.");
//     }
//   };

//   // Filter users based on search
//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg text-gray-600">Loading users...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">👥 All Registered Users</h2>
//         <input
//           type="text"
//           placeholder="Search users by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
//         />
//       </div>

//       {filteredUsers.length === 0 ? (
//         <p className="text-center text-gray-600 mt-10">
//           {searchTerm ? "No users found matching your search." : "No users found."}
//         </p>
//       ) : (
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-3 px-4 text-left text-gray-700 font-semibold">Name</th>
//                 <th className="py-3 px-4 text-left text-gray-700 font-semibold">Email</th>
//                 <th className="py-3 px-4 text-left text-gray-700 font-semibold">Role</th>
//                 <th className="py-3 px-4 text-center text-gray-700 font-semibold">Status</th>
//                 <th className="py-3 px-4 text-center text-gray-700 font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr
//                   key={user.id}
//                   className={`border-b ${
//                     user.isBlock ? "bg-red-50" : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <td className="py-3 px-4 font-medium">{user.name}</td>
//                   <td className="py-3 px-4 text-gray-600">{user.email}</td>
//                   <td className="py-3 px-4 capitalize text-gray-600">{user.role}</td>
//                   <td
//                     className={`py-3 px-4 text-center font-semibold ${
//                       user.isBlock ? "text-red-600" : "text-green-600"
//                     }`}
//                   >
//                     {user.isBlock ? "Blocked" : "Active"}
//                   </td>
//                   <td className="py-3 px-4 text-center">
//                     <button
//                       onClick={() => handleBlockToggle(user.id, user.isBlock)}
//                       className={`px-4 py-1 rounded-md text-white transition ${
//                         user.isBlock
//                           ? "bg-green-500 hover:bg-green-600"
//                           : "bg-red-500 hover:bg-red-600"
//                       }`}
//                     >
//                       {user.isBlock ? "Unblock" : "Block"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AllUsers;


import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import Sidebar from "./Sidebar";
import api from "../Api/Api";
import { toast } from "react-toastify";

function AllUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users except admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users");
        // Filter out admin users
        const filteredUsers = res.data.filter(
          (user) => user.role.toLowerCase() !== "admin"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users!");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Handle Block/Unblock user
  const handleBlockToggle = async (userId, isBlock) => {
    try {
      await api.patch(`/users/${userId}`, { isBlock: !isBlock });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isBlock: !isBlock } : u
        )
      );

      toast.success(`User ${!isBlock ? "Blocked" : "Unblocked"} successfully!`);
    } catch (error) {
      console.error("Error updating user block status:", error);
      toast.error("Failed to update user status.");
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNav setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading users...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNav setSidebarOpen={setSidebarOpen} />

        {/* Users Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">👥 All Registered Users</h2>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-600 mt-10">
              {searchTerm ? "No users found matching your search." : "No users found."}
            </p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Name</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Email</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Role</th>
                    <th className="py-3 px-4 text-center text-gray-700 font-semibold">Status</th>
                    <th className="py-3 px-4 text-center text-gray-700 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b ${
                        user.isBlock ? "bg-red-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 capitalize text-gray-600">{user.role}</td>
                      <td
                        className={`py-3 px-4 text-center font-semibold ${
                          user.isBlock ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {user.isBlock ? "Blocked" : "Active"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleBlockToggle(user.id, user.isBlock)}
                          className={`px-4 py-1 rounded-md text-white transition ${
                            user.isBlock
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {user.isBlock ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllUsers;                                                                                                                                                                              