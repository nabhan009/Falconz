
import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import Sidebar from "./Sidebar";
import api from "../Api/Api";
import { toast } from "react-toastify";

// Modal Component (defined within same file)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AllProducts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Delete Product
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

  // ✅ Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("Please fill in required fields!");
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
      rating: 0,
      reviews: 0,
      inStock: true,
    };

    try {
      const res = await api.post("/Products", productToAdd);
      setProducts((prev) => [...prev, res.data]);
      toast.success("Product added successfully!");
      setShowAddForm(false);
      setNewProduct({ name: "", price: "", category: "", image: "", description: "" });
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("Failed to add product.");
    }
  };

  // ✅ Edit Product
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

  // ✅ Update Product
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
      setNewProduct({ name: "", price: "", category: "", image: "", description: "" });
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product.");
    }
  };

  const resetForm = () => {
    setNewProduct({ name: "", price: "", category: "", image: "", description: "" });
    setEditingProduct(null);
  };

  const ProductForm = ({ onSubmit, onCancel, title, submitText }) => (
    <Modal isOpen={true} onClose={onCancel} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name *"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Price *"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Image URL *"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNav setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading products...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNav setSidebarOpen={setSidebarOpen} />

        {/* Products Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">📦 All Products</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              ➕ Add Product
            </button>
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
              submitText="Add"
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
              submitText="Update"
            />
          )}

          {/* Products Table */}
          {products.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No products found.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Image</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Category</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4 capitalize text-gray-600">{p.category}</td>
                      <td className="py-3 px-4 font-semibold">₹{p.price}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllProducts;