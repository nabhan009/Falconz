import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Api/Api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { user, updateUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const navigate = useNavigate();

  // Load cart from backend
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const { data: userData } = await api.get(`/users/${user.id}`);
        setCartItems(userData.cart || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(cartId);
    try {
      const updated = cartItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updated);
      
      const updatedUser = { ...user, cart: updated };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeFromCart = async (cartId) => {
    setUpdating(cartId);
    try {
      const updated = cartItems.filter(item => item.cartId !== cartId);
      setCartItems(updated);
      
      const updatedUser = { ...user, cart: updated };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
     toast.success("Item removed from cart", {
  position: "top-right",
  autoClose: 2000,
});
    } catch (err) {
      console.error('Error removing from cart:', err);
      alert('Failed to remove item from cart');
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    
    try {
      const updatedUser = { ...user, cart: [] };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      setCartItems([]);
      
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart');
    }
  };

  const calculateTotal = () => cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
    return sum + (price * (item.quantity || 1));
  }, 0);

  const calculateTotalItems = () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);


// In your Cart component, update the proceedToCheckout function:
const proceedToCheckout = async () => {
  if (cartItems.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Show processing animation
  setOrderProcessing(true);

  try {
    // Create order object
    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderDate: new Date().toISOString(),
      items: cartItems,
      totalAmount: calculateTotal() * 1.1, // Including tax
      status: 'Success',
      shippingAddress: user.shippingAddress || {
        street: '123 Main St',
        city: 'Your City',
        state: 'Your State',
        zipCode: '12345'
      }
    };

    // Get current user data
    const { data: currentUser } = await api.get(`/users/${user.id}`);
    
    // Update user with new order and clear cart
    const updatedUser = {
      ...currentUser,
      orders: [...(currentUser.orders || []), newOrder],
      cart: [] // Clear the cart
    };

    // Update in backend
    await api.put(`/users/${user.id}`, updatedUser);
    
    // Update in context and localStorage
    updateUser(updatedUser);
    setCartItems([]);
    
    // Show order confirmation
    setOrderProcessing(false);
    setShowOrderConfirm(true);
    
  } catch (err) {
    console.error('Order processing error:', err);
    alert('Order failed. Please try again.');
    setOrderProcessing(false);
  }
};

// Add this function to navigate to orders
const viewOrders = () => {
  setShowOrderConfirm(false);
  navigate('/orders');
};
  const closeOrderConfirm = () => {
    setShowOrderConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your shopping cart.</p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              Login to Your Account
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order Processing Animation */}
      {orderProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Your Order</h3>
            <p className="text-gray-600">Please wait while we confirm your order...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      {showOrderConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your order! Your order has been successfully placed.
            </p>

            <div className="space-y-3">
              <button
                onClick={closeOrderConfirm}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  closeOrderConfirm();
                  navigate('/shop');
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {calculateTotalItems()} {calculateTotalItems() === 1 ? 'item' : 'items'} in your cart
                {user && <span className="text-green-600 ml-2">Welcome, {user.name}!</span>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Clear Cart
                </button>
              )}
              {/* <Link
                to="/shop"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ← Continue Shopping
              </Link> */}

<div className="space-y-3">
  {/* <button
    onClick={closeOrderConfirm}
    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
  >
    Continue Shopping
  </button> */}
  <button
    onClick={viewOrders}
    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
  >
    View My Orders
  </button>
</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map(item => (
                    <div key={item.cartId} className="p-6 flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"; }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">{item.description || "Fresh and high-quality product"}</p>
                            <p className="text-green-600 font-semibold mt-2">
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            disabled={updating === item.cartId}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            title="Remove from cart"
                          >
                            {updating === item.cartId ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                            ) : (
                              '❌'
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-700 font-medium">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}
                                disabled={updating === item.cartId || (item.quantity || 1) <= 1}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold">{item.quantity || 1}</span>
                              <button
                                onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                                disabled={updating === item.cartId}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ${((typeof item.price === 'number' ? item.price : parseFloat(item.price || 0)) * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({calculateTotalItems()})</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 mt-6"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Free shipping on orders over $50</p>
                    <p>30-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-block">
                Explore Products
              </Link>
              <Link to="/wishlist" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-block">
                View Wishlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;