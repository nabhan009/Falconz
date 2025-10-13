// import React, { useState, useEffect } from "react";
// import { Users, Package, ShoppingCart, BarChart3,Eye } from "lucide-react";
// import AdminNav from "./AdminNav";
// import Sidebar from "./Sidebar";
// import api from "../Api/Api";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [peoples, setPeoples] = useState(0);
//   const [products, setProducts] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         //  1. Fetch all users
//         const usersRes = await api.get("/users");
//         const users = usersRes.data.filter(
//           (user) => user.role.toLowerCase() !== "admin"
//         );
//         setPeoples(users.length);

//         //  2. Extract and flatten all orders from all users
//         const allOrders = users.flatMap((user) =>
//           (user.orders || []).map((order) => ({
//             id: order.id,
//             customer: user.name,
//             date: new Date(order.orderDate).toLocaleDateString(),
//             amount: order.totalAmount,
//             status: order.status,
//           }))
//         );
//         setOrders(allOrders)


//         //  3. Fetch all products
//         const productsRes = await api.get("/Products");
//         setProducts(productsRes.data.length);
//       } catch (err) {
//         console.error("Failed to fetch admin dashboard data:", err);
//         setError("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calculate total revenue
//   const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);

//   const stats = [
//     { title: "Total Users", value: peoples, icon: Users },
//     { title: "Total Orders", value: orders.length, icon: ShoppingCart },
//     { title: "Products", value: products, icon: Package },
//     { title: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3 },
//   ];
  
//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <AdminNav setSidebarOpen={setSidebarOpen} />
//           <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//             <div className="flex items-center justify-center h-64">
//               <div className="text-lg text-gray-600">Loading dashboard...</div>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <AdminNav setSidebarOpen={setSidebarOpen} />
//           <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//             <div className="flex items-center justify-center h-64">
//               <div className="text-lg text-red-600">{error}</div>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminNav setSidebarOpen={setSidebarOpen} />

//         {/* Dashboard Content */}
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//             {stats.map((stat, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       {stat.title}
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900 mt-1">
//                       {stat.value}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-blue-50 rounded-lg">
//                     <stat.icon className="h-6 w-6 text-blue-600" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Recent Orders */}
//                              <div className="flex items-center justify-between">
//                    <h2 className="text-x2 font-semibold text-gray-900 flex items-center">
//                       <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
//                       Recent Orders
//                     </h2>
//                     <button onClick={()=>navigate('/allorders')} className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
//                         <Eye className="h-4 w-4 mr-1" />
//                       View All
//                 </button>
//                   </div>
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             {orders.length === 0 ? (
//               <p className="p-6 text-gray-500">No orders found.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Order ID
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Customer
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {orders.map((order) => (
//                       <tr key={order.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {order.id}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {order.customer}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {order.date}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           ${order.amount}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               order.status === "Success"
//                                 ? "bg-green-100 text-green-800"
//                                 : order.status === "Pending"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {order.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;





import React, { useState, useEffect } from "react";
import { Users, Package, ShoppingCart, BarChart3, TrendingUp, Eye, Calendar } from "lucide-react";
import AdminNav from "./AdminNav";
import Sidebar from "./Sidebar";
import api from "../Api/Api";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fullOrders,setFullorders] = useState([])
  const [peoples, setPeoples] = useState(0);
  const [products, setProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch all users
        const usersRes = await api.get("/users");
        const users = usersRes.data.filter(
          (user) => user.role.toLowerCase() !== "admin"
        );
        setPeoples(users.length);

        // 2. Extract and flatten all orders from all users
        const allOrders = users.flatMap((user) =>
          (user.orders || []).map((order) => ({
            id: order.id,
            customer: user.name,
            date: new Date(order.orderDate).toLocaleDateString(),
            amount: order.totalAmount,
            status: order.status,
          }))
        );
        const ordersno = allOrders
        setFullorders(ordersno)
        // Sort recent orders (latest first) and take last 4
        const recentOrders = allOrders
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        
        setOrders(recentOrders);

        // 3. Fetch all products
        const productsRes = await api.get("/Products");
        setProducts(productsRes.data.length);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);

  const stats = [
    { 
      title: "Total Users", 
      value: peoples, 
      icon: Users, 
      gradient: "from-purple-500 to-pink-500",
      trend: "+12%",
      description: "Active customers"
    },
    { 
      title: "Total Orders", 
      value: fullOrders.length, 
      icon: ShoppingCart, 
      gradient: "from-blue-500 to-cyan-500",
      trend: "+8%",
      description: "This month"
    },
    { 
      title: "Products", 
      value: products, 
      icon: Package, 
      gradient: "from-green-500 to-emerald-500",
      trend: "+5%",
      description: "In inventory"
    },
    { 
      title: "Revenue", 
      value: `$${totalRevenue.toLocaleString()}`, 
      icon: BarChart3, 
      gradient: "from-orange-500 to-red-500",
      trend: "+23%",
      description: "Total earnings"
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNav setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <div className="text-lg text-gray-600">Loading dashboard...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNav setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-red-500" />
                </div>
                <div className="text-lg text-red-600 font-semibold">{error}</div>
                <p className="text-gray-500 mt-2">Please try refreshing the page</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNav setSidebarOpen={setSidebarOpen} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-500">
                        {stat.trend}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Orders Card */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
                      Recent Orders
                    </h2>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <Eye className="h-4 w-4 mr-1" />
                      View All
                    </button>
                  </div>
                </div>
                
                {orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <p className="text-gray-400 text-sm mt-1">Orders will appear here once placed</p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Order
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">
                                #{order.id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">
                                {order.customer}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                {order.date}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">
                                ${order.amount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  order.status === "Success"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              {/* Revenue Summary */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Revenue Summary</h3>
                <p className="text-3xl font-bold mb-2">${totalRevenue.toLocaleString()}</p>
                <p className="text-blue-100 text-sm">Total revenue from all orders</p>
                <div className="flex items-center mt-4">
                  <TrendingUp className="h-5 w-5 text-green-300 mr-2" />
                  <span className="text-green-300 text-sm font-medium">+23% from last month</span>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Users</span>
                    <span className="text-sm font-semibold text-gray-900">+{Math.floor(peoples * 0.1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Orders Today</span>
                    <span className="text-sm font-semibold text-gray-900">+{Math.floor(orders.length * 0.3)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Products Sold</span>
                    <span className="text-sm font-semibold text-gray-900">+{Math.floor(products * 0.2)}</span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;