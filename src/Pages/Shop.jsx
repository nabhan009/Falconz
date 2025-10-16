import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaCartPlus, FaFilter, FaSort, FaSearch, FaTimes, FaEye, FaStar, FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../Api/Api';
import Loader from '../../effects/Loading';
import { toast } from 'react-toastify';

function Shop() {
  const { user, updateUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  
  // Filter and sort states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // Categories with enhanced styling
  const categories = [
    { value: 'all', label: 'All Products', icon: '🛒', color: 'bg-blue-500' },
    { value: 'meat', label: 'Meat', icon: '🥩', color: 'bg-blue-500' },
    { value: 'dairy', label: 'Dairy', icon: '🥛', color: 'bg-blue-500' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥦', color: 'bg-blue-500' },
    { value: 'fruits', label: 'Fruits', icon: '🍎', color: 'bg-blue-500' },
    { value: 'Beverages & Snacks', label: 'Beverages & Snacks', icon: '🥤', color: 'bg-blue-500' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Fetch products (unchanged)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: productsData } = await api.get('/Products');
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        setTimeout(() => {
          setLoading(false);
          setShowLoader(false);
        }, 2000);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        
        setTimeout(() => {
          setLoading(false);
          setShowLoader(false);
        }, 2000);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting (unchanged)
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchQuery]);

  // Show alert with enhanced styling
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // View product details (unchanged)
  const viewProductDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Wishlist functions (unchanged)
  const isInWishlist = (productId) => user?.wishlist?.some(item => item.id === productId);

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.warning("please login to add to cart")
      return;
    }

    try {
      let updatedWishlist;
      
      if (isInWishlist(product.id)) {
        updatedWishlist = user.wishlist.filter(item => item.id !== product.id);
        showAlert(`${product.name} removed from wishlist`, 'info');
      } else {
        updatedWishlist = [...(user.wishlist || []), product];
        showAlert(`${product.name} added to wishlist!`, 'success');
      }

      const updatedUser = { ...user, wishlist: updatedWishlist };
      await api.put(`/users/${user.id}`, updatedUser);
      updateUser(updatedUser);
      
    } catch (err) {
      console.error('Error updating wishlist:', err);
      showAlert('Failed to update wishlist', 'error');
    }
  };

  // Cart functions (unchanged)
  const addToCart = async (product) => {
    if (!user) {
      toast.warning("please login to add to cart")
      return;
    }

    try {
      let updatedCart;
      const existingCartItem = user.cart?.find(item => item.id === product.id);

      if (existingCartItem) {
        updatedCart = user.cart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        showAlert(`${product.name} quantity increased to ${(existingCartItem.quantity || 1) + 1}`, 'info');
      } else {
        const cartItem = {
          ...product,
          cartId: Date.now(),
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        updatedCart = user.cart ? [...user.cart, cartItem] : [cartItem];
        showAlert(`${product.name} added to cart!`, 'success');
      }

      const updatedUser = { ...user, cart: updatedCart };
      await api.put(`/users/${user.id}`, updatedUser);
      updateUser(updatedUser);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      showAlert('Failed to add product to cart', 'error');
    }
  };

  // Reset filters (unchanged)
  const resetFilters = () => {
    setSelectedCategory('all');
    setSortBy('name');
    setSearchQuery('');
  };

  // Loading state (unchanged)
  if (loading || showLoader) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Enhanced Alert */}
      {alert && (
        <div className={`fixed top-6 right-6 z-50 p-6 rounded-2xl shadow-2xl text-white max-w-sm transform transition-all duration-500 ${
          alert.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
          alert.type === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 
          'bg-gradient-to-r from-blue-500 to-cyan-600'
        } animate-bounce-in`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white bg-opacity-20`}>
                {alert.type === 'success' && '✅'}
                {alert.type === 'error' && '❌'}
                {alert.type === 'info' && 'ℹ️'}
              </div>
              <span className="font-semibold">{alert.message}</span>
            </div>
            <button 
              onClick={() => setAlert(null)} 
              className="ml-4 hover:scale-110 transition-transform duration-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-3 bg-green bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <FaLeaf className="text-2xl" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-100">
                Fresh Market
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Discover the finest selection of fresh products delivered to your doorstep
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white to-green-100 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-green-400 text-xl z-10" />
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full pl-16 pr-12 py-5 bg-white bg-opacity-95 backdrop-blur-sm border-0 rounded-2xl  text-lg placeholder-green-500 text-green-900 font-medium shadow-2xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-600 transition-colors duration-200 z-10"
                >
                  <FaTimes className="text-xl" />
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Category Filters - Changed to dark background for better visibility */}
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`group relative overflow-hidden flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                  selectedCategory === category.value
                    ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                    : 'bg-green-800 bg-opacity-80 backdrop-blur-sm text-white hover:bg-green-700 border border-green-600'
                }`}
              >
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <span className="font-semibold text-lg whitespace-nowrap">
                  {category.label}
                </span>
                <div className={`absolute inset-0  bg-opacity-10 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300 ${
                  selectedCategory === category.value ? 'scale-100' : ''
                }`}></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-10">
        {/* Enhanced Controls Bar */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-green-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Enhanced Sort Dropdown */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FaSort className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 text-lg z-10" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="relative pl-12 pr-8 py-4 bg-white border-2 border-green-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none font-medium text-gray-700 hover:border-green-300 transition-all duration-300 shadow-lg"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enhanced Reset Button */}
              <button
                onClick={resetFilters}
                className="group relative px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-green-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
                  Reset All
                </span>
              </button>
            </div>

            {/* Enhanced Results Counter */}
            <div className="bg-green-600 px-6 py-4 rounded-2xl shadow-lg">
              <span className="text-white font-bold text-lg">
                Showing <span className="text-yellow-300">{filteredProducts.length}</span> of{' '}
                <span className="text-green-100">{products.length}</span> products
              </span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl border border-green-100">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No products found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="bg-green-600 text-white px-10 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 text-lg"
            >
              <FaTimes />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border border-green-50"
                onClick={() => viewProductDetails(product)}
              >
                {/* Enhanced Product Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }} 
                      className={`w-12 h-12 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                        isInWishlist(product.id) 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      {isInWishlist(product.id) ? (
                        <FaHeart className="text-lg" />
                      ) : (
                        <FaRegHeart className="text-lg" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        viewProductDetails(product);
                      }}
                      className="w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                      title="View Details"
                    >
                      <FaEye className="text-lg" />
                    </button>
                  </div>
                  
                  {/* Enhanced Category Badge */}
                  {product.category && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                      {product.category}
                    </div>
                  )}

                  {/* Enhanced Rating Badge */}
                  {product.rating && (
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-2 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-1">
                      <FaStar className="text-xs" />
                      {product.rating}
                    </div>
                  )}
                </div>

                {/* Enhanced Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description || "Fresh and high-quality product"}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                      ₹{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Enhanced Add to Cart Button - Removed cart icon hover effect */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }} 
                    className="w-full group/btn bg-green-600 text-white py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-green bg-opacity-0 group-hover/btn:bg-opacity-10 transition-all duration-300"></div>
                    <FaCartPlus className="text-xl" />
                    <span className="relative">Add to Cart</span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500"></div>
                  </button>
                </div>

                {/* Enhanced Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-3xl transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add some custom styles for animations */}
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: translateX(100%) scale(0.3); opacity: 0; }
          50% { transform: translateX(0) scale(1.05); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Shop;