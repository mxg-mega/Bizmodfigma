import { motion } from "motion/react";
import { useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  UserCheck,
  Calendar,
  MessageSquare,
  Users,
  BarChart,
  Truck,
  FileText,
  Mail,
  Phone,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface Module {
  id: string;
  icon: any;
  name: string;
  description: string;
  price: number;
  category: "core" | "sales" | "operations" | "communication";
}

export function PriceCalculator() {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();

  const [selectedModules, setSelectedModules] = useState<string[]>([
    "inventory",
    "sales",
    "accounting",
  ]);

  const [userTier, setUserTier] = useState<"small" | "medium" | "large">("small");

  const modules: Module[] = [
    {
      id: "inventory",
      icon: Package,
      name: "Inventory Management",
      description: "Track stock, manage warehouses, auto-reorder",
      price: 2500,
      category: "core",
    },
    {
      id: "sales",
      icon: ShoppingCart,
      name: "Sales & POS",
      description: "Point of sale, invoicing, receipts",
      price: 3000,
      category: "sales",
    },
    {
      id: "accounting",
      icon: DollarSign,
      name: "Accounting & Finance",
      description: "Bookkeeping, expenses, financial reports",
      price: 3500,
      category: "core",
    },
    {
      id: "crm",
      icon: UserCheck,
      name: "Customer Relations (CRM)",
      description: "Customer database, history, loyalty programs",
      price: 2500,
      category: "sales",
    },
    {
      id: "scheduling",
      icon: Calendar,
      name: "Scheduling & Booking",
      description: "Appointments, calendar, staff scheduling",
      price: 2000,
      category: "operations",
    },
    {
      id: "sms",
      icon: MessageSquare,
      name: "SMS & Messaging",
      description: "Bulk SMS, notifications, reminders",
      price: 2000,
      category: "communication",
    },
    {
      id: "hrm",
      icon: Users,
      name: "HR Management",
      description: "Employee records, payroll, attendance",
      price: 3000,
      category: "operations",
    },
    {
      id: "analytics",
      icon: BarChart,
      name: "Advanced Analytics",
      description: "Business intelligence, custom reports, insights",
      price: 4000,
      category: "core",
    },
    {
      id: "delivery",
      icon: Truck,
      name: "Delivery Management",
      description: "Logistics, tracking, driver management",
      price: 2500,
      category: "operations",
    },
    {
      id: "documents",
      icon: FileText,
      name: "Document Management",
      description: "Contracts, invoices, document storage",
      price: 1500,
      category: "operations",
    },
    {
      id: "email",
      icon: Mail,
      name: "Email Marketing",
      description: "Campaigns, newsletters, automation",
      price: 2500,
      category: "communication",
    },
    {
      id: "support",
      icon: Phone,
      name: "Customer Support",
      description: "Ticketing, live chat, help desk",
      price: 2000,
      category: "communication",
    },
  ];

  const userTiers = {
    small: { name: "1-5 Users", baseFee: 5000, multiplier: 1 },
    medium: { name: "6-15 Users", baseFee: 12000, multiplier: 1.2 },
    large: { name: "16+ Users", baseFee: 25000, multiplier: 1.5 },
  };

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const baseFee = userTiers[userTier].baseFee;
    const modulesCost = selectedModules.reduce((total, moduleId) => {
      const module = modules.find((m) => m.id === moduleId);
      return total + (module?.price || 0);
    }, 0);
    const multiplier = userTiers[userTier].multiplier;
    return Math.round(baseFee + modulesCost * multiplier);
  };

  const categories = [
    { id: "core", name: "Core Business", color: "from-purple-500 to-indigo-500" },
    { id: "sales", name: "Sales & Revenue", color: "from-indigo-500 to-blue-500" },
    { id: "operations", name: "Operations", color: "from-blue-500 to-cyan-500" },
    { id: "communication", name: "Communication", color: "from-cyan-500 to-teal-500" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-10 h-10 text-indigo-600" />
            <h2 className="text-4xl font-bold">Price Calculator</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build your custom package and see exactly what you'll pay. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Module Selection */}
          <div className="lg:col-span-2">
            {/* User Tier Selection */}
            <motion.div
              className={theme.cardStyle + " p-6 mb-6"}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4">Select Team Size</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(userTiers).map(([key, tier]) => (
                  <motion.button
                    key={key}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      userTier === key
                        ? `border-${theme.accentColor} bg-gradient-to-br ${theme.secondaryGradient} text-white`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setUserTier(key as typeof userTier)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-semibold">{tier.name}</div>
                    <div className={`text-xs mt-1 ${userTier === key ? "text-white/80" : "text-gray-600"}`}>
                      Base: ₦{tier.baseFee.toLocaleString()}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Modules by Category */}
            {categories.map((category, catIndex) => {
              const categoryModules = modules.filter((m) => m.category === category.id);
              return (
                <motion.div
                  key={category.id}
                  className={theme.cardStyle + " p-6 mb-6"}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${category.color}`} />
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryModules.map((module) => {
                      const Icon = module.icon;
                      const isSelected = selectedModules.includes(module.id);

                      return (
                        <motion.button
                          key={module.id}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? `border-${theme.accentColor} bg-gradient-to-br ${theme.secondaryGradient} bg-opacity-10`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleModule(module.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                              <Icon className="text-white" size={20} />
                            </div>
                            {isSelected && (
                              <CheckCircle2 className={`text-${theme.accentColor}`} size={20} />
                            )}
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{module.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{module.description}</p>
                          <div className="text-sm font-semibold text-indigo-600">
                            +₦{module.price.toLocaleString()}/mo
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column - Price Summary (Sticky) */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={theme.cardStyle + " p-6"}>
                <h3 className="text-xl font-bold mb-6">Your Custom Package</h3>

                {/* Selected Modules */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">
                    Selected Modules ({selectedModules.length})
                  </h4>
                  {selectedModules.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No modules selected</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedModules.map((moduleId) => {
                        const module = modules.find((m) => m.id === moduleId);
                        if (!module) return null;
                        return (
                          <div
                            key={moduleId}
                            className="flex items-center justify-between text-sm py-2 border-b border-gray-100"
                          >
                            <span>{module.name}</span>
                            <span className="font-semibold">
                              ₦{Math.round(module.price * userTiers[userTier].multiplier).toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fee ({userTiers[userTier].name})</span>
                    <span className="font-semibold">
                      ₦{userTiers[userTier].baseFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Modules Cost</span>
                    <span className="font-semibold">
                      ₦
                      {Math.round(
                        selectedModules.reduce((total, moduleId) => {
                          const module = modules.find((m) => m.id === moduleId);
                          return total + (module?.price || 0);
                        }, 0) * userTiers[userTier].multiplier
                      ).toLocaleString()}
                    </span>
                  </div>
                  {userTiers[userTier].multiplier > 1 && (
                    <div className="text-xs text-gray-500 italic">
                      *Includes {((userTiers[userTier].multiplier - 1) * 100).toFixed(0)}% team size
                      adjustment
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className={`${theme.primaryGradient} text-white rounded-lg p-4 mb-6`}>
                  <div className="text-sm mb-1">Monthly Total</div>
                  <div className="text-3xl font-bold">₦{calculateTotal().toLocaleString()}</div>
                  <div className="text-sm mt-2 opacity-90">
                    or ₦{Math.round(calculateTotal() * 0.85).toLocaleString()}/mo (annual billing)
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <motion.button
                    className={theme.buttonPrimary + " w-full justify-center"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Free Trial
                  </motion.button>
                  <motion.button
                    className={theme.buttonSecondary + " w-full justify-center"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Talk to Sales
                  </motion.button>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Free data migration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>24/7 support included</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
