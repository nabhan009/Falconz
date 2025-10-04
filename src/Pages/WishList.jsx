// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../Api/Api';

// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Load wishlist from user's data in db.json
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//         if (!loggedInUser) {
//         //   alert('Please login to view your wishlist');
//           navigate('/login');
//           return;
//         }

//         const { data: userData } = await api.get(`/users/${loggedInUser.id}`);
//         setCurrentUser(userData);
//         setWishlist(userData.wishlist || []);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   // Remove from wishlist and update db.json
//   const removeFromWishlist = async (productId) => {
//     const updatedWishlist = wishlist.filter(item => item.id !== productId);
//     setWishlist(updatedWishlist);

//     try {
//       await api.patch(`/users/${currentUser.id}`, {
//         wishlist: updatedWishlist
//       });
//     } catch (err) {
//       console.error('Error updating wishlist:', err);
//     }
//   };

//   // Clear entire wishlist
//   const clearWishlist = async () => {
//     setWishlist([]);
//     try {
//       await api.patch(`/users/${currentUser.id}`, {
//         wishlist: []
//       });
//     } catch (err) {
//       console.error('Error clearing wishlist:', err);
//     }
//   };

//   // Add to cart and update db.json
//   const addToCart = async (product) => {
//     try {
//       const cartItem = {
//         ...product,
//         cartId: Date.now(),
//         quantity: 1,
//         addedAt: new Date().toISOString()
//       };

//       const updatedCart = currentUser?.cart ? [...currentUser.cart, cartItem] : [cartItem];
      
//       await api.patch(`/users/${currentUser.id}`, {
//         cart: updatedCart
//       });

//       setCurrentUser(prev => ({
//         ...prev,
//         cart: updatedCart
//       }));

//       alert(`${product.name} added to cart!`);
//     } catch (err) {
//       console.error('Error adding to cart:', err);
//       alert('Failed to add product to cart');
//     }
//   };

//   // Move all wishlist items to cart
//   const moveAllToCart = async () => {
//     try {
//       const cartUpdates = wishlist.map(item => ({
//         ...item,
//         cartId: Date.now() + Math.random(),
//         quantity: 1,
//         addedAt: new Date().toISOString()
//       }));

//       const updatedCart = currentUser?.cart 
//         ? [...currentUser.cart, ...cartUpdates]
//         : cartUpdates;

//       await api.patch(`/users/${currentUser.id}`, {
//         cart: updatedCart,
//         wishlist: [] // Clear wishlist after moving to cart
//       });

//       setCurrentUser(prev => ({
//         ...prev,
//         cart: updatedCart
//       }));
//       setWishlist([]);

//       alert('All wishlist items moved to cart!');
//     } catch (err) {
//       console.error('Error moving items to cart:', err);
//       alert('Failed to move items to cart');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-green-700">
//         Loading wishlist...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
//               <p className="text-gray-600">
//                 {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
//                 {currentUser && <span className="text-green-600 ml-2">Welcome, {currentUser.name}!</span>}
//               </p>
//             </div>
//             <div className="flex items-center gap-4">
//               {wishlist.length > 0 && (
//                 <>
//                   <button
//                     onClick={moveAllToCart}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                   >
//                     Move All to Cart
//                   </button>
//                   <button
//                     onClick={clearWishlist}
//                     className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                   >
//                     Clear All
//                   </button>
//                 </>
//               )}
//               <Link
//                 to="/shop"
//                 className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//               >
//                 ← Back to Shop
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         {wishlist.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {wishlist.map(product => (
//               <div
//                 key={product.wishlistId || product.id}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative"
//               >
//                 {/* Remove from Wishlist Button */}
//                 <button
//                   onClick={() => removeFromWishlist(product.id)}
//                   className="absolute top-3 left-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
//                 >
//                   ❌
//                 </button>

//                 <div className="relative overflow-hidden">
//                   <img
//                     src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"}
//                     alt={product.name}
//                     className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
//                     onError={(e) => {
//                       e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";
//                     }}
//                   />
//                   <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                     {product.category}
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
//                     {product.name}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {product.description || "Fresh and high-quality product"}
//                   </p>
                  
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-2xl font-bold text-green-600">
//                       ${product.price}
//                     </span>
//                     {product.stock && (
//                       <span className={`text-sm font-medium ${
//                         product.stock > 10 ? 'text-green-600' : 'text-orange-600'
//                       }`}>
//                         {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => addToCart(product)}
//                       className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
//                     >
//                       <span>Add to Cart</span>
//                       <span>🛒</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16 bg-white rounded-lg shadow-sm">
//             <div className="text-6xl mb-4">💔</div>
//             <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
//             <p className="text-gray-600 mb-6">Start adding some products to your wishlist!</p>
//             <Link
//               to="/shop"
//               className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
//             >
//               Explore Products
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;


// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../Api/Api';
// // import { AuthContext } from '../context/AuthContext';

// const Wishlist = () => {
//   const { currentUser, setCurrentUser } = useContext(AuthContext);
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch wishlist on mount or when currentUser changes
//   useEffect(() => {
//     if (!currentUser) {
//       navigate('/login');
//       return;
//     }

//     const fetchWishlist = async () => {
//       try {
//         const { data: userData } = await api.get(`/users/${currentUser.id}`);
//         setCurrentUser(userData); // sync context
//         setWishlist(userData.wishlist || []);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [currentUser, navigate, setCurrentUser]);

//   const removeFromWishlist = async (id) => {
//     const updated = wishlist.filter(item => item.id !== id);
//     setWishlist(updated);
//     try {
//       await api.patch(`/users/${currentUser.id}`, { wishlist: updated });
//       setCurrentUser(prev => ({ ...prev, wishlist: updated }));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const addToCart = async (product) => {
//     const cartItem = { ...product, cartId: Date.now(), quantity: 1, addedAt: new Date().toISOString() };
//     const updatedCart = currentUser.cart ? [...currentUser.cart, cartItem] : [cartItem];

//     try {
//       await api.patch(`/users/${currentUser.id}`, { cart: updatedCart });
//       setCurrentUser(prev => ({ ...prev, cart: updatedCart }));
//       alert(`${product.name} added to cart!`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add to cart");
//     }
//   };

//   const moveAllToCart = async () => {
//     const cartUpdates = wishlist.map(item => ({
//       ...item,
//       cartId: Date.now() + Math.random(),
//       quantity: 1,
//       addedAt: new Date().toISOString()
//     }));
//     const updatedCart = currentUser.cart ? [...currentUser.cart, ...cartUpdates] : cartUpdates;

//     try {
//       await api.patch(`/users/${currentUser.id}`, { cart: updatedCart, wishlist: [] });
//       setCurrentUser(prev => ({ ...prev, cart: updatedCart, wishlist: [] }));
//       setWishlist([]);
//       alert("All wishlist items moved to cart!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const clearWishlist = async () => {
//     setWishlist([]);
//     try {
//       await api.patch(`/users/${currentUser.id}`, { wishlist: [] });
//       setCurrentUser(prev => ({ ...prev, wishlist: [] }));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center min-h-screen">Loading wishlist...</div>;

//     return (
//      <div className="min-h-screen bg-gray-50">
//        {/* Header */}
//        <div className="bg-white shadow-sm">
//          <div className="container mx-auto px-4 py-8">
//            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//              <div>
//                <h1 className="text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
//                <p className="text-gray-600">
//                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
//                  {currentUser && <span className="text-green-600 ml-2">Welcome, {currentUser.name}!</span>}
//                </p>
//              </div>
//              <div className="flex items-center gap-4">
//                {wishlist.length > 0 && (
//                 <>
//                   <button
//                     onClick={moveAllToCart}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                   >
//                     Move All to Cart
//                   </button>
//                   <button
//                     onClick={clearWishlist}
//                     className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                   >
//                     Clear All
//                   </button>
//                 </>
//               )}
//               <Link
//                 to="/shop"
//                 className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//               >
//                 ← Back to Shop
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         {wishlist.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {wishlist.map(product => (
//               <div
//                 key={product.wishlistId || product.id}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative"
//               >
//                 {/* Remove from Wishlist Button */}
//                 <button
//                   onClick={() => removeFromWishlist(product.id)}
//                   className="absolute top-3 left-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
//                 >
//                   ❌
//                 </button>

//                 <div className="relative overflow-hidden">
//                   <img
//                     src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"}
//                     alt={product.name}
//                     className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
//                     onError={(e) => {
//                       e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";
//                     }}
//                   />
//                   <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                     {product.category}
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
//                     {product.name}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {product.description || "Fresh and high-quality product"}
//                   </p>
                  
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-2xl font-bold text-green-600">
//                       ${product.price}
//                     </span>
//                     {product.stock && (
//                       <span className={`text-sm font-medium ${
//                         product.stock > 10 ? 'text-green-600' : 'text-orange-600'
//                       }`}>
//                         {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => addToCart(product)}
//                       className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
//                     >
//                       <span>Add to Cart</span>
//                       <span>🛒</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16 bg-white rounded-lg shadow-sm">
//             <div className="text-6xl mb-4">💔</div>
//             <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
//             <p className="text-gray-600 mb-6">Start adding some products to your wishlist!</p>
//             <Link
//               to="/shop"
//               className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
//             >
//               Explore Products
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>

//   );
// };

// export default Wishlist;











// src/components/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Api/Api';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { user, updateUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  // Fetch wishlist on mount or when user changes
  useEffect(() => {
    if (!user) {
        
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data: userData } = await api.get(`/users/${user.id}`);
        setWishlist(userData.wishlist || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
      const updatedUser = { ...user, wishlist: updatedWishlist };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      setWishlist(updatedWishlist);
      
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (product) => {
    try {
      const cartItem = { 
        ...product, 
        cartId: Date.now(), 
        quantity: 1, 
        addedAt: new Date().toISOString() 
      };
      
      const updatedCart = user.cart ? [...user.cart, cartItem] : [cartItem];
      const updatedUser = { ...user, cart: updatedCart };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      
      alert(`${product.name} added to cart!`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert("Failed to add to cart");
    }
  };

  const moveAllToCart = async () => {
    if (wishlist.length === 0) return;
    
    try {
      const cartUpdates = wishlist.map(item => ({
        ...item,
        cartId: Date.now() + Math.random(),
        quantity: 1,
        addedAt: new Date().toISOString()
      }));
      
      const updatedCart = user.cart ? [...user.cart, ...cartUpdates] : cartUpdates;
      const updatedUser = { 
        ...user, 
        cart: updatedCart, 
        wishlist: [] 
      };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      setWishlist([]);
      
      alert("All wishlist items moved to cart!");
      
    } catch (err) {
      console.error('Error moving all to cart:', err);
      setError('Failed to move items to cart');
    }
  };

  const clearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) return;
    
    try {
      const updatedUser = { ...user, wishlist: [] };
      
      // Update in backend
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Update in context and localStorage
      updateUser(updatedUser);
      setWishlist([]);
      
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      setError('Failed to clear wishlist');
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your wishlist and save your favorite items.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                {user && <span className="text-green-600 ml-2">Welcome, {user.name}!</span>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {wishlist.length > 0 && (
                <>
                  <button
                    onClick={moveAllToCart}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Move All to Cart
                  </button>
                  <button
                    onClick={clearWishlist}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Clear All
                  </button>
                </>
              )}
              <Link
                to="/shop"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ← Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(product => (
              <div
                key={product.wishlistId || product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative"
              >
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 left-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                  title="Remove from wishlist"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";
                    }}
                  />
                  {product.category && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || "Fresh and high-quality product"}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2)}
                    </span>
                    {product.stock && (
                      <span className={`text-sm font-medium ${
                        product.stock > 10 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>Add to Cart</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding some products to your wishlist!</p>
            <Link
              to="/shop"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;