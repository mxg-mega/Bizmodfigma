import { motion } from "motion/react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { BiziAssistant } from "./BiziAssistant";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart,
  Settings,
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Plus,
} from "lucide-react";
import type { OnboardingData } from "./OnboardingFlow";

interface DashboardProps {
  userData: OnboardingData;
  userEmail: string;
}

export function Dashboard({ userData, userEmail }: DashboardProps) {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      label: "Total Sales",
      value: "₦0",
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Products",
      value: "0",
      change: "0 in stock",
      trend: "neutral",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Customers",
      value: "0",
      change: "+0 this week",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Revenue",
      value: "₦0",
      change: "This month",
      trend: "neutral",
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
    },
  ];

  const quickActions = [
    { id: "sale", label: "Record Sale", icon: ShoppingCart, color: "bg-green-500" },
    { id: "product", label: "Add Product", icon: Package, color: "bg-blue-500" },
    { id: "customer", label: "New Customer", icon: Users, color: "bg-purple-500" },
    { id: "report", label: "View Reports", icon: BarChart, color: "bg-orange-500" },
  ];

  const recentActivity = [
    {
      type: "welcome",
      message: "Welcome to BizMod! 🎉",
      description: "Your account has been set up successfully",
      time: "Just now",
      icon: "👋",
    },
    {
      type: "module",
      message: `${userData.selectedModules.length} modules activated`,
      description: userData.selectedModules.join(", "),
      time: "Just now",
      icon: "✓",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Business Name */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 200 200" fill="none">
                  <rect x="40" y="60" width="20" height="80" rx="4" fill="url(#dashB)" />
                  <rect x="60" y="60" width="35" height="30" rx="8" fill="url(#dashB2)" />
                  <rect x="60" y="110" width="40" height="30" rx="8" fill="url(#dashB3)" />
                  <rect x="120" y="60" width="18" height="80" rx="4" fill="url(#dashM)" />
                  <rect x="142" y="60" width="18" height="65" rx="4" fill="url(#dashM2)" />
                  <rect x="164" y="60" width="18" height="80" rx="4" fill="url(#dashM3)" />
                  <defs>
                    <linearGradient id="dashB" x1="40" y1="60" x2="60" y2="140">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="dashB2" x1="60" y1="60" x2="95" y2="90">
                      <stop stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#a78bfa" />
                    </linearGradient>
                    <linearGradient id="dashB3" x1="60" y1="110" x2="100" y2="140">
                      <stop stopColor="#7c3aed" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="dashM" x1="120" y1="60" x2="138" y2="140">
                      <stop stopColor="#06b6d4" />
                      <stop offset="1" stopColor="#0891b2" />
                    </linearGradient>
                    <linearGradient id="dashM2" x1="142" y1="60" x2="160" y2="125">
                      <stop stopColor="#14b8a6" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="dashM3" x1="164" y1="60" x2="182" y2="140">
                      <stop stopColor="#0891b2" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-bold hidden sm:block">BizMod</span>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-semibold">{userData.businessName}</span>
                {userData.hasMultipleBusinesses && <ChevronDown size={16} />}
              </button>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg max-w-md">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search... (or ask Bizi)"
                  className="bg-transparent border-none outline-none text-sm w-64"
                />
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userData.businessName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} className="hidden sm:block" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
          <nav className="p-4 space-y-2">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "sales", label: "Sales", icon: ShoppingCart, enabled: userData.selectedModules.includes("sales") },
              { id: "inventory", label: "Inventory", icon: Package, enabled: userData.selectedModules.includes("inventory") },
              { id: "customers", label: "Customers", icon: Users, enabled: userData.selectedModules.includes("crm") },
              { id: "analytics", label: "Analytics", icon: BarChart, enabled: userData.selectedModules.includes("analytics") },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isEnabled = item.enabled !== false;
              
              return (
                <button
                  key={item.id}
                  onClick={() => isEnabled && setActiveTab(item.id)}
                  disabled={!isEnabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? `${theme.primaryGradient} text-white`
                      : isEnabled
                      ? "hover:bg-gray-100 text-gray-700"
                      : "text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {!isEnabled && <span className="text-xs ml-auto">🔒</span>}
                </button>
              );
            })}
          </nav>

          {/* Free Tier Badge */}
          <div className="p-4 m-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-sm mb-1">Free Tier</h3>
            <p className="text-xs text-gray-600 mb-2">
              {userData.selectedModules.length <= 2 ? "You're on the free plan!" : "Upgrade available"}
            </p>
            <div className="space-y-1 text-xs text-gray-700">
              <div>📊 Sales: 0/60</div>
              <div>📦 Products: 0/50</div>
              <div>👥 Customers: 0/25</div>
            </div>
            <button className="mt-3 w-full px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Banner */}
          <motion.div
            className={`${theme.primaryGradient} text-white rounded-2xl p-6 mb-6`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome to {userData.businessName}! 🎉
                </h1>
                <p className="opacity-90">
                  Your business dashboard is ready. Let's make your first sale!
                </p>
              </div>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <Download size={20} />
              </button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => {
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
                      {stat.trend === "up" && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity & Getting Started */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-bold text-lg mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{activity.message}</h3>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-bold text-lg mb-4">Getting Started</h2>
              <div className="space-y-3">
                {[
                  { label: "Complete your profile", done: true },
                  { label: "Add your first product", done: false },
                  { label: "Make your first sale", done: false },
                  { label: "Invite team members", done: userData.teamMembers.length > 0 },
                  { label: "Explore Bizi AI assistant", done: false },
                ].map((task, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bizi Tip */}
          <motion.div
            className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-6"
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
                  Start by adding a few products to your inventory. This will help you track sales and manage stock levels effectively!
                  Click the "Add Product" button above or ask me "How do I add a product?"
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Bizi Assistant */}
      <BiziAssistant />
    </div>
  );
}
