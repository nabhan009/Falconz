// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./component/Navbar";
// import Footer from "./component/Footer"; 
// import Home from "./Pages/Home";
// import Shop from "./Pages/Shop";
// import About from "./Pages/About";
// import Contact from "./Pages/Contact";
// import Login from "./Auth/Login";
// import SignUp from "./Auth/signup";
// import Cart from "./Pages/Cart";
// import WishList from "./Pages/WishList";
// import Profile from "./Pages/Profile";
// import Product from "./Pages/Product";
// import Orders from "./Pages/Orders";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ProtectedRoute from "./context/ProtectedRoute"; // ✅ using your Auth-based protected route
// import AdminDashboard from "./Admin/Admin";
// import { BrainCog } from "lucide-react";

// function App() {
//   return (
//     <>
//       {/* <Router> */}
//       {/* <BrowserRouter> */}
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/shop" element={<Shop />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/product/:id" element={<Product />} />
//           {/* Guest-only routes (requireAuth = false) */}
//           <Route
//             path="/login"
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <Login />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/signup"
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <SignUp />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//            path="/admindashboard"
//            element={
//              <ProtectedRoute requireAuth={true} requiredRole="admin">
//                 <AdminDashboard />
//              </ProtectedRoute>
//            }
//           />

//           {/* Protected routes (requireAuth = true by default) */}
//           <Route
//             path="/cart"
//             element={
//               <ProtectedRoute>
//                 <Cart />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/wishlist"
//             element={
//               <ProtectedRoute>
//                 <WishList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/orders"
//             element={
//               <ProtectedRoute>
//                 <Orders />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       {/* </Router> */}
//       {/* </BrowserRouter> */}
//       <ToastContainer />
//     </>
//   );
// }

// export default App;


import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer"; 
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Auth/Login";
import SignUp from "./Auth/signup";
import Cart from "./Pages/Cart";
import WishList from "./Pages/WishList";
import Profile from "./Pages/Profile";
import Product from "./Pages/Product";
import Orders from "./Pages/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./context/ProtectedRoute"; 
import AdminDashboard from "./Admin/Admin"
import AllProducts from "./Admin/AllProducts";
import AllOrders from "./Admin/AllOrders";
import AllUsers from "./Admin/AllUsers";             
import Checkout from "./Pages/Checkout";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto redirect admin after refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (
        user.role?.toLowerCase() === "admin" &&
        (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup")
      ) {
        navigate("/admindashboard", { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  // Pages where we **don't want Navbar/Footer**
  const hideNavFooterPages = ["/login", "/signup", "/admindashboard","/products","/allorders","/users"];

  const showNavFooter = !hideNavFooterPages.includes(location.pathname);

  return (
    <>
      {showNavFooter && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Guest-only routes */}
        <Route
          path="/login"
          element={
            // <ProtectedRoute requireAuth={false}>
              <Login />
            // {/* </ProtectedRoute> */}
          }
        />
        <Route
          path="/signup"
          element={
            // <ProtectedRoute requireAuth={false}>
              <SignUp />
            // </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allorders"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="admin">
              <AllOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="admin">
              <AllProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requireAuth={true} requiredRole="admin">
              <AllUsers />
            </ProtectedRoute>
          }
        />

        {/* User protected routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {showNavFooter && <Footer />}
      <ToastContainer />
    </>
  );
}

export default AppContent;
