import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { appCache } from "../utils/localCache";
import { Trash2, Database, HardDrive, Clock } from "lucide-react";

export function SettingsPage() {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();
  const [cacheStats, setCacheStats] = useState(appCache.getStats());
  const [message, setMessage] = useState("");

  const handleClearCache = () => {
    appCache.clear();
    setCacheStats(appCache.getStats());
    setMessage("Cache cleared successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleClearExpired = () => {
    appCache.clearExpired();
    setCacheStats(appCache.getStats());
    setMessage("Expired cache items cleared!");
    setTimeout(() => setMessage(""), 3000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your app preferences and data</p>
      </div>

      {/* Cache Management Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className={theme.accentColor} />
          Cache Management
        </h2>
        
        <p className="text-gray-600 mb-6">
          BizMod caches data locally to improve performance and enable offline access. 
          You can clear this data at any time.
        </p>

        {/* Cache Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive size={20} className="text-indigo-600" />
              <span className="text-sm font-medium text-gray-600">Total Items</span>
            </div>
            <p className="text-2xl font-bold">{cacheStats.totalItems}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Expired Items</span>
            </div>
            <p className="text-2xl font-bold">{cacheStats.expiredItems}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database size={20} className="text-green-600" />
              <span className="text-sm font-medium text-gray-600">Storage Used</span>
            </div>
            <p className="text-2xl font-bold">{formatBytes(cacheStats.totalSize)}</p>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {message}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClearExpired}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Clock size={18} />
            Clear Expired Items
          </button>

          <button
            onClick={handleClearCache}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            Clear All Cache
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>💡 <strong>Tip:</strong> Cache is automatically cleared when you sign out.</p>
          <p>💡 Expired items are automatically cleaned up every 5 minutes.</p>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">More Settings Coming Soon</h2>
        <p className="text-gray-600">
          We're working on adding more settings including notifications, 
          data export, team management, and more.
        </p>
      </div>
    </div>
  );
}