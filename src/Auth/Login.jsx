import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
 
    try {
      // Use the auth context login function
      await login(email, password);

      setError("");
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed. Please check your credentials.");
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

      {/* ✅ Success Popup (Top-Right Corner) */}
      {success && (
        <div className="fixed top-5 right-5 z-50">
          <div className="bg-white text-green-700 font-semibold px-6 py-4 rounded-xl shadow-lg border border-green-600 animate-bounce">
            ✅ Login Successful! Redirecting...
          </div>
        </div>
      )}

      <div
        className="relative w-full max-w-md p-10 rounded-3xl shadow-xl backdrop-blur-lg border border-white/30 transition-all duration-300"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
          Login
        </h2>

        {/* Fixed error area to avoid zoom */}
        <div className="min-h-[28px] mb-4">
          {error && (
            <p className="text-center font-medium text-red-600 bg-white/90 py-2 px-4 rounded-lg">{error}</p>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                border: "1px solid #436850",
                color: "#12372A",
              }}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#436850] transition duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                border: "1px solid #436850",
                color: "#12372A",
              }}
              disabled={loading}
            />
          </div>

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
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-medium text-white">
          Don't have an account?{" "}
          <a href="/signup" className="font-semibold text-white underline hover:no-underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;