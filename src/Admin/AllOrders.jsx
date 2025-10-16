// import React, { useState, useEffect } from "react";
// import AdminNav from "./AdminNav";
// import Sidebar from "./Sidebar";
// import api from "../Api/Api";
// import { toast } from "react-toastify";
// import { Search, Filter, Eye, ChevronDown, Calendar, User, Package,IndianRupeeIcon } from "lucide-react";
// import Loaders from "../../effects/Adminloader";

// const Orders = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Fetch all user orders 
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const { data: users } = await api.get("/users");
//         const customerUsers = users.filter(u => u.role?.toLowerCase() !== "admin");

//         const allOrders = customerUsers.flatMap(user =>
//           (user.orders || []).map(order => ({
//             ...order,
//             customer: user.name,
//             customerEmail: user.email,
//             date: new Date(order.orderDate),
//             formattedDate: new Date(order.orderDate).toLocaleDateString(),
//             status: order.status || "Pending",
//           }))
//         );

//         setOrders(allOrders.sort((a, b) => b.date - a.date));
//         setFilteredOrders(allOrders);


//       } catch {
//         toast.error("Failed to load orders!");
//       } finally {
//         // setLoading(false);
//         setTimeout(() => setLoading(false), 1500);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Filter orders by search & status
//   useEffect(() => {
//     let filtered = orders;

//     if (searchTerm) {
//       filtered = filtered.filter(o =>
//         [o.customer, o.customerEmail, o.id]
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter !== "all") {
//       filtered = filtered.filter(o => o.status.toLowerCase() === statusFilter);
//     }

//     setFilteredOrders(filtered);
//   }, [searchTerm, statusFilter, orders]);

//   // Update status both locally & in backend
//   const updateOrderStatus = async (orderId, newStatus) => {
//     setOrders(prev =>
//       prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
//     );
//     toast.success(`Order marked as ${newStatus}`);

//     try {
//       const { data: users } = await api.get("/users");
//       const user = users.find(u => u.orders?.some(o => o.id === orderId));
//       if (user) {
//         const updatedOrders = user.orders.map(o =>
//           o.id === orderId ? { ...o, status: newStatus } : o
//         );
//         await api.patch(`/users/${user.id}`, { orders: updatedOrders });
//       }
//     } catch {
//       toast.error("Failed to update order in database!");
//     }
//   };

//   // Status color helper
//   const getStatusColor = (status) => ({
//     completed: "bg-green-50 text-green-700 border-green-200",
//     success: "bg-green-50 text-green-700 border-green-200",
//     pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
//     processing: "bg-blue-50 text-blue-700 border-blue-200",
//     shipped: "bg-purple-50 text-purple-700 border-purple-200",
//     cancelled: "bg-red-50 text-red-700 border-red-200",
//     failed: "bg-red-50 text-red-700 border-red-200",
//   }[status.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200");

//   if (loading)
//     return (
//       <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="flex-1 flex flex-col">
//           <AdminNav setSidebarOpen={setSidebarOpen} />
//             <div className="flex flex-col items-center">
//               <div className="text-lg text-gray-600"><Loaders/></div>
//             </div>
//         </div>
//       </div>
//     );

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminNav setSidebarOpen={setSidebarOpen} />

//         <main className="flex-1 overflow-y-auto p-6 lg:p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
//             <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
//                 </div>
//                 <div className="p-3 bg-blue-50 rounded-xl">
//                   <Package className="h-6 w-6 text-blue-500" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pending</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {orders.filter(o => o.status.toLowerCase() === 'pending').length}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-yellow-50 rounded-xl">
//                   <Calendar className="h-6 w-6 text-yellow-500" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Completed</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {orders.filter(o => o.status.toLowerCase() === 'completed').length}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-green-50 rounded-xl">
//                   <User className="h-6 w-6 text-green-500" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     ₹{orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0)}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-purple-50 rounded-xl">
//                   <IndianRupeeIcon className="h-6 w-6 text-purple-500" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filters Card */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
//             <div className="flex flex-col lg:flex-row gap-4 items-center">
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by order ID, customer name, or email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <Filter className="h-5 w-5 text-gray-400" />
//                 <div className="relative">
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="appearance-none border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white cursor-pointer"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Orders Table Card */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//             <div className="px-6 py-5 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   Customer Orders
//                 </h3>
//                 <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
//                   {filteredOrders.length} orders found
//                 </span>
//               </div>
//             </div>

//             {filteredOrders.length === 0 ? (
//               <div className="p-12 text-center">
//                 <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg font-medium">No orders found</p>
//                 <p className="text-gray-400 text-sm mt-1">
//                   {searchTerm || statusFilter !== 'all' 
//                     ? "Try adjusting your search or filters" 
//                     : "No orders have been placed yet"}
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-100">
//                   <thead className="bg-blue-50">
//                     <tr>
//                       {["Order ID", "Customer", "Date", "Amount", "Status", "Actions"].map((head) => (
//                         <th 
//                           key={head} 
//                           className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
//                         >
//                           {head}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-100">
//                     {filteredOrders.map((order) => (
//                       <tr 
//                         key={order.id} 
//                         className="hover:bg-gray-50 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-semibold text-gray-900">
//                             #{order.id}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="text-sm font-medium text-gray-900">
//                               {order.customer}
//                             </span>
//                             <span className="text-xs text-gray-500 mt-1">
//                               {order.customerEmail}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center text-sm text-gray-600">
//                             <Calendar className="h-4 w-4 mr-2 text-gray-400" />
//                             {order.formattedDate}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-bold text-gray-900">
//                             ₹{order.totalAmount}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <select
//                             value={order.status}
//                             onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                             className={`text-xs font-medium rounded-lg px-3 py-2 border transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-opacity-50 ${getStatusColor(order.status)}`}
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="processing">Processing</option>
//                             <option value="shipped">Shipped</option>
//                             <option value="completed">Completed</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             onClick={() => setSelectedOrder(order)}
//                             className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
//                           >
//                             <Eye className="h-4 w-4 mr-2" />
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Order Details Modal */}
//           {selectedOrder && (
//             <div
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//               onClick={() => setSelectedOrder(null)}
//             >
//               <div
//                 className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold text-gray-900">
//                     Order #{selectedOrder.id}
//                   </h3>
//                   <button
//                     onClick={() => setSelectedOrder(null)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     ×
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                     <User className="h-5 w-5 text-gray-400" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">{selectedOrder.customer}</p>
//                       <p className="text-xs text-gray-500">{selectedOrder.customerEmail}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                     <Calendar className="h-5 w-5 text-gray-400" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">Order Date</p>
//                       <p className="text-xs text-gray-500">{selectedOrder.formattedDate}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                     <Package className="h-5 w-5 text-gray-400" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">Status</p>
//                       <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
//                         {selectedOrder.status}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="border-t pt-4">
//                     <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
//                     {selectedOrder.items?.length ? (
//                       <div className="space-y-2">
//                         {selectedOrder.items.map((item, i) => (
//                           <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
//                             <div>
//                               <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                               <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                             </div>
//                             <span className="text-sm font-semibold text-gray-900">
//                               ₹{item.price}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 text-sm text-center py-4">No items found</p>
//                     )}
//                   </div>

//                   <div className="border-t pt-4 flex justify-between items-center">
//                     <span className="text-lg font-bold text-gray-900">Total Amount:</span>
//                     <span className="text-lg font-bold text-blue-600">₹{selectedOrder.totalAmount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Orders;

import React, { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import Sidebar from "./Sidebar";
import api from "../Api/Api";
import { toast } from "react-toastify";
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronDown, 
  Calendar, 
  User, 
  Package, 
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MoreVertical,
  Download,
  BarChart3,
  ShoppingBag
} from "lucide-react";
import Loaders from "../../effects/Adminloader";

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");

  // Fetch all user orders 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: users } = await api.get("/users");
        const customerUsers = users.filter(u => u.role?.toLowerCase() !== "admin");

        const allOrders = customerUsers.flatMap(user =>
          (user.orders || []).map(order => ({
            ...order,
            customer: user.name,
            customerEmail: user.email,
            date: new Date(order.orderDate),
            formattedDate: new Date(order.orderDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            formattedTime: new Date(order.orderDate).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: order.status || "Pending",
          }))
        );

        const sortedOrders = allOrders.sort((a, b) => b.date - a.date);
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);

      } catch {
        toast.error("Failed to load orders!");
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders by search & status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(o =>
        [o.customer, o.customerEmail, o.id]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(o => o.status.toLowerCase() === statusFilter);
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const lastWeek = new Date(now.setDate(now.getDate() - 7));
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.date);
        switch (timeFilter) {
          case "today":
            return orderDate.toDateString() === new Date().toDateString();
          case "week":
            return orderDate >= lastWeek;
          case "month":
            return orderDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, timeFilter, orders]);

  // Update status both locally & in backend
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order marked as ${newStatus}`);

    try {
      const { data: users } = await api.get("/users");
      const user = users.find(u => u.orders?.some(o => o.id === orderId));
      if (user) {
        const updatedOrders = user.orders.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        );
        await api.patch(`/users/${user.id}`, { orders: updatedOrders });
      }
    } catch {
      toast.error("Failed to update order in database!");
    }
  };

  // Status color helper
  const getStatusColor = (status) => {
    const colors = {
      completed: "from-green-500 to-green-600",
      success: "from-green-500 to-green-600",
      pending: "from-yellow-500 to-yellow-600",
      processing: "from-blue-500 to-blue-600",
      shipped: "from-purple-500 to-purple-600",
      cancelled: "from-red-500 to-red-600",
      failed: "from-red-500 to-red-600",
    };
    return colors[status.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      processing: <Package className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
    };
    return icons[status.toLowerCase()] || <Package className="h-4 w-4" />;
  };

  // Calculate additional stats
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending').length;
  const completedOrders = orders.filter(o => o.status.toLowerCase() === 'completed').length;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  if (loading)
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <AdminNav setSidebarOpen={setSidebarOpen} />
          <div className="flex flex-col items-center justify-center h-64">
            <Loaders/>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNav setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Order Management
                </h1>
                <p className="text-gray-600 mt-2">Manage and track all customer orders efficiently</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingOrders}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{completedOrders}</p>
                  <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Average: ₹{averageOrderValue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <IndianRupee className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white cursor-pointer"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                  Customer Orders
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {filteredOrders.length} orders found
                  </span>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No orders found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search or filters" 
                    : "No orders have been placed yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr>
                      {["Order", "Customer", "Date & Time", "Amount", "Status", "Actions"].map((head) => (
                        <th 
                          key={head} 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              #{order.id.slice(-8).toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {order.items?.length || 0} items
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {order.customer}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {order.formattedDate}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.formattedTime}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-green-600 bg-green-50 px-3 py-2 rounded-xl">
                            ₹{order.totalAmount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`appearance-none text-sm font-semibold rounded-xl px-4 py-2 pr-8 border-0 bg-gradient-to-r ${getStatusColor(order.status)} text-white cursor-pointer transition-all duration-200 hover:shadow-lg`}
                            >
                              <option value="pending" className="bg-white text-gray-900">Pending</option>
                              <option value="processing" className="bg-white text-gray-900">Processing</option>
                              <option value="shipped" className="bg-white text-gray-900">Shipped</option>
                              <option value="completed" className="bg-white text-gray-900">Completed</option>
                              <option value="cancelled" className="bg-white text-gray-900">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Order #{selectedOrder.id}
                    </h3>
                    <p className="text-gray-500 mt-1">Order details and customer information</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors duration-200"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-500" />
                        Customer Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.customerEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-green-500" />
                        Order Timeline
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.formattedDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Order Time</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.formattedTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-purple-500" />
                        Order Status
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold px-3 py-2 rounded-xl bg-gradient-to-r ${getStatusColor(selectedOrder.status)} text-white`}>
                          {selectedOrder.status}
                        </span>
                        {getStatusIcon(selectedOrder.status)}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                      {selectedOrder.items?.length ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {selectedOrder.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No items found</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                      ₹{selectedOrder.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Orders;