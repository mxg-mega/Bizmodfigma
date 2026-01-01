import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  Building2,
  Users,
  MapPin,
  Target,
  Package,
  TrendingUp,
  DollarSign,
  UserCheck,
  BarChart,
  Clock,
  Truck,
  MessageSquare,
  Upload,
  Sparkles,
  Mail,
  Zap,
  Calendar,
  ShoppingCart,
  FileText,
} from "lucide-react";
import { BiziAssistant } from "./BiziAssistant";

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  language: string;
  businessName: string;
  industry: string;
  businessSize: string;
  locations: string[];
  hasMultipleBusinesses: boolean;
  goals: string[];
  selectedModules: string[];
  currency: string;
  importData: boolean;
  teamMembers: string[];
}

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
];

const industries = [
  { id: "retail", name: "Retail & E-commerce", icon: "🏪", description: "Stores, shops, online sales" },
  { id: "services", name: "Services", icon: "💇", description: "Salons, gyms, consulting" },
  { id: "wholesale", name: "Wholesale & Distribution", icon: "📦", description: "Distributors, suppliers" },
  { id: "food", name: "Food & Beverage", icon: "🍔", description: "Restaurants, cafes, catering" },
  { id: "healthcare", name: "Healthcare", icon: "🏥", description: "Clinics, pharmacies" },
  { id: "other", name: "Other", icon: "💼", description: "Other business types" },
];

const businessSizes = [
  { id: "solo", name: "Just me", icon: "👤", range: "1 person" },
  { id: "small", name: "Small team", icon: "👥", range: "2-10 employees" },
  { id: "medium", name: "Growing", icon: "👨‍👩‍👧‍👦", range: "11-50 employees" },
  { id: "large", name: "Established", icon: "🏢", range: "50+ employees" },
];

const goals = [
  { id: "inventory", name: "Track inventory accurately", icon: Package },
  { id: "sales", name: "Increase sales & revenue", icon: TrendingUp },
  { id: "finance", name: "Better financial management", icon: DollarSign },
  { id: "crm", name: "Manage customer relationships", icon: UserCheck },
  { id: "analytics", name: "Understand my business data", icon: BarChart },
  { id: "time", name: "Save time on daily operations", icon: Clock },
  { id: "delivery", name: "Manage deliveries efficiently", icon: Truck },
  { id: "communication", name: "Communicate better with customers", icon: MessageSquare },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();

  // Form data
  const [language, setLanguage] = useState("en");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [locations, setLocations] = useState<string[]>([""]);
  const [hasMultipleBusinesses, setHasMultipleBusinesses] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [currency, setCurrency] = useState("NGN");
  const [importData, setImportData] = useState(false);
  const [teamEmails, setTeamEmails] = useState<string[]>([""]);

  const totalSteps = 7;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getRecommendedModules = () => {
    const modules: any[] = [];
    
    // Base recommendations on industry
    if (industry === "retail" || industry === "wholesale") {
      modules.push(
        { id: "inventory", name: "Inventory Management", icon: Package, reason: "Essential for tracking your products" },
        { id: "sales", name: "Sales & POS", icon: ShoppingCart, reason: "Perfect for your retail operations" }
      );
    }
    
    if (industry === "services") {
      modules.push(
        { id: "scheduling", name: "Scheduling & Booking", icon: Calendar, reason: "Manage appointments efficiently" },
        { id: "crm", name: "Customer Relations", icon: UserCheck, reason: "Build stronger customer relationships" }
      );
    }

    // Add based on goals
    if (selectedGoals.includes("finance")) {
      modules.push({ id: "accounting", name: "Accounting & Finance", icon: DollarSign, reason: "Track your finances effectively" });
    }
    
    if (selectedGoals.includes("analytics")) {
      modules.push({ id: "analytics", name: "Advanced Analytics", icon: BarChart, reason: "You want to understand your data" });
    }

    if (selectedGoals.includes("communication")) {
      modules.push({ id: "sms", name: "SMS & Messaging", icon: MessageSquare, reason: "Stay connected with customers" });
    }

    if (selectedGoals.includes("delivery")) {
      modules.push({ id: "delivery", name: "Delivery Management", icon: Truck, reason: "Streamline your logistics" });
    }

    // Always suggest these as useful
    if (!modules.find(m => m.id === "crm")) {
      modules.push({ id: "crm", name: "Customer Relations", icon: UserCheck, reason: "Build customer loyalty" });
    }

    return modules;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onComplete({
        language,
        businessName,
        industry,
        businessSize,
        locations: locations.filter(l => l.trim()),
        hasMultipleBusinesses,
        goals: selectedGoals,
        selectedModules,
        currency,
        importData,
        teamMembers: teamEmails.filter(e => e.trim()),
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return language !== "";
      case 1: return businessName.trim() !== "" && industry !== "" && businessSize !== "";
      case 2: return true; // Goals are optional
      case 3: return selectedModules.length > 0;
      case 4: return true; // Setup is optional
      case 5: return true; // Team is optional
      case 6: return true; // Final step
      default: return true;
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(g => g !== goalId) : [...prev, goalId]
    );
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  const addLocation = () => {
    setLocations([...locations, ""]);
  };

  const updateLocation = (index: number, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const addTeamMember = () => {
    setTeamEmails([...teamEmails, ""]);
  };

  const updateTeamEmail = (index: number, value: string) => {
    const newEmails = [...teamEmails];
    newEmails[index] = value;
    setTeamEmails(newEmails);
  };

  return (
    <div className={`min-h-screen ${theme.backgroundColor} relative`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="h-2 bg-gray-200">
          <motion.div
            className={theme.primaryGradient}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{ height: "100%" }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 200 200" fill="none">
              <rect x="40" y="60" width="20" height="80" rx="4" fill="url(#onboardB)" />
              <rect x="60" y="60" width="35" height="30" rx="8" fill="url(#onboardB2)" />
              <rect x="60" y="110" width="40" height="30" rx="8" fill="url(#onboardB3)" />
              <rect x="120" y="60" width="18" height="80" rx="4" fill="url(#onboardM)" />
              <rect x="142" y="60" width="18" height="65" rx="4" fill="url(#onboardM2)" />
              <rect x="164" y="60" width="18" height="80" rx="4" fill="url(#onboardM3)" />
              <defs>
                <linearGradient id="onboardB" x1="40" y1="60" x2="60" y2="140">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="onboardB2" x1="60" y1="60" x2="95" y2="90">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
                <linearGradient id="onboardB3" x1="60" y1="110" x2="100" y2="140">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="onboardM" x1="120" y1="60" x2="138" y2="140">
                  <stop stopColor="#06b6d4" />
                  <stop offset="1" stopColor="#0891b2" />
                </linearGradient>
                <linearGradient id="onboardM2" x1="142" y1="60" x2="160" y2="125">
                  <stop stopColor="#14b8a6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="onboardM3" x1="164" y1="60" x2="182" y2="140">
                  <stop stopColor="#0891b2" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-lg">BizMod</span>
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 0: Language Selection */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="inline-block mb-6"
                  >
                    <div className={`w-20 h-20 rounded-full ${theme.primaryGradient} flex items-center justify-center`}>
                      <Globe className="text-white" size={40} />
                    </div>
                  </motion.div>
                  <h1 className="text-4xl font-bold mb-4">Welcome to BizMod! 🎉</h1>
                  <p className="text-xl text-gray-600">Let's get you set up in just a few minutes</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">Choose your language</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          language === lang.code
                            ? `border-indigo-600 ${theme.secondaryGradient} bg-opacity-10`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setLanguage(lang.code)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-4xl mb-2">{lang.flag}</div>
                        <div className="font-semibold">{lang.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Business Profile */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Tell us about your business</h1>
                  <p className="text-gray-600">This helps us customize BizMod for you</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
                  <div>
                    <label className="block font-semibold mb-2">Business Name *</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g., Chic Boutique"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">Industry Type *</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {industries.map((ind) => (
                        <motion.button
                          key={ind.id}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            industry === ind.id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setIndustry(ind.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{ind.icon}</span>
                            <div>
                              <div className="font-semibold">{ind.name}</div>
                              <div className="text-xs text-gray-600">{ind.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">Business Size *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {businessSizes.map((size) => (
                        <motion.button
                          key={size.id}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            businessSize === size.id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setBusinessSize(size.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-2xl mb-1">{size.icon}</div>
                          <div className="font-semibold text-sm">{size.name}</div>
                          <div className="text-xs text-gray-600">{size.range}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Location(s)</label>
                    {locations.map((location, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => updateLocation(index, e.target.value)}
                          placeholder="e.g., Lagos, Victoria Island"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addLocation}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                    >
                      + Add another location
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasMultipleBusinesses}
                        onChange={(e) => setHasMultipleBusinesses(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="font-semibold">I manage multiple businesses</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Goals */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block mb-4"
                  >
                    <div className={`w-16 h-16 rounded-full ${theme.primaryGradient} flex items-center justify-center`}>
                      <Target className="text-white" size={32} />
                    </div>
                  </motion.div>
                  <h1 className="text-3xl font-bold mb-2">What are your goals?</h1>
                  <p className="text-gray-600">Select all that apply (this helps us recommend the right features)</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    {goals.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <motion.button
                          key={goal.id}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleGoal(goal.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                              <Icon size={24} className={isSelected ? 'text-indigo-600' : 'text-gray-600'} />
                            </div>
                            <span className="font-semibold flex-1">{goal.name}</span>
                            {isSelected && <Check className="text-indigo-600" size={20} />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={handleNext}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      I'll figure this out later →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: AI Module Recommendations */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="inline-block mb-4"
                  >
                    <div className={`w-16 h-16 rounded-full ${theme.primaryGradient} flex items-center justify-center`}>
                      <Sparkles className="text-white" size={32} />
                    </div>
                  </motion.div>
                  <h1 className="text-3xl font-bold mb-2">Bizi's Recommendations for You</h1>
                  <p className="text-gray-600">Based on your {industries.find(i => i.id === industry)?.name.toLowerCase()} business</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
                        <circle cx="28" cy="28" r="22" fill="#6366f1" opacity="0.1" />
                        <circle cx="28" cy="28" r="18" fill="white" />
                        <circle cx="22" cy="24" r="2" fill="#6366f1" />
                        <circle cx="34" cy="24" r="2" fill="#6366f1" />
                        <path d="M 20 30 Q 28 34 36 30" stroke="#6366f1" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">💡 Bizi says:</h3>
                      <p className="text-gray-700">
                        "I've analyzed your business needs and selected the perfect modules to get you started. 
                        You can always add or remove modules later!"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4">
                  <h2 className="font-bold text-lg mb-4">Select Your Modules</h2>
                  
                  {getRecommendedModules().map((module) => {
                    const Icon = module.icon;
                    const isSelected = selectedModules.includes(module.id);
                    const isRecommended = true; // All shown modules are recommended
                    
                    return (
                      <motion.button
                        key={module.id}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleModule(module.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${isSelected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                            <Icon size={24} className={isSelected ? 'text-indigo-600' : 'text-gray-600'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{module.name}</span>
                              {isRecommended && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">✨ {module.reason}</p>
                          </div>
                          {isSelected && <Check className="text-indigo-600" size={24} />}
                        </div>
                      </motion.button>
                    );
                  })}

                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="text-green-600" size={20} />
                      Free Tier Benefits
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Up to 2 modules included FREE</li>
                      <li>✓ 60 sales transactions/month</li>
                      <li>✓ 50 products in inventory</li>
                      <li>✓ 1 business location</li>
                      <li>✓ Full AI assistant (Bizi) - always free!</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2">
                      You've selected {selectedModules.length} modules. {selectedModules.length > 2 ? "Paid plan required." : "Perfect for free tier!"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Quick Setup */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Quick Setup</h1>
                  <p className="text-gray-600">Let's configure a few basics (optional)</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
                  <div>
                    <label className="block font-semibold mb-3">Preferred Currency</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { code: "NGN", name: "₦ Naira", flag: "🇳🇬" },
                        { code: "USD", name: "$ Dollar", flag: "🇺🇸" },
                        { code: "MULTI", name: "Multi-currency", flag: "🌍" },
                      ].map((curr) => (
                        <motion.button
                          key={curr.code}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            currency === curr.code
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setCurrency(curr.code)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-2xl mb-1">{curr.flag}</div>
                          <div className="font-semibold text-sm">{curr.name}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Upload className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Import Existing Data</h3>
                        <p className="text-sm text-gray-700 mb-3">
                          Already have products, customers, or sales data? We can help you migrate from Excel, CSV, or other software.
                        </p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={importData}
                            onChange={(e) => setImportData(e.target.checked)}
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                          <span className="font-semibold text-sm">Yes, I want to import data later</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={handleNext}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Skip this step →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Team Invitation */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block mb-4"
                  >
                    <div className={`w-16 h-16 rounded-full ${theme.primaryGradient} flex items-center justify-center`}>
                      <Users className="text-white" size={32} />
                    </div>
                  </motion.div>
                  <h1 className="text-3xl font-bold mb-2">Invite Your Team</h1>
                  <p className="text-gray-600">Collaborate with your team members (optional)</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
                  <div>
                    <label className="block font-semibold mb-3">Team Member Emails</label>
                    {teamEmails.map((email, index) => (
                      <div key={index} className="mb-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => updateTeamEmail(index, e.target.value)}
                          placeholder="colleague@company.com"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addTeamMember}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-2"
                    >
                      <Mail size={16} />
                      Add another team member
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm">Team Roles Available:</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>👑 <strong>Admin</strong> - Full access to all features</li>
                      <li>👔 <strong>Manager</strong> - Can manage operations and view reports</li>
                      <li>👤 <strong>Staff</strong> - Limited access to daily operations</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2">
                      You can set specific roles after sending invitations
                    </p>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={handleNext}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      I'll add team members later →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Meet Bizi & Success */}
            {currentStep === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="inline-block mb-4"
                  >
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-full ${theme.primaryGradient} flex items-center justify-center`}>
                        <svg width="64" height="64" viewBox="0 0 56 56" fill="none">
                          <circle cx="28" cy="28" r="22" fill="white" opacity="0.95" />
                          <circle cx="20" cy="24" r="3" fill="#6366f1" />
                          <circle cx="36" cy="24" r="3" fill="#6366f1" />
                          <path d="M 18 32 Q 28 38 38 32" stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                          <line x1="28" y1="6" x2="28" y2="10" stroke="white" strokeWidth="2" />
                          <circle cx="28" cy="4" r="2" fill="white" />
                        </svg>
                      </div>
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Sparkles className="text-yellow-400" size={32} />
                      </motion.div>
                    </div>
                  </motion.div>
                  <h1 className="text-4xl font-bold mb-2">Meet Bizi! 🎉</h1>
                  <p className="text-xl text-gray-600">Your AI Business Companion</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-4">What I Can Do For You:</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: MessageSquare, text: "Answer questions about BizMod anytime" },
                        { icon: BarChart, text: "Generate reports and analyze your data" },
                        { icon: Sparkles, text: "Give smart suggestions based on your business" },
                        { icon: FileText, text: "Help create invoices, receipts, and documents" },
                        { icon: TrendingUp, text: "Spot trends and opportunities" },
                        { icon: Zap, text: "Navigate features quickly with voice commands*" },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={i}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <Icon className="text-indigo-600" size={20} />
                            </div>
                            <p className="text-sm font-medium flex-1">{item.text}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-600 mt-4 text-center">
                      *Voice interaction coming soon!
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      Try asking Bizi:
                    </h3>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>"How do I create my first invoice?"</li>
                      <li>"Show me my sales from last week"</li>
                      <li>"What products are low in stock?"</li>
                      <li>"Help me set up my payment methods"</li>
                    </ul>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-gray-600 mb-4">
                      You'll find Bizi in the <strong>bottom-right corner</strong> whenever you need help!
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm">
                      <span>Look for this:</span>
                      <div className={`w-10 h-10 ${theme.primaryGradient} rounded-full flex items-center justify-center`}>
                        <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
                          <circle cx="28" cy="28" r="18" fill="white" opacity="0.95" />
                          <circle cx="23" cy="24" r="2" fill="#6366f1" />
                          <circle cx="33" cy="24" r="2" fill="#6366f1" />
                          <path d="M 21 30 Q 28 34 35 30" stroke="#6366f1" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <h2 className="text-3xl font-bold mb-2">🎊 You're All Set!</h2>
                    <p className="text-lg opacity-90 mb-6">
                      Welcome to BizMod, {businessName}! Let's start growing your business.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
            <motion.button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 0
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
              whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
            >
              <ArrowLeft size={20} />
              Back
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                canProceed()
                  ? `${theme.buttonPrimary}`
                  : "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
              whileHover={canProceed() ? { scale: 1.05 } : {}}
              whileTap={canProceed() ? { scale: 0.95 } : {}}
            >
              {currentStep === totalSteps - 1 ? "Go to Dashboard" : "Continue"}
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bizi Assistant - Always available */}
      <BiziAssistant onboardingMode={true} currentStep={`step-${currentStep}`} />
    </div>
  );
}
