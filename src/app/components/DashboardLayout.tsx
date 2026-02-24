import { Outlet, useNavigate, useLocation, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useBusiness } from "../context/BusinessContext";
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
  LogOut,
  Building2,
  MapPin,
  Plus,
} from "lucide-react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();
  const { signOut, user, loading: authLoading } = useAuth();
  const { currentBusiness, businesses, locations, currentLocation, setCurrentBusiness, setCurrentLocation, loading: businessLoading } = useBusiness();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowBusinessMenu(false);
      setShowLocationMenu(false);
    };

    if (showUserMenu || showBusinessMenu || showLocationMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu, showBusinessMenu, showLocationMenu]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to business setup if user has no businesses (after loading is complete)
  if (!businessLoading && businesses.length === 0) {
    return <Navigate to="/business-setup" replace />;
  }

  // Show loading state while fetching businesses
  if (businessLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your businesses...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "sales", label: "Sales", icon: ShoppingCart, path: "/dashboard/sales" },
    { id: "inventory", label: "Inventory", icon: Package, path: "/dashboard/inventory" },
    { id: "customers", label: "Customers", icon: Users, path: "/dashboard/customers" },
    { id: "analytics", label: "Analytics", icon: BarChart, path: "/dashboard/analytics" },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Business Selector */}
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
              
              {/* Business Selector */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBusinessMenu(!showBusinessMenu);
                  }}
                >
                  <Building2 size={16} />
                  <span className="font-semibold">{currentBusiness?.name || "Select Business"}</span>
                  <ChevronDown size={16} />
                </button>
                
                {showBusinessMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50">
                    {businesses.map((business) => (
                      <button
                        key={business.id}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          business.id === currentBusiness?.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => {
                          setCurrentBusiness(business);
                          setShowBusinessMenu(false);
                        }}
                      >
                        {business.name}
                      </button>
                    ))}
                    {businesses.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-indigo-600 font-medium"
                          onClick={() => {
                            navigate("/business-setup");
                            setShowBusinessMenu(false);
                          }}
                        >
                          <Plus size={16} />
                          Create New Business
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Location Selector */}
              {locations.length > 0 && (
                <>
                  <div className="h-8 w-px bg-gray-300 hidden md:block" />
                  <div className="relative hidden md:block">
                    <button 
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLocationMenu(!showLocationMenu);
                      }}
                    >
                      <MapPin size={16} />
                      <span className="text-sm">{currentLocation?.name || "Select Location"}</span>
                      {locations.length > 1 && <ChevronDown size={16} />}
                    </button>
                    
                    {showLocationMenu && locations.length > 1 && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50">
                        {locations.map((location) => (
                          <button
                            key={location.id}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                              location.id === currentLocation?.id ? "bg-gray-100" : ""
                            }`}
                            onClick={() => {
                              setCurrentLocation(location);
                              setShowLocationMenu(false);
                            }}
                          >
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-gray-500">{location.city}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
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

              <div className="relative">
                <button
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown size={16} className="hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                    <div className="p-4">
                      <p className="font-semibold text-gray-700">{user?.email}</p>
                      <p className="text-xs text-gray-500">{currentBusiness?.name}</p>
                    </div>
                    <div className="border-t border-gray-200" />
                    <div className="p-2">
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={handleSignOut}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? `${theme.primaryGradient} text-white`
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Free Tier Badge */}
          <div className="p-4 m-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-sm mb-1">Free Tier</h3>
            <p className="text-xs text-gray-600 mb-2">Track your usage</p>
            <div className="space-y-1 text-xs text-gray-700">
              <div>📊 Sales: 0/60</div>
              <div>📦 Products: 0/50</div>
              <div>👥 Customers: 0/25</div>
            </div>
            <button 
              className="mt-3 w-full px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
              onClick={() => navigate("/calculator")}
            >
              Upgrade Plan
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Bizi Assistant */}
      <BiziAssistant />
    </div>
  );
}