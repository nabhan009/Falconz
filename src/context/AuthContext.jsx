import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
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

  // ✅ Login function
  const login = async (email, password) => {
    const { data } = await api.get("/users", { params: { email } });
    const user = data[0];

    if (!user) throw new Error("User not found");
    if (user.password !== password) throw new Error("Invalid password");
    if (user.isBlock) throw new Error("Account is blocked");

    const updatedUser = { ...user, isLoggedIn: true };
    await api.patch(`/users/${user.id}`, updatedUser);

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    localStorage.setItem("userId", updatedUser.id);

    setUser(updatedUser);
    return updatedUser;
  };

  // ✅ Logout function
  const logout = async () => {
    if (user?.id) {
      await api.patch(`/users/${user.id}`, { isLoggedIn: false });
    }
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userId");
    setUser(null);
    setProfileOpen(false);
  };

  // ✅ Update user for cart/wishlist
  const updateUser = (updatedUserData) => {
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  // ✅ Counts
  const wishlistCount = user?.wishlist?.length || 0;
  const cartCount = user?.cart?.length || 0;

  const value = {
    user,
    login,
    logout,
    updateUser,
    wishlistCount,
    cartCount,
    profileOpen,
    setProfileOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
