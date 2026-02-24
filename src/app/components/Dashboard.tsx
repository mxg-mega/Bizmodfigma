import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { useBusiness } from "../context/BusinessContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
} from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();
  const { currentBusiness } = useBusiness();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  });

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6451509a`;

  const getAuthHeader = () => {
    const session = JSON.parse(localStorage.getItem("supabase.auth.token") || "{}");
    const accessToken = session?.currentSession?.access_token || publicAnonKey;
    return { Authorization: `Bearer ${accessToken}` };
  };

  useEffect(() => {
    if (currentBusiness) {
      fetchStats();
    }
  }, [currentBusiness]);

  const fetchStats = async () => {
    if (!currentBusiness) return;

    try {
      // Fetch products
      const productsRes = await fetch(`${apiUrl}/products/${currentBusiness.id}`, {
        headers: getAuthHeader(),
      });
      const productsData = await productsRes.json();
      const products = productsData.products || [];

      // Fetch sales metrics
      const metricsRes = await fetch(`${apiUrl}/sales/${currentBusiness.id}/metrics`, {
        headers: getAuthHeader(),
      });
      const metricsData = await metricsRes.json();

      // Calculate stats
      const lowStock = products.filter((p: any) => {
        const totalStock = Object.values(p.stockByLocation || {}).reduce((sum: number, qty: any) => sum + qty, 0);
        return totalStock <= p.minStockLevel;
      }).length;

      setStats({
        totalProducts: products.length,
        totalSales: metricsData.totalSales || 0,
        totalRevenue: metricsData.totalRevenue || 0,
        lowStockProducts: lowStock,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const quickActions = [
    { 
      id: "sale", 
      label: "Record Sale", 
      icon: ShoppingCart, 
      color: "bg-green-500",
      onClick: () => navigate("/dashboard/sales")
    },
    { 
      id: "product", 
      label: "Add Product", 
      icon: Package, 
      color: "bg-blue-500",
      onClick: () => navigate("/dashboard/inventory")
    },
    { 
      id: "customer", 
      label: "New Customer", 
      icon: Users, 
      color: "bg-purple-500",
      onClick: () => navigate("/dashboard/customers")
    },
  ];

  const dashboardStats = [
    {
      label: "Total Sales",
      value: stats.totalSales,
      change: "+0%",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      change: "All time",
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Products",
      value: stats.totalProducts,
      change: `${stats.lowStockProducts} low stock`,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div
        className={`${theme.primaryGradient} text-white rounded-2xl p-6 mb-6`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome to {currentBusiness?.name}! 🎉
            </h1>
            <p className="opacity-90">
              Your business dashboard is ready. Let's make your first sale!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all text-left"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="font-semibold">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-4">Business Overview</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {dashboardStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="font-bold text-lg mb-4">Getting Started</h2>
        <div className="space-y-3">
          {[
            { label: "Complete your profile", done: true },
            { label: "Add your first product", done: stats.totalProducts > 0, action: () => navigate("/dashboard/inventory") },
            { label: "Make your first sale", done: stats.totalSales > 0, action: () => navigate("/dashboard/sales") },
            { label: "Explore Bizi AI assistant", done: false },
          ].map((task, i) => (
            <motion.button
              key={i}
              onClick={task.action}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  task.done ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {task.done ? (
                  <span className="text-green-600 text-sm">✓</span>
                ) : (
                  <span className="text-gray-400 text-sm">{i + 1}</span>
                )}
              </div>
              <span className={`flex-1 ${task.done ? "line-through text-gray-500" : "text-gray-700"}`}>
                {task.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bizi Tip */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="18" fill="white" opacity="0.95" />
              <circle cx="23" cy="24" r="2" fill="#6366f1" />
              <circle cx="33" cy="24" r="2" fill="#6366f1" />
              <path d="M 21 30 Q 28 34 35 30" stroke="#6366f1" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold mb-2">💡 Bizi's Tip</h3>
            <p className="opacity-90">
              {stats.totalProducts === 0
                ? "Start by adding a few products to your inventory. This will help you track sales and manage stock levels effectively!"
                : stats.totalSales === 0
                ? "Great! You've added products. Now try recording your first sale to see how the system works."
                : "You're doing great! Keep tracking your sales and inventory to get valuable insights about your business."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
