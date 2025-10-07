import React, { useState } from "react";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const { data: existingUsers } = await api.get(`/users?email=${email}`);
      if (existingUsers.length > 0) {
        setError("Email already registered!");
        setLoading(false);
        return;
      }

      // Create new user with empty cart & wishlist
      const { data: newUser } = await api.post("/users", {
        name,
        email,
        password,
        cart: [],
        wishlist: [],
        isLoggedIn: true,
        isBlock: false
      });

      if (!newUser.id) {
        throw new Error("User creation failed: no ID returned");
      }

      // Automatically log in the user after signup
      await login(email, password);

      setError("");
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        setSuccess(false);
        navigate("/"); // go to Home page
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/c4/7d/a9/c47da90759cf4cbfe08504655ceb9a66.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Success Popup */}
      {success && (
        <div className="fixed top-5 right-5 z-50">
          <div className="bg-white text-green-700 font-semibold px-6 py-4 rounded-xl shadow-lg border border-green-600 animate-bounce">
            ✅ Sign Up Successful! Redirecting...
          </div>
        </div>
      )}

      {/* Main Card */}
      <div
        className="relative w-full max-w-md p-10 rounded-3xl shadow-xl backdrop-blur-lg border border-white/30 transition-all duration-300"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
          Sign Up
        </h2>

        {/* Fixed error height */}
        <div className="min-h-[28px] mb-4">
          {error && (
            <p className="text-center font-medium text-red-600 bg-white/90 py-2 px-4 rounded-lg">{error}</p>
          )}
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium text-white">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Full Name"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#436850] transition duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                border: "1px solid #436850",
                color: "#12372A",
              }}
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#436850] transition duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                border: "1px solid #436850",
                color: "#12372A",
              }}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password (min. 6 characters)"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#436850] transition duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                border: "1px solid #436850",
                color: "#12372A",
              }}
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-medium text-white">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#436850] transition duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                border: "1px solid #436850",
                color: "#12372A",
              }}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#436850", color: "white" }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#12372A")}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#436850")}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="mt-6 text-center font-medium text-white">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-white underline hover:no-underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;