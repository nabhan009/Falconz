import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount - FIXED KEY
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser"); // Changed from "user" to "loggedInUser"
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("loggedInUser");
      }
    }
    setLoading(false);
  }, []);

  // Login function - UPDATED
  const login = async (email, password) => {
    const { data } = await api.get("/users", { params: { email } });
    const user = data[0];

    if (!user) throw new Error("User not found");
    if (user.password !== password) throw new Error("Invalid password");
    if (user.isBlock) throw new Error("Account is blocked");

    const updatedUser = { ...user, isLoggedIn: true };
    await api.patch(`/users/${user.id}`, updatedUser);

    // Save locally with consistent key
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser)); // Changed to loggedInUser
    localStorage.setItem("userId", updatedUser.id);

    setUser(updatedUser);
    return updatedUser;
  };

  // Logout function - UPDATED
  const logout = async () => {
    if (user?.id) {
      await api.patch(`/users/${user.id}`, { isLoggedIn: false });
    }
    localStorage.removeItem("loggedInUser"); // Changed to loggedInUser
    localStorage.removeItem("userId");
    setUser(null);
  };

  // NEW: Update user function for cart/wishlist updates
  const updateUser = (updatedUserData) => {
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser, // Added this function
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for convenience
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};