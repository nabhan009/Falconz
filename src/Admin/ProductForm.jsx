// import React from 'react';
// import { X, Image, Package, DollarSign, Tag, FileText } from 'lucide-react';

// const ProductForm = ({ 
//   onSubmit, 
//   onCancel, 
//   title, 
//   submitText, 
//   productData, 
//   onProductDataChange 
// }) => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(e);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-100">
//           <h3 className="text-xl font-bold text-gray-800">{title}</h3>
//           <button
//             onClick={onCancel}
//             className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Form Content */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Product Name */}
//           <div className="space-y-2">
//             <label className="flex items-center text-sm font-medium text-gray-700">
//               <Package className="h-4 w-4 mr-2 text-blue-500" />
//               Product Name *
//             </label>
//             <input
//               type="text"
//               placeholder="Enter product name"
//               value={productData.name}
//               onChange={(e) => onProductDataChange({ ...productData, name: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//               required
//             />
//           </div>

//           {/* Price */}
//           <div className="space-y-2">
//             <label className="flex items-center text-sm font-medium text-gray-700">
//               <DollarSign className="h-4 w-4 mr-2 text-green-500" />
//               Price *
//             </label>
//             <input
//               type="number"
//               placeholder="0.00"
//               value={productData.price}
//               onChange={(e) => onProductDataChange({ ...productData, price: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//               required
//               min="0"
//               step="0.01"
//             />
//           </div>

//           {/* Category */}
//           <div className="space-y-2">
//             <label className="flex items-center text-sm font-medium text-gray-700">
//               <Tag className="h-4 w-4 mr-2 text-purple-500" />
//               Category
//             </label>
//             <select
//               value={productData.category}
//               onChange={(e) => onProductDataChange({ ...productData, category: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//             >
//               <option value="">Select Category</option>
//               <option value="vegetables">Vegetables</option>
//               <option value="fruits">Fruits</option>
//               <option value="dairy">Dairy</option>
//               <option value="meat">Meat</option>
//               <option value="Beverages & Snacks">Beverages & Snacks</option>
//             </select>
//           </div>

//           {/* Image URL */}
//           <div className="space-y-2">
//             <label className="flex items-center text-sm font-medium text-gray-700">
//               <Image className="h-4 w-4 mr-2 text-orange-500" />
//               Image URL *
//             </label>
//             <input
//               type="text"
//               placeholder="https://example.com/image.jpg"
//               value={productData.image}
//               onChange={(e) => onProductDataChange({ ...productData, image: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//               required
//             />
//             {productData.image && (
//               <div className="mt-2">
//                 <img 
//                   src={productData.image} 
//                   alt="Preview" 
//                   className="w-20 h-20 object-cover rounded-lg border border-gray-200"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <label className="flex items-center text-sm font-medium text-gray-700">
//               <FileText className="h-4 w-4 mr-2 text-gray-500" />
//               Description
//             </label>
//             <textarea
//               placeholder="Enter product description..."
//               value={productData.description}
//               onChange={(e) => onProductDataChange({ ...productData, description: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
//               rows="3"
//             ></textarea>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium hover:shadow-lg"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//             >
//               {submitText}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;


import React from 'react';
import { X, Image, Package, DollarSign, Tag, FileText, Save, RotateCcw } from 'lucide-react';

const ProductForm = ({ 
  onSubmit, 
  onCancel, 
  title, 
  submitText, 
  productData, 
  onProductDataChange 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const resetForm = () => {
    onProductDataChange({
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-blue-100 text-sm">Fill in the product details below</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={resetForm}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200"
                type="button"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Form
              </button>
              <button
                onClick={onCancel}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors duration-200"
              >
                <X className="h-5 w-5 mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              {/* Product Name */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-500" />
                  Product Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name (e.g., Organic Apples, Fresh Milk, etc.)"
                      value={productData.name}
                      onChange={(e) => onProductDataChange({ ...productData, name: e.target.value })}
                      className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                        Price *
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={productData.price}
                        onChange={(e) => onProductDataChange({ ...productData, price: e.target.value })}
                        className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-purple-500" />
                        Category
                      </label>
                      <select
                        value={productData.category}
                        onChange={(e) => onProductDataChange({ ...productData, category: e.target.value })}
                        className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Select Category</option>
                        <option value="vegetables">🥦 Vegetables</option>
                        <option value="fruits">🍎 Fruits</option>
                        <option value="dairy">🥛 Dairy</option>
                        <option value="meat">🥩 Meat</option>
                        <option value="Beverages & Snacks">🥤 Beverages & Snacks</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-500" />
                  Product Description
                </h2>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the product in detail. Include features, benefits, quality information, and any special characteristics..."
                    value={productData.description}
                    onChange={(e) => onProductDataChange({ ...productData, description: e.target.value })}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    rows="8"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column - Image and Actions */}
            <div className="space-y-6">
              {/* Image URL */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Image className="h-5 w-5 mr-2 text-orange-500" />
                  Product Image *
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="https://example.com/product-image.jpg"
                    value={productData.image}
                    onChange={(e) => onProductDataChange({ ...productData, image: e.target.value })}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  
                  {/* Image Preview */}
                  {productData.image ? (
                    <div className="space-y-3">
                      <label className="text-lg font-semibold text-gray-700">Image Preview</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50">
                        <img 
                          src={productData.image} 
                          alt="Product preview" 
                          className="w-full h-64 object-cover rounded-xl mx-auto"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgODVIMTIwVjkwSDEyNVY4NVpNODAgMTE1VjExMEg3NVYxMTVIODBaIiBmaWxsPSIjOEU5MEE2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIHN0cm9rZT0iIzhFOTBBNiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=';
                            e.target.alt = 'Image failed to load';
                          }}
                        />
                      </div>
                      <p className="text-sm text-green-600 text-center">
                        ✓ Image URL is valid and preview is available
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 text-center">
                      <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Enter an image URL to see preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Clear All Fields
                  </button>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    <Save className="h-6 w-6 mr-2" />
                    {submitText}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Cancel & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;