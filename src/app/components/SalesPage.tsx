import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useBusiness } from "../context/BusinessContext";
import { useAuth } from "../context/AuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { UNIT_TYPES, formatQuantity } from "../utils/unitConversion";
import {
  Plus,
  Search,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  X,
  Minus,
  Trash2,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface Sale {
  id: string;
  businessId: string;
  locationId: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  notes: string;
  createdAt: string;
  createdBy: string;
}

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitType: string;
  price: number;
  lineTotal: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  unitType: string;
  stockByLocation: Record<string, number>;
}

export function SalesPage() {
  const { currentBusiness, currentLocation, locations } = useBusiness();
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "sales" | "new">("overview");

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6451509a`;

  const getAuthHeader = () => {
    const session = JSON.parse(localStorage.getItem("supabase.auth.token") || "{}");
    const accessToken = session?.currentSession?.access_token || publicAnonKey;
    return { Authorization: `Bearer ${accessToken}` };
  };

  const fetchSales = async () => {
    if (!currentBusiness) return;
    
    try {
      const response = await fetch(`${apiUrl}/sales/${currentBusiness.id}`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      setSales(data.sales || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to fetch sales");
    }
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
    }
  };

  const fetchMetrics = async () => {
    if (!currentBusiness) return;
    
    try {
      const response = await fetch(`${apiUrl}/sales/${currentBusiness.id}/metrics`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentBusiness) {
      fetchSales();
      fetchProducts();
      fetchMetrics();
    }
  }, [currentBusiness]);

  const handleCreateSale = async (saleData: Partial<Sale>) => {
    if (!currentBusiness) return;

    try {
      const response = await fetch(`${apiUrl}/sales/${currentBusiness.id}`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });
      const data = await response.json();
      
      if (data.sale) {
        toast.success("Sale recorded successfully! 🎉");
        fetchSales();
        fetchMetrics();
        fetchProducts(); // Refresh to get updated stock
        setShowNewSaleModal(false);
        setActiveTab("sales");
      } else {
        toast.error(data.error || "Failed to record sale");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      toast.error("Failed to record sale");
    }
  };

  if (!currentBusiness) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a business to manage sales</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sales Management</h1>
        <p className="text-gray-600">Track your sales and revenue</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "sales"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Sales History
        </button>
        <button
          onClick={() => {
            setActiveTab("new");
            setShowNewSaleModal(true);
          }}
          className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
        >
          <Plus size={20} />
          New Sale
        </button>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              className="bg-white rounded-xl p-6 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="text-blue-600" size={24} />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold">{metrics?.totalSales || 0}</div>
              <div className="text-sm text-gray-600">Sales</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="text-green-600" size={24} />
                <span className="text-xs text-gray-500">Revenue</span>
              </div>
              <div className="text-2xl font-bold">₦{(metrics?.totalRevenue || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-purple-600" size={24} />
                <span className="text-xs text-gray-500">Average</span>
              </div>
              <div className="text-2xl font-bold">₦{(metrics?.averageSaleValue || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Per Sale</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-orange-600" size={24} />
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <div className="text-2xl font-bold">
                {sales.filter(s => s.createdAt.startsWith(new Date().toISOString().split("T")[0])).length}
              </div>
              <div className="text-sm text-gray-600">Sales Today</div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sales Trend */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4">Sales Trend</h3>
              {metrics?.salesByDay && metrics.salesByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={metrics.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4">Top Products</h3>
              {metrics?.topProducts && metrics.topProducts.length > 0 ? (
                <div className="space-y-3">
                  {metrics.topProducts.slice(0, 5).map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-sm text-gray-500">
                          {product.quantity} units sold
                        </div>
                      </div>
                      <div className="font-semibold">₦{product.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg">Recent Sales</h3>
              <button
                onClick={() => setActiveTab("sales")}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              {sales.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart className="mx-auto mb-4" size={48} />
                  <p>No sales yet. Record your first sale!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">
                          {sale.customerName || "Walk-in Customer"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {sale.items.length} items • {new Date(sale.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₦{sale.total.toLocaleString()}</div>
                        <div className="text-sm text-gray-600 capitalize">{sale.paymentMethod}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "sales" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">All Sales</h3>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={20} />
                Export
              </button>
            </div>
          </div>

          {sales.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <ShoppingCart className="mx-auto mb-4" size={48} />
              <p className="mb-4">No sales recorded yet</p>
              <button
                onClick={() => {
                  setActiveTab("new");
                  setShowNewSaleModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
              >
                Record Your First Sale
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(sale.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(sale.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{sale.customerName || "Walk-in"}</div>
                        {sale.customerPhone && (
                          <div className="text-sm text-gray-500">{sale.customerPhone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        ₦{sale.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full capitalize">
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* New Sale Modal */}
      {showNewSaleModal && (
        <NewSaleModal
          products={products}
          currentLocation={currentLocation}
          onClose={() => {
            setShowNewSaleModal(false);
            setActiveTab("overview");
          }}
          onSave={handleCreateSale}
        />
      )}
    </div>
  );
}

// New Sale Modal Component
function NewSaleModal({
  products,
  currentLocation,
  onClose,
  onSave,
}: {
  products: Product[];
  currentLocation: any;
  onClose: () => void;
  onSave: (data: Partial<Sale>) => void;
}) {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const addItem = (product: Product) => {
    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      setItems(items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, lineTotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitType: product.unitType,
        price: product.price,
        lineTotal: product.price,
      }]);
    }
    setSearchQuery("");
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(items.filter(item => item.productId !== productId));
    } else {
      setItems(items.map(item =>
        item.productId === productId
          ? { ...item, quantity, lineTotal: quantity * item.price }
          : item
      ));
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    if (!currentLocation) {
      toast.error("Please select a location");
      return;
    }

    onSave({
      locationId: currentLocation.id,
      customerName,
      customerPhone,
      items,
      discount,
      tax: 0,
      paymentMethod,
      notes,
    });
  };

  const availableProducts = products.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt size={24} />
            New Sale
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Product Selection */}
            <div>
              <h3 className="font-semibold mb-3">Add Products</h3>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {availableProducts.map((product) => {
                  const stock = currentLocation ? product.stockByLocation?.[currentLocation.id] || 0 : 0;
                  const inCart = items.find(item => item.productId === product.id);
                  
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addItem(product)}
                      disabled={stock <= 0}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        stock <= 0
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : inCart
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">
                            Stock: {formatQuantity(stock, product.unitType)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₦{product.price.toLocaleString()}</div>
                          {inCart && (
                            <div className="text-xs text-indigo-600">
                              {inCart.quantity} in cart
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Cart & Details */}
            <div>
              <h3 className="font-semibold mb-3">Sale Details</h3>

              {/* Customer Info */}
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Customer Name (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Customer Phone (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              {/* Cart Items */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-[300px] overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ShoppingCart className="mx-auto mb-2" size={32} />
                    <p className="text-sm">Add products to start</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.productId} className="bg-white p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium flex-1">{item.productName}</div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                            <span className="text-sm text-gray-600 ml-2">
                              {UNIT_TYPES[item.unitType]?.symbol}
                            </span>
                          </div>
                          <div className="font-semibold">₦{item.lineTotal.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment & Total */}
              <div className="space-y-3">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Transfer</option>
                  <option value="credit">Credit</option>
                </select>

                <input
                  type="number"
                  placeholder="Discount (₦)"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={discount || ""}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />

                <textarea
                  placeholder="Notes (optional)"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-4">
                  <div className="flex justify-between mb-1">
                    <span>Subtotal:</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Discount:</span>
                      <span>-₦{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/30 my-2" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
