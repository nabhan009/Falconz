// import React, { useState, useEffect } from "react";
// import { Users, Package, ShoppingCart, BarChart3, TrendingUp, Eye } from "lucide-react";
// import AdminNav from "./AdminNav";
// import Sidebar from "./Sidebar";
// import api from "../Api/Api";
// import { useNavigate } from "react-router-dom";
// import Loaders from "../../effects/Adminloader";

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [fullOrders, setFullOrders] = useState([]);
//   const [peoples, setPeoples] = useState(0);
//   const [products, setProducts] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch users
//         const usersRes = await api.get("/users");
//         const users = usersRes.data.filter((user) => user.role.toLowerCase() !== "admin");
//         setPeoples(users.length);

//         // Get all orders
//         const allOrders = users.flatMap((user) =>
//           (user.orders || []).map((order) => ({
//             id: order.id,
//             customer: user.name,
//             date: new Date(order.orderDate).toLocaleDateString(),
//             amount: order.totalAmount,
//             status: order.status,
//           }))
//         );
//         setFullOrders(allOrders);

//         const recentOrders = allOrders
//           .sort((a, b) => new Date(b.date) - new Date(a.date))
//           .slice(0, 5);
//         setOrders(recentOrders);

//         // Fetch products
//         const productsRes = await api.get("/Products");
//         setProducts(productsRes.data.length);

//         //3 sec delay
//         setTimeout(() => setLoading(false), 1000);
//       } catch (err) {
//         console.error("Failed to fetch admin dashboard data:", err);
//         setError("Failed to load dashboard data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calculate total revenue
//   const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);

//   const stats = [
//     { title: "Total Users", value: peoples, icon: Users, description: "Active customers" },
//     { title: "Total Orders", value: fullOrders.length, icon: ShoppingCart, description: "This month" },
//     { title: "Products", value: products, icon: Package,  description: "In inventory" },
//     { title: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: BarChart3, description: "Total earnings" },
//   ];

//   //animated loding 
//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <AdminNav setSidebarOpen={setSidebarOpen} />
//           <div><Loaders/></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <AdminNav setSidebarOpen={setSidebarOpen} />
//           <main className="flex-1 overflow-y-auto flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <BarChart3 className="h-8 w-8 text-red-500" />
//               </div>
//               <div className="text-lg text-red-600 font-semibold">{error}</div>
//               <p className="text-gray-500 mt-2">Please try refreshing the page</p>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminNav setSidebarOpen={setSidebarOpen} />

//         <main className="flex-1 overflow-y-auto p-6 lg:p-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
//             <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
//             {stats.map((stat, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
//                     <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
//                     <p className="text-sm text-gray-500">{stat.description}</p>
//                   </div>
//                   <div className={`p-4 rounded-2xl bg-blue-700 shadow-lg`}>
//                     <stat.icon className="h-6 w-6 text-white" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Orders and Sidebar */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
//                 <h2 className="text-xl font-semibold text-gray-900 flex items-center">
//                   <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" /> Recent Orders
//                 </h2>
//                 <button
//                   onClick={() => navigate("/allorders")}
//                   className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   <Eye className="h-4 w-4 mr-1" /> View All
//                 </button>
//               </div>

//               {orders.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500 text-lg">No orders found</p>
//                 </div>
//               ) : (
//                 <table className="min-w-full divide-y divide-gray-100">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-100">
//                     {orders.map((order) => (
//                       <tr key={order.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">#{order.id}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{order.amount}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg p-10 text-white">
//                 <h3 className="text-lg font-semibold mb-2">Revenue Summary</h3>
//                 <p className="text-3xl font-bold mb-2">₹{totalRevenue.toLocaleString()}</p>
//                 <p className="text-blue-100 text-sm">Total revenue from all orders</p>
//                 <div className="flex items-center mt-4">
//                   <TrendingUp className="h-5 w-5 text-green-300 mr-2" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default AdminDashboard;





import React, { useState, useEffect } from "react";
import { Users, Package, ShoppingCart, BarChart3, TrendingUp, Eye, IndianRupeeIcon, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AdminNav from "./AdminNav";
import Sidebar from "./Sidebar";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";
import Loaders from "../../effects/Adminloader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fullOrders, setFullOrders] = useState([]);
  const [peoples, setPeoples] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const CATEGORY_COLORS = {
    'vegetables': '#10B981',
    'fruits': '#F59E0B',
    'dairy': '#3B82F6',
    'meat': '#EF4444',
    'Beverages & Snacks': '#8B5CF6',
    'other': '#6B7280'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users
        const usersRes = await api.get("/users");
        const users = usersRes.data.filter((user) => user.role?.toLowerCase() !== "admin");
        setPeoples(users.length);

        // Get all orders
        const allOrders = users.flatMap((user) =>
          (user.orders || []).map((order) => ({
            id: order.id,
            customer: user.name,
            date: new Date(order.orderDate).toLocaleDateString(),
            amount: order.totalAmount,
            status: order.status,
            items: order.items || []
          }))
        );
        setFullOrders(allOrders);

        const recentOrders = allOrders
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 8);
        setOrders(recentOrders);

        // Fetch products
        const productsRes = await api.get("/Products");
        setProducts(productsRes.data);

        // Generate revenue data for chart
        generateRevenueData(allOrders);
        
        // Generate category data
        generateCategoryData(productsRes.data, allOrders);

        // 3 sec delay
        setTimeout(() => setLoading(false), 1000);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateRevenueData = (allOrders) => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push({
        name: date.toLocaleString('default', { month: 'short' }),
        revenue: 0,
        orders: 0
      });
    }

    allOrders.forEach(order => {
      const orderDate = new Date(order.date);
      const monthIndex = last6Months.findIndex(m => 
        m.name === orderDate.toLocaleString('default', { month: 'short' })
      );
      if (monthIndex !== -1) {
        last6Months[monthIndex].revenue += parseFloat(order.amount || 0);
        last6Months[monthIndex].orders += 1;
      }
    });

    setRevenueData(last6Months);
  };

  const generateCategoryData = (products, allOrders) => {
    const categoryStats = {};
    
    // Initialize categories
    const allCategories = [...new Set(products.map(p => p.category || 'other'))];
    allCategories.forEach(cat => {
      categoryStats[cat] = {
        name: cat,
        products: 0,
        revenue: 0,
        orders: 0
      };
    });

    // Count products per category
    products.forEach(product => {
      const category = product.category || 'other';
      categoryStats[category].products += 1;
    });

    // Calculate revenue and orders per category
    allOrders.forEach(order => {
      order.items?.forEach(item => {
        const category = item.category || 'other';
        if (categoryStats[category]) {
          categoryStats[category].revenue += parseFloat(item.price || 0) * (item.quantity || 1);
          categoryStats[category].orders += 1;
        }
      });
    });

    const categoryArray = Object.values(categoryStats).map(cat => ({
      ...cat,
      revenue: parseFloat(cat.revenue.toFixed(2))
    }));

    setCategoryData(categoryArray);
  };

  // Calculate total revenue
  const totalRevenue = fullOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);
  const monthlyGrowth = 12.5; // This could be calculated from actual data

  const stats = [
    { 
      title: "Total Users", 
      value: peoples, 
      icon: Users, 
      description: "Active customers",
      trend: "+5.2%",
      trendUp: true,
      color: "from-blue-500 to-blue-600"
    },
    { 
      title: "Total Orders", 
      value: fullOrders.length, 
      icon: ShoppingCart, 
      description: "All time orders",
      trend: "+12.4%",
      trendUp: true,
      color: "from-green-500 to-green-600"
    },
    { 
      title: "Products", 
      value: products.length, 
      icon: Package,  
      description: "In inventory",
      trend: "+2.1%",
      trendUp: true,
      color: "from-purple-500 to-purple-600"
    },
    { 
      title: "Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      icon: IndianRupeeIcon, 
      description: "Total earnings",
      trend: `+${monthlyGrowth}%`,
      trendUp: true,
      color: "from-orange-500 to-orange-600"
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? '₹' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNav setSidebarOpen={setSidebarOpen} />
          <div><Loaders/></div>
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
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-lg text-red-600 font-semibold">{error}</div>
              <p className="text-gray-500 mt-2">Please try refreshing the page</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNav setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Welcome back! Here's what's happening today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Orders Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                  Revenue Overview
                </h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Orders</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      name="Revenue (₹)" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="orders" 
                      name="Orders" 
                      fill="#10B981" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="h-5 w-5 text-purple-500 mr-2" />
                Category Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="products"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Products']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders and Category Performance */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" /> 
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate("/allorders")}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  <Eye className="h-4 w-4 mr-1" /> 
                  View All
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr 
                          key={order.id} 
                          className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                          onClick={() => navigate("/allorders")}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900 bg-blue-100 px-2 py-1 rounded">
                              #{order.id.slice(-8)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-green-600">
                              ₹{parseFloat(order.amount || 0).toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                Category Performance
              </h2>
              <div className="space-y-4">
                {categoryData.slice(0, 5).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[category.name] || COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{category.products} products</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Total Categories</p>
                      <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
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