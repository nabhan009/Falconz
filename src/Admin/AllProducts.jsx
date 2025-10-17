import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import Sidebar from "./Sidebar";
import api from "../Api/Api";
import { toast } from "react-toastify";
import Loaders from "../../effects/Adminloader";
import ProductForm from "./ProductForm";
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  DollarSign,
  Tag,
  BarChart3,
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AllProducts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Show 8 products per page

  // Fetch products 
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Products");
      const pro = res.data.reverse()
      setProducts(pro);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products.");
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/Products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully!");
      
      // Reset to first page if current page becomes empty
      if (filteredProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    }
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("Please fill in required fields!");
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
      rating: Math.random() * 2 + 3, // Random rating between 3-5
      reviews: Math.floor(Math.random() * 100),
      inStock: true,
    };

    try {
      const res = await api.post("/Products", productToAdd);
      setProducts((prev) => [...prev, res.data]);
      toast.success("Product added successfully!");
      setShowAddForm(false);
      resetForm();
      // Go to last page to see the new product
      setCurrentPage(Math.ceil((filteredProducts.length + 1) / productsPerPage));
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("Failed to add product.");
    }
  };

  // Edit Product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    });
    setShowEditForm(true);
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("Please fill in required fields!");
      return;
    }

    try {
      const res = await api.put(`/Products/${editingProduct.id}`, {
        ...editingProduct,
        ...newProduct,
      });
      
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? res.data : p
      ));
      
      toast.success("Product updated successfully!");
      setShowEditForm(false);
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product.");
    }
  };

  const resetForm = () => {
    setNewProduct({ name: "", price: "", category: "", image: "", description: "" });
    setEditingProduct(null);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + parseFloat(product.price || 0), 0);
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNav setSidebarOpen={setSidebarOpen} />
          <div className="flex justify-center items-center h-64">
            <Loaders />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNav setSidebarOpen={setSidebarOpen} />

        {/* Products Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Product Management
                </h1>
                <p className="text-gray-600 mt-2">Manage your product inventory and listings</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 lg:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => {
                setShowAddForm(false);
                resetForm();
              }}
              title="Add New Product"
              submitText="Add Product"
              productData={newProduct}
              onProductDataChange={setNewProduct}
            />
          )}

          {/* Edit Product Form */}
          {showEditForm && (
            <ProductForm
              onSubmit={handleUpdateProduct}
              onCancel={() => {
                setShowEditForm(false);
                resetForm();
              }}
              title="Edit Product"
              submitText="Update Product"
              productData={newProduct}
              onProductDataChange={setNewProduct}
            />
          )}

          {/* Products Grid */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                Products ({filteredProducts.length})
                <span className="ml-2 text-sm text-gray-500">
                  (Showing {currentProducts.length} of {filteredProducts.length})
                </span>
              </h3>
            </div>

            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm || categoryFilter !== "all" 
                    ? "No products found matching your criteria." 
                    : "No products found."
                  }
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            product.inStock 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {product.category || "Uncategorized"}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="text-lg font-bold text-green-600">
                            ₹{parseFloat(product.price || 0).toLocaleString()}
                          </div>
                          {product.rating && (
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="text-yellow-400 mr-1">★</span>
                              {product.rating.toFixed(1)}
                              <span className="mx-1">•</span>
                              {product.reviews || 0} reviews
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-xl border border-gray-300 ${
                        currentPage === 1 
                          ? "text-gray-400 cursor-not-allowed" 
                          : "text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200"
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            currentPage === number
                              ? "bg-blue-500 text-white shadow-md"
                              : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-300"
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-xl border border-gray-300 ${
                        currentPage === totalPages 
                          ? "text-gray-400 cursor-not-allowed" 
                          : "text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200"
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllProducts;