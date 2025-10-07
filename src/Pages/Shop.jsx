
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaCartPlus, FaFilter, FaSort, FaSearch, FaTimes, FaEye } from 'react-icons/fa';
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
  const [showLoader, setShowLoader] = useState(true); // New state for controlling loader visibility
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  
  // Filter and sort states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // Categories based on your product data
  const categories = [
    { value: 'all', label: 'All Products', icon: '🛒' },
    { value: 'meat', label: 'Meat', icon: '🥩' },
    { value: 'dairy', label: 'Dairy', icon: '🥛' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥦' },
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'Beverages & Snacks', label: 'Beverages & Snacks', icon: '🥤' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: productsData } = await api.get('/Products');
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Set a minimum loading time of 2 seconds
        setTimeout(() => {
          setLoading(false);
          setShowLoader(false);
        }, 2000);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        
        // Still wait 2 seconds even on error
        setTimeout(() => {
          setLoading(false);
          setShowLoader(false);
        }, 2000);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
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
  }, [products, selectedCategory, sortBy, priceRange, searchQuery]);

  // Show alert
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // View product details
  const viewProductDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Wishlist functions
  const isInWishlist = (productId) => user?.wishlist?.some(item => item.id === productId);

  const toggleWishlist = async (product) => {
    if (!user) {
    toast.warning("please login to add to cart")
      return;
    }

    try {
      let updatedWishlist;
      
      if (isInWishlist(product.id)) {
        // Remove from wishlist
        updatedWishlist = user.wishlist.filter(item => item.id !== product.id);
        showAlert(`${product.name} removed from wishlist`, 'info');
      } else {
        // Add to wishlist
        updatedWishlist = [...(user.wishlist || []), product];
        showAlert(`${product.name} added to wishlist!`, 'success');
      }

      const updatedUser = { ...user, wishlist: updatedWishlist };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      
    } catch (err) {
      console.error('Error updating wishlist:', err);
      showAlert('Failed to update wishlist', 'error');
    }
  };

  // Cart functions
  const addToCart = async (product) => {
    if (!user) {
      toast.warning("please login to add to cart")
      return;
    }

    try {
      let updatedCart;
      const existingCartItem = user.cart?.find(item => item.id === product.id);

      if (existingCartItem) {
        // Increase quantity
        updatedCart = user.cart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        showAlert(`${product.name} quantity increased to ${(existingCartItem.quantity || 1) + 1}`, 'info');
      } else {
        // Add new item
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
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      showAlert('Failed to add product to cart', 'error');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSortBy('name');
    setPriceRange([0, 100]);
    setSearchQuery('');
  };

  // Get max price for range slider
  const maxPrice = products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price))) : 100;

  // Loading state with 2-second delay
  if (loading || showLoader) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Loading fresh products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ... rest of your component remains exactly the same
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert */}
      {alert && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm transform transition-transform duration-300 ${
          alert.type === 'success' ? 'bg-green-500' : 
          alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          <div className="flex items-center justify-between">
            <span>{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-4">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Fresh Market
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the finest selection of fresh products delivered to your doorstep
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-500 hover:text-green-600'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                showFilters 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
              }`}
            >
              <FaFilter className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className="relative">
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border">
            <span className="text-gray-600 font-medium">
              Showing <span className="text-green-600 font-bold">{filteredProducts.length}</span> of{' '}
              <span className="font-bold">{products.length}</span> products
            </span>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Category Filter */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <span>📁</span> Category
                </h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={selectedCategory === category.value}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-green-500 focus:ring-green-500 w-4 h-4"
                      />
                      <span className="flex items-center gap-2 group-hover:text-green-600 transition-colors">
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <span>💰</span> Price Range
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                    />
                    <div className="flex justify-between text-sm font-medium text-gray-600 mt-3">
                      <span>${priceRange[0]}</span>
                      <span className="text-green-600 font-bold">Up to ${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="font-bold text-lg mb-3 text-gray-800">📊 Filter Summary</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Category: <span className="font-semibold text-green-600">
                    {categories.find(c => c.value === selectedCategory)?.label}
                  </span></p>
                  <p>• Price Range: <span className="font-semibold text-green-600">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span></p>
                  <p>• Sort By: <span className="font-semibold text-green-600">
                    {sortOptions.find(s => s.value === sortBy)?.label}
                  </span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <FaTimes />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
                onClick={() => viewProductDetails(product)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }} 
                      className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    >
                      {isInWishlist(product.id) ? (
                        <FaHeart className="text-red-500 text-lg" />
                      ) : (
                        <FaRegHeart className="text-gray-400 text-lg hover:text-red-500" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        viewProductDetails(product);
                      }}
                      className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                      title="View Details"
                    >
                      <FaEye className="text-blue-500 text-lg" />
                    </button>
                  </div>
                  {product.category && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.category}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description || "Fresh and high-quality product"}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2)}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-sm font-medium text-yellow-700">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }} 
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <FaCartPlus className="group-hover/btn:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;