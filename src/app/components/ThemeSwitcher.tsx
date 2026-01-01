import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Settings, Palette, X } from "lucide-react";
import { useTheme, DesignTheme, ColorScheme } from "../context/ThemeContext";

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { designTheme, colorScheme, setDesignTheme, setColorScheme } = useTheme();

  const designThemes: { value: DesignTheme; label: string; description: string }[] = [
    { value: "modern", label: "Modern", description: "Clean & contemporary" },
    { value: "futuristic", label: "Futuristic", description: "Sci-fi inspired" },
    { value: "minimalist", label: "Minimalist", description: "Simple & elegant" },
    { value: "professional", label: "Professional", description: "Business-focused" },
    { value: "vibrant", label: "Vibrant", description: "Bold & energetic" },
  ];

  const colorSchemes: { value: ColorScheme; label: string; colors: string[] }[] = [
    { value: "indigo-cyan", label: "Indigo Cyan", colors: ["#6366f1", "#06b6d4"] },
    { value: "purple-pink", label: "Purple Pink", colors: ["#9333ea", "#ec4899"] },
    { value: "green-teal", label: "Green Teal", colors: ["#16a34a", "#14b8a6"] },
    { value: "orange-red", label: "Orange Red", colors: ["#ea580c", "#dc2626"] },
    { value: "blue-violet", label: "Blue Violet", colors: ["#2563eb", "#7c3aed"] },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <Settings className="w-6 h-6 animate-spin-slow" style={{ animation: "spin 8s linear infinite" }} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold">Customize Theme</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Design Theme Selection */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-3 text-gray-700">Design Style</h3>
                  <div className="space-y-3">
                    {designThemes.map((theme) => (
                      <motion.button
                        key={theme.value}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          designTheme === theme.value
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setDesignTheme(theme.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-semibold">{theme.label}</div>
                        <div className="text-sm text-gray-600">{theme.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme Selection */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Color Scheme</h3>
                  <div className="space-y-3">
                    {colorSchemes.map((scheme) => (
                      <motion.button
                        key={scheme.value}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          colorScheme === scheme.value
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setColorScheme(scheme.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{scheme.label}</div>
                          <div className="flex gap-2">
                            {scheme.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Preview Text */}
                <motion.div
                  className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl text-white text-center"
                  key={`${designTheme}-${colorScheme}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <p className="font-semibold mb-2">Preview</p>
                  <p className="text-sm opacity-90">
                    Your theme has been updated! Close this panel to see the changes.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
