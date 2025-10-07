import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, HeartIcon, ShoppingBagIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const {
    user,
    logout,
    wishlistCount,
    cartCount,
    profileOpen,
    setProfileOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/Shop' },
    { name: 'About', path: '/About' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navClass = (path) =>
    `transition-all duration-300 font-medium px-4 py-2 rounded-lg ${
      location.pathname === path
        ? 'bg-[#4CBB17] text-white shadow-lg scale-105'
        : 'text-[#4CBB17] hover:bg-[#48872B] hover:text-white hover:shadow-md'
    }`;

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-[#36a104] to-[#8ef435] bg-clip-text text-transparent">
              Falconz.
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-1">
            {links.map(link => (
              <Link key={link.path} to={link.path} className={navClass(link.path)}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-xl bg-gray-100 text-gray-700 placeholder-gray-400 border focus:border-green-500 focus:outline-none"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>

            {/* Wishlist */}
            <button onClick={() => navigate('/wishList')} className="relative p-2 rounded-full hover:bg-green-100">
              <HeartIcon className="h-6 w-6 text-green-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => navigate('/Cart')} className="relative p-2 rounded-full hover:bg-green-100">
              <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button onClick={() => setProfileOpen(!profileOpen)} className="p-2 rounded-full hover:bg-green-100">
              <UserIcon className="h-6 w-6 text-green-600" />
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-full hover:bg-green-100">
              <Bars3Icon className="h-6 w-6 text-green-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Popup */}
      {profileOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 border w-60 z-50">
          {user ? (
            <div className="space-y-2 text-sm">
              <p className="font-bold text-green-600">Hello, {user.name}</p>
              <button
                onClick={() => { navigate('/Profile'); setProfileOpen(false); }}
                className="w-full bg-green-600 text-white py-2 mt-2 rounded-lg text-sm"
              >
                Profile
              </button>
              <button
                onClick={() => { navigate('/Orders'); setProfileOpen(false); }}
                className="w-full bg-green-600 text-white py-2 mt-2 rounded-lg text-sm"
              >
                Order History
              </button>
              <button
                onClick={()=>{logout
                    navigate('/login')
                }}
                className="w-full bg-red-500 text-white py-2 mt-2 rounded-lg text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-bold text-gray-700">Welcome Guest</p>
              <button onClick={() => { navigate('/Login'); setProfileOpen(false); }} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">
                Login
              </button>
              <button onClick={() => { navigate('/Signup'); setProfileOpen(false); }} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300">
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
