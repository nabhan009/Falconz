import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/Api";
import { toast } from "react-toastify";

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

  // ✅ Login function (no navigation here)
  const login = async (email, password) => {
    const { data } = await api.get("/users", { params: { email } });
    const foundUser = data[0];

    if (!foundUser) throw new Error("User not found");
    if (foundUser.password !== password) throw new Error("Invalid password");
    if (foundUser.isBlock) throw new Error("Account is blocked");

    const updatedUser = { ...foundUser, isLoggedIn: true };
    await api.patch(`/users/${foundUser.id}`, updatedUser);

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    localStorage.setItem("userId", updatedUser.id);
    setUser(updatedUser);
    toast.success("Login successful!");

    return updatedUser; // ✅ return the logged-in user
  };

  // Logout function
  const logout = async () => {
    if (user?.id) {
      await api.patch(`/users/${user.id}`, { isLoggedIn: false });
    }
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userId");
    setUser(null);
    toast.warning("Logout successful");
  };

  // Update user for wishlist/cart
  const updateUser = (updatedUserData) => {
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  const wishlistCount = user?.wishlist?.length || 0;
  const cartCount = user?.cart?.length || 0;

  return (
    <AuthContext.Provider
      value={{
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
