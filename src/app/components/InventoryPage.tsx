import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useBusiness } from "../context/BusinessContext";
import { useAuth } from "../context/AuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { UNIT_TYPES, getUnitsInCategory, formatQuantity, convertUnit } from "../utils/unitConversion";
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
  AlertCircle,
  TrendingDown,
  BarChart3,
  Download,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unitType: string;
  price: number;
  costPrice: number;
  trackInventory: boolean;
  stockByLocation: Record<string, number>;
  minStockLevel: number;
  maxStockLevel: number | null;
  createdAt: string;
  updatedAt: string;
}

export function InventoryPage() {
  const { currentBusiness, currentLocation, locations } = useBusiness();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6451509a`;

  const getAuthHeader = () => {
    const session = JSON.parse(localStorage.getItem("supabase.auth.token") || "{}");
    const accessToken = session?.currentSession?.access_token || publicAnonKey;
    return { Authorization: `Bearer ${accessToken}` };
  };

  const fetchProducts = async () => {
    if (!currentBusiness) return;
    
    try {
      const response = await fetch(`${apiUrl}/products/${currentBusiness.id}`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentBusiness]);

  const handleCreateProduct = async (productData: Partial<Product>) => {
    if (!currentBusiness) return;

    try {
      const response = await fetch(`${apiUrl}/products/${currentBusiness.id}`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      
      if (data.product) {
        toast.success("Product created successfully");
        fetchProducts();
        setShowAddModal(false);
        setEditingProduct(null);
      } else {
        toast.error(data.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  };

  const handleUpdateProduct = async (productId: string, productData: Partial<Product>) => {
    if (!currentBusiness) return;

    try {
      const response = await fetch(`${apiUrl}/products/${currentBusiness.id}/${productId}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      
      if (data.product) {
        toast.success("Product updated successfully");
        fetchProducts();
        setShowAddModal(false);
        setEditingProduct(null);
      } else {
        toast.error(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!currentBusiness || !confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${apiUrl}/products/${currentBusiness.id}/${productId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleUpdateStock = async (productId: string, locationId: string, adjustment: number, reason: string) => {
    if (!currentBusiness) return;

    try {
      const response = await fetch(`${apiUrl}/products/${currentBusiness.id}/${productId}/stock`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locationId, adjustment, reason }),
      });
      const data = await response.json();
      
      if (data.product) {
        toast.success("Stock updated successfully");
        fetchProducts();
        setShowStockModal(false);
        setSelectedProduct(null);
      } else {
        toast.error(data.error || "Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTotalStock = (product: Product) => {
    return Object.values(product.stockByLocation || {}).reduce((sum, qty) => sum + qty, 0);
  };

  const getLocationStock = (product: Product, locationId: string) => {
    return product.stockByLocation?.[locationId] || 0;
  };

  const isLowStock = (product: Product) => {
    return getTotalStock(product) <= product.minStockLevel;
  };

  if (!currentBusiness) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a business to manage inventory</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage your products and stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-blue-600" size={24} />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold">{products.length}</div>
          <div className="text-sm text-gray-600">Products</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-orange-600" size={24} />
            <span className="text-xs text-gray-500">Alert</span>
          </div>
          <div className="text-2xl font-bold">{products.filter(isLowStock).length}</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="text-green-600" size={24} />
            <span className="text-xs text-gray-500">Value</span>
          </div>
          <div className="text-2xl font-bold">
            ₦{products.reduce((sum, p) => sum + (getTotalStock(p) * p.price), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="text-purple-600" size={24} />
            <span className="text-xs text-gray-500">Cost</span>
          </div>
          <div className="text-2xl font-bold">
            ₦{products.reduce((sum, p) => sum + (getTotalStock(p) * p.costPrice), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-initial relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload size={20} />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              onClick={() => {
                setEditingProduct(null);
                setShowAddModal(true);
              }}
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first product</p>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const totalStock = getTotalStock(product);
                  const lowStock = isLowStock(product);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500">{product.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.sku || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStockModal(true);
                          }}
                          className={`font-medium ${lowStock ? "text-orange-600" : "text-gray-900"} hover:underline`}
                        >
                          {formatQuantity(totalStock, product.unitType)}
                          {lowStock && <AlertCircle className="inline ml-1" size={14} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{(totalStock * product.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={(data) => {
            if (editingProduct) {
              handleUpdateProduct(editingProduct.id, data);
            } else {
              handleCreateProduct(data);
            }
          }}
        />
      )}

      {/* Stock Management Modal */}
      {showStockModal && selectedProduct && (
        <StockModal
          product={selectedProduct}
          locations={locations}
          onClose={() => {
            setShowStockModal(false);
            setSelectedProduct(null);
          }}
          onUpdate={(locationId, adjustment, reason) => {
            handleUpdateStock(selectedProduct.id, locationId, adjustment, reason);
          }}
        />
      )}
    </div>
  );
}

// Product Modal Component
function ProductModal({ 
  product, 
  onClose, 
  onSave 
}: { 
  product: Product | null; 
  onClose: () => void; 
  onSave: (data: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    category: product?.category || "General",
    unitType: product?.unitType || "piece",
    price: product?.price || 0,
    costPrice: product?.costPrice || 0,
    trackInventory: product?.trackInventory !== false,
    minStockLevel: product?.minStockLevel || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const unitCategories = {
    piece: getUnitsInCategory("piece"),
    weight: getUnitsInCategory("weight"),
    volume: getUnitsInCategory("volume"),
    length: getUnitsInCategory("length"),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit of Measure *
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.unitType}
              onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
            >
              <optgroup label="Piece/Count">
                {unitCategories.piece.map(unit => (
                  <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="Weight">
                {unitCategories.weight.map(unit => (
                  <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="Volume">
                {unitCategories.volume.map(unit => (
                  <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>
                ))}
              </optgroup>
              <optgroup label="Length">
                {unitCategories.length.map(unit => (
                  <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price (₦) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price (₦)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.trackInventory}
                onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Track Inventory</span>
            </label>
          </div>

          {formData.trackInventory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Level
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) })}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              {product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Stock Modal Component
function StockModal({
  product,
  locations,
  onClose,
  onUpdate,
}: {
  product: Product;
  locations: any[];
  onClose: () => void;
  onUpdate: (locationId: string, adjustment: number, reason: string) => void;
}) {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.id || "");
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(selectedLocation, adjustment, reason);
  };

  const currentStock = product.stockByLocation?.[selectedLocation] || 0;
  const newStock = currentStock + adjustment;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Adjust Stock</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="font-semibold text-lg mb-1">{product.name}</div>
            <div className="text-sm text-gray-600">
              {formatQuantity(Object.values(product.stockByLocation || {}).reduce((sum, qty) => sum + qty, 0), product.unitType)} total
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - Current: {formatQuantity(product.stockByLocation?.[location.id] || 0, product.unitType)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment ({UNIT_TYPES[product.unitType]?.symbol})
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={adjustment}
              onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
              placeholder="Enter positive to add, negative to subtract"
            />
            <div className="mt-2 text-sm text-gray-600">
              Current: {formatQuantity(currentStock, product.unitType)} → New: {formatQuantity(newStock, product.unitType)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Restock, Damage, Correction"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              Update Stock
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
