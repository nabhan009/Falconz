import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../Api/Api";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/Products");
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto slide rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const featuredProducts = products.slice(0, 4);
  const categories = [...new Set(products.map((product) => product.category))]
    .filter((category) => category !== "meat")
    .slice(0, 6);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-green-700">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - No animation */}
      <section className="relative w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-1000"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {[
            {
              img: "https://i.pinimg.com/736x/c4/18/9f/c4189f29c87fbb9033d03b8107a5f201.jpg",
              text: "Fresh Fruits & Vegetables",
            },
            {
              img: "https://i.pinimg.com/1200x/90/14/69/901469628db3754828b0978a8dadb641.jpg",
              text: "Daily Essentials Delivered",
            },
            {
              img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80",
              text: "Organic & Healthy Choices",
            },
          ].map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={slide.img}
                alt={slide.text}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {slide.text}
                </h2>
                <Link
                  to="/Shop"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section with AOS */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-8 text-gray-800"
            data-aos="fade-down"
          >
            Shop by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-20">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/Shop"
                className="bg-green-50 hover:bg-green-100 rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group w-32"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {category === "fruits" && "🍎"}
                  {category === "vegetables" && "🥦"}
                  {category === "dairy" && "🥤"}
                  {category === "bakery" && "🍞"}
                  {!["fruits", "vegetables", "dairy", "bakery"].includes(category) && "🛒"}
                </div>
                <h3 className="font-semibold text-gray-800 capitalize">
                  {category === "dairy" ? "beverages" : category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with AOS */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", text: "Products" },
              { number: "10K+", text: "Happy Customers" },
              { number: "50+", text: "Local Farms" },
              { number: "24/7", text: "Support" }
            ].map((stat, index) => (
              <div 
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with AOS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl font-bold text-center mb-12 text-gray-800"
            data-aos="fade-down"
          >
            Why Choose FreshGroceries?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚚",
                title: "Free Delivery",
                description: "Free delivery on all orders over $50. Fast and reliable service.",
              },
              {
                icon: "🌱",
                title: "100% Organic",
                description: "Certified organic products from trusted local farms.",
              },
              {
                icon: "💳",
                title: "Secure Payment",
                description: "Multiple payment options with bank-level security.",
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <span className="text-green-500 font-semibold cursor-pointer" onClick={() => navigate('/About')}>
                  Learn more →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products with AOS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div 
            className="text-center mb-12"
            data-aos="fade-down"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and fresh products
            </p>
          </div>

          <div 
            onClick={() => navigate('./Shop')}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description || "Fresh and high-quality product"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div 
            className="text-center mt-12"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <Link
              to="/Shop"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-block shadow-lg hover:shadow-xl"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;