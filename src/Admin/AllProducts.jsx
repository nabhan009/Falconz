
// import React, { useEffect, useState } from "react";
// import AdminNav from "./AdminNav";
// import Sidebar from "./Sidebar";
// import api from "../Api/Api";
// import { toast } from "react-toastify";
// import Loaders from "../../effects/Adminloader";

// // Modal Component (defined within same file)
// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold">{title}</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl transition"
//           >
//             ×
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// const AllProducts = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     price: "",
//     category: "",
//     image: "",
//     description: "",
//   });

//   //  Fetch products 
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/Products");
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       toast.error("Failed to fetch products.");
//     } finally {
//     //   setLoading(false);
//         setTimeout(() => setLoading(false), 1500);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   //  Delete Product
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     try {
//       await api.delete(`/Products/${id}`);
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//       toast.success("Product deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       toast.error("Failed to delete product.");
//     }
//   };

//   //  Add Product
//   const handleAddProduct = async (e) => {
//     e.preventDefault();

//     if (!newProduct.name || !newProduct.price || !newProduct.image) {
//       toast.error("Please fill in required fields!");
//       return;
//     }

//     const productToAdd = {
//       ...newProduct,
//       id: Date.now().toString(),
//       rating: 0,
//       reviews: 0,
//       inStock: true,
//     };

//     try {
//       const res = await api.post("/Products", productToAdd);
//       setProducts((prev) => [...prev, res.data]);
//       toast.success("Product added successfully!");
//       setShowAddForm(false);
//       setNewProduct({ name: "", price: "", category: "", image: "", description: "" });
//     } catch (err) {
//       console.error("Error adding product:", err);
//       toast.error("Failed to add product.");
//     }
//   };

//   //  Edit Product
//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setNewProduct({
//       name: product.name,
//       price: product.price,
//       category: product.category,
//       image: product.image,
//       description: product.description,
//     });
//     setShowEditForm(true);
//   };

//   //  Update Product
//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();

//     if (!newProduct.name || !newProduct.price || !newProduct.image) {
//       toast.error("Please fill in required fields!");
//       return;
//     }

//     try {
//       const res = await api.put(`/Products/${editingProduct.id}`, {
//         ...editingProduct,
//         ...newProduct,
//       });
      
//       setProducts(prev => prev.map(p => 
//         p.id === editingProduct.id ? res.data : p
//       ));
      
//       toast.success("Product updated successfully!");
//       setShowEditForm(false);
//       setEditingProduct(null);
//       setNewProduct({ name: "", price: "", category: "", image: "", description: "" });
//     } catch (err) {
//       console.error("Error updating product:", err);
//       toast.error("Failed to update product.");
//     }
//   };

//   const resetForm = () => {
//     setNewProduct({ name: "", price: "", category: "", image: "", description: "" });
//     setEditingProduct(null);
//   };

//   const ProductForm = ({ onSubmit, onCancel, title, submitText }) =>{
//     console.log("zxcvb");
    
//     return (
//     <Modal isOpen={true} onClose={onCancel} title={title}>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Product Name "
//           value={newProduct.name}
//           onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           value={newProduct.price}
//           onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//           required
//           min="0"
//           step="0.01"
//         />
//         <input
//           type="text"
//           placeholder="Category"
//           value={newProduct.category}
//           onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//         />
//         <input
//           type="text"
//           placeholder="Image URL "
//           value={newProduct.image}
//           onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <textarea
//           placeholder="Description"
//           value={newProduct.description}
//           onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//           rows="3"
//         ></textarea>

//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
//           >
//             {submitText}
//           </button>
//         </div>
//       </form>
//     </Modal>
//     )
  
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <AdminNav setSidebarOpen={setSidebarOpen} />
//             <div className="flex justify-center items-center h-64">
//               <div><Loaders/></div>
//             </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminNav setSidebarOpen={setSidebarOpen} />

//         {/* Products Content */}
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-semibold">📦 All Products</h2>
//             <button
//               onClick={() => setShowAddForm(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//             >
//               ➕ Add Product
//             </button>
//           </div>

//           {/* Add Product Form */}
//           {showAddForm && (
//             <ProductForm
//               onSubmit={handleAddProduct}
//               onCancel={() => {
//                 setShowAddForm(false);
//                 resetForm();
//               }}
//               title="Add New Product"
//               submitText="Add"
//             />
//           )}

//           {/* Edit Product Form */}
//           {showEditForm && (
//             <ProductForm
//               onSubmit={handleUpdateProduct}
//               onCancel={() => {
//                 setShowEditForm(false);
//                 resetForm();
//               }}
//               title="Edit Product"
//               submitText="Update"
//             />
//           )}

//           {/* Products Table */}
//           {products.length === 0 ? (
//             <p className="text-center text-gray-500 mt-10">No products found.</p>
//           ) : (
//             <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//               <table className="min-w-full border border-gray-200">
//                 <thead className="bg-blue-50">
//                   <tr>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700">Image</th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700">Category</th>
//                     <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
//                     <th className="py-3 px-4 text-center font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((p) => (
//                     <tr key={p.id} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4">
//                         <img
//                           src={p.image}
//                           alt={p.name}
//                           className="w-12 h-12 object-cover rounded-md"
//                         />
//                       </td>
//                       <td className="py-3 px-4 font-medium">{p.name}</td>
//                       <td className="py-3 px-4 capitalize text-gray-600">{p.category}</td>
//                       <td className="py-3 px-4 font-semibold">₹{p.price}</td>
//                       <td className="py-3 px-4 text-center space-x-2">
//                         <button
//                           onClick={() => handleEdit(p)}
//                           className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(p.id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AllProducts;






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
  ShoppingCart
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

  // Fetch products 
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Products");
      setProducts(res.data);
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

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                Products ({filteredProducts.length})
              </h3>
            </div>

            {filteredProducts.length === 0 ? (
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      {/* <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th> */}
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {product.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-green-600">
                            ₹{parseFloat(product.price || 0).toLocaleString()}
                          </div>
                        </td>
                        {/* <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            product.inStock 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td> */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllProducts;