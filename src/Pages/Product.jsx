import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCartPlus, FaArrowLeft, FaStar, FaShare, FaMinus, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../Api/Api';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
  const [alert, setAlert] = useState(null);

  // Show alert
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First check if product was passed via state
        if (location.state?.product) {
          setProduct(location.state.product);
          setLoading(false);
          return;
        }

        // If not, fetch from API
        const { data } = await api.get(`/Products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location.state]);

  // Wishlist functions
  const isInWishlist = () => user?.wishlist?.some(item => item.id === product?.id);

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      let updatedWishlist;
      
      if (isInWishlist()) {
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

  // Add to cart function
  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      let updatedCart;
      const existingCartItem = user.cart?.find(item => item.id === product.id);

      if (existingCartItem) {
        updatedCart = user.cart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
        showAlert(`${quantity} ${product.name}(s) added to cart!`, 'success');
      } else {
        const cartItem = {
          ...product,
          cartId: Date.now(),
          quantity: quantity,
          addedAt: new Date().toISOString()
        };
        updatedCart = user.cart ? [...user.cart, cartItem] : [cartItem];
        showAlert(`${quantity} ${product.name}(s) added to cart!`, 'success');
      }

      const updatedUser = { ...user, cart: updatedCart };
      await api.put(`/users/${user.id}`, updatedUser);
      updateUser(updatedUser);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      showAlert('Failed to add product to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert */}
      {alert && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm transform transition-transform duration-300 ${
          alert.type === 'success' ? 'bg-green-500' : 
          alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {alert.message}
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
           >
            <FaArrowLeft />
            Back to Shop
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-150 object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {product.rating && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold text-yellow-700">{product.rating}</span>
                  </div>
                )}
                {product.category && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                ₹{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2)}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  Total: ₹{((typeof product.price === 'number' ? product.price : parseFloat(product.price || 0)) * quantity).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={addToCart}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-3 text-lg"
              >
                <FaCartPlus className="text-xl" />
                Add to Cart ({quantity})
              </button>
              
              <button
                onClick={toggleWishlist}
                className="px-8 py-4 border border-gray-300 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center gap-3"
              >
                {isInWishlist() ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-xl" />
                )}
                Wishlist
              </button>

              <button  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 text-lg"
>
                Buy Now
              </button>
            </div>

            {/* Product Features */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800">📦 Product Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Fresh & High Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Secure Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

