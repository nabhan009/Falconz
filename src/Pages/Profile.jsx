// import React, { useEffect, useState } from "react";
// import { UserIcon, ShoppingBagIcon, HeartIcon, EnvelopeIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

// const ProfilePage = () => {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     cart: [],
//     wishlist: [],
//   });
  
//   const [editMode, setEditMode] = useState({
//     name: false,
//     email: false
//   });
  
//   const [editedUser, setEditedUser] = useState({
//     name: "",
//     email: ""
//   });

//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("user"));
//     if (savedUser) {
//       setUser(savedUser);
//       setEditedUser({
//         name: savedUser.name || "",
//         email: savedUser.email || ""
//       });
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/Login";
//   };

//   const handleEdit = (field) => {
//     setEditMode(prev => ({
//       ...prev,
//       [field]: true
//     }));
//   };

//   const handleSave = (field) => {
//     const updatedUser = {
//       ...user,
//       [field]: editedUser[field]
//     };
    
//     setUser(updatedUser);
//     localStorage.setItem("user", JSON.stringify(updatedUser));
    
//     setEditMode(prev => ({
//       ...prev,
//       [field]: false
//     }));
//   };

//   const handleCancel = (field) => {
//     setEditedUser(prev => ({
//       ...prev,
//       [field]: user[field]
//     }));
    
//     setEditMode(prev => ({
//       ...prev,
//       [field]: false
//     }));
//   };

//   const handleInputChange = (field, value) => {
//     setEditedUser(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center py-12 px-4">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">
//           My Profile
//         </h1>
//         <p className="text-gray-600">Manage your account and preferences</p>
//       </div>

//       <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
//         {/* User Profile Card */}
//         <div className="flex-1 flex flex-col gap-6">
//           {/* Profile Overview */}
//           <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
//             <div className="flex flex-col items-center text-center">
//               <div className="relative mb-6">
//                 <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
//                   <UserIcon className="h-12 w-12 text-white" />
//                 </div>
//               </div>
              
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name || "Guest User"}</h2>
//               <div className="flex items-center gap-2 text-gray-600 mb-6">
//                 <EnvelopeIcon className="h-4 w-4" />
//                 <p className="text-sm">{user.email || "guest@example.com"}</p>
//               </div>
              
//               <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6"></div>
              
//               <div className="flex gap-8">
//                 <div className="text-center">
//                   <div className="text-xl font-bold text-gray-800">{user.cart?.length || 0}</div>
//                   <div className="text-gray-500 text-sm">Cart Items</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xl font-bold text-gray-800">{user.wishlist?.length || 0}</div>
//                   <div className="text-gray-500 text-sm">Wishlist</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-emerald-100 rounded-lg">
//                   <ShoppingBagIcon className="h-5 w-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-gray-800">{user.cart?.length || 0}</div>
//                   <div className="text-gray-500 text-xs">In Cart</div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-rose-100 rounded-lg">
//                   <HeartIcon className="h-5 w-5 text-rose-600" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-gray-800">{user.wishlist?.length || 0}</div>
//                   <div className="text-gray-500 text-xs">Wishlisted</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Account Details */}
//         <div className="flex-1">
//           <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <UserIcon className="h-5 w-5 text-emerald-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">Account Information</h3>
//             </div>

//             <div className="space-y-6">
//               {/* Name Field */}
//               <div>
//                 <label className="text-gray-700 font-medium mb-2 block text-sm">Full Name</label>
//                 <div className="relative">
//                   {editMode.name ? (
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={editedUser.name}
//                         onChange={(e) => handleInputChange('name', e.target.value)}
//                         className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
//                         autoFocus
//                       />
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => handleSave('name')}
//                           className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
//                         >
//                           <CheckIcon className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleCancel('name')}
//                           className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all duration-200"
//                         >
//                           <XMarkIcon className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={user.name}
//                         disabled
//                         className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 cursor-not-allowed"
//                       />
//                       <button
//                         onClick={() => handleEdit('name')}
//                         className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
//                       >
//                         <PencilSquareIcon className="h-4 w-4" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label className="text-gray-700 font-medium mb-2 block text-sm">Email Address</label>
//                 <div className="relative">
//                   {editMode.email ? (
//                     <div className="flex gap-2">
//                       <input
//                         type="email"
//                         value={editedUser.email}
//                         onChange={(e) => handleInputChange('email', e.target.value)}
//                         className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
//                         autoFocus
//                       />
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => handleSave('email')}
//                           className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
//                         >
//                           <CheckIcon className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleCancel('email')}
//                           className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all duration-200"
//                         >
//                           <XMarkIcon className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2">
//                       <input
//                         type="email"
//                         value={user.email}
//                         disabled
//                         className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 cursor-not-allowed"
//                       />
//                       <button
//                         onClick={() => handleEdit('email')}
//                         className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
//                       >
//                         <PencilSquareIcon className="h-4 w-4" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 gap-3 mt-6">
//                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                       <ShoppingBagIcon className="h-5 w-5 text-emerald-600" />
//                       <span className="text-gray-700 font-medium">Shopping Cart</span>
//                     </div>
//                     <span className="text-lg font-bold text-emerald-600">{user.cart?.length || 0}</span>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                       <HeartIcon className="h-5 w-5 text-rose-600" />
//                       <span className="text-gray-700 font-medium">Wishlist Items</span>
//                     </div>
//                     <span className="text-lg font-bold text-rose-600">{user.wishlist?.length || 0}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
//               >
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                   </svg>
//                   Sign Out
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState } from "react";
import { UserIcon, ShoppingBagIcon, HeartIcon, EnvelopeIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    cart: [],
    wishlist: [],
  });
  
  const [editMode, setEditMode] = useState({
    name: false,
    email: false
  });
  
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    // Get logged-in user from localStorage (assuming this is where you store login data)
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (loggedInUser) {
      // If you have a separate user data structure, use that
      const userData = JSON.parse(localStorage.getItem("user")) || loggedInUser;
      
      setUser({
        name: userData.name || loggedInUser.name || "User",
        email: userData.email || loggedInUser.email || "user@example.com",
        cart: userData.cart || loggedInUser.cart || [],
        wishlist: userData.wishlist || loggedInUser.wishlist || [],
      });
      
      setEditedUser({
        name: userData.name || loggedInUser.name || "User",
        email: userData.email || loggedInUser.email || "user@example.com"
      });
    } else {
      // If no user is logged in, redirect to login
      window.location.href = "/Login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
    window.location.href = "/Login";
  };

  const handleEdit = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSave = (field) => {
    const updatedUser = {
      ...user,
      [field]: editedUser[field]
    };
    
    // Update both states
    setUser(updatedUser);
    
    // Update localStorage for both loggedInUser and user data
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    localStorage.setItem("loggedInUser", JSON.stringify({
      ...loggedInUser,
      [field]: editedUser[field]
    }));
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleCancel = (field) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: user[field]
    }));
    
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          My Profile
        </h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        {/* User Profile Card */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Profile Overview */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <UserIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {user.name || "Loading..."}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <EnvelopeIcon className="h-4 w-4" />
                <p className="text-sm">{user.email || "Loading..."}</p>
              </div>
              
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6"></div>
            
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <UserIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Account Information</h3>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="text-gray-700 font-medium mb-2 block text-sm">Full Name</label>
                <div className="relative">
                  {editMode.name ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSave('name')}
                          className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCancel('name')}
                          className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={user.name}
                        disabled
                        className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 cursor-not-allowed"
                      />
                      <button
                        onClick={() => handleEdit('name')}
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="text-gray-700 font-medium mb-2 block text-sm">Email Address</label>
                <div className="relative">
                  {editMode.email ? (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSave('email')}
                          className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCancel('email')}
                          className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 cursor-not-allowed"
                      />
                      <button
                        onClick={() => handleEdit('email')}
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional User Info */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Account Status</h4>
                    <p className="text-xs text-blue-600">Active member since {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;