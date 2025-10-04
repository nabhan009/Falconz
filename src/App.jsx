import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer"; // Import the Footer component
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

function Layout({ children }) {
  const location = useLocation();

  // pages where navbar should NOT appear
  const hideNavbarPaths = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  // pages where footer should NOT appear
  const hideFooterPaths = ["/login", "/signup"];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/About" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/WishList" element={<WishList />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/product/:id" element={<Product />} />
              <Route path="/orders" element={<Orders />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;