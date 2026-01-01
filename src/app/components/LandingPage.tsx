import { motion } from "motion/react";
import { BizModLogo } from "./BizModLogo";
import { useTheme } from "../context/ThemeContext";
import { 
  Check, 
  Zap, 
  Layout, 
  TrendingUp, 
  Shield, 
  Globe, 
  Users, 
  Settings,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  BarChart,
  ShoppingCart,
  DollarSign,
  Package,
  UserCheck,
  Calendar,
  MessageSquare
} from "lucide-react";
import { useState } from "react";

interface LandingPageProps {
  onLoginClick?: () => void;
  onCalculatorClick?: () => void;
}

export function LandingPage({ onLoginClick, onCalculatorClick }: LandingPageProps) {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enabledModules, setEnabledModules] = useState<string[]>([
    "inventory",
    "sales",
    "accounting"
  ]);

  const modules = [
    { id: "inventory", icon: Package, name: "Inventory Management", color: "from-purple-500 to-indigo-500" },
    { id: "sales", icon: ShoppingCart, name: "Sales & POS", color: "from-indigo-500 to-blue-500" },
    { id: "accounting", icon: DollarSign, name: "Accounting & Finance", color: "from-blue-500 to-cyan-500" },
    { id: "crm", icon: UserCheck, name: "Customer Relations", color: "from-cyan-500 to-teal-500" },
    { id: "scheduling", icon: Calendar, name: "Scheduling & Booking", color: "from-teal-500 to-green-500" },
    { id: "messaging", icon: MessageSquare, name: "SMS & Messaging", color: "from-green-500 to-emerald-500" },
  ];

  const toggleModule = (id: string) => {
    setEnabledModules(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10">
                <svg width="40" height="40" viewBox="0 0 200 200" fill="none">
                  <rect x="40" y="60" width="20" height="80" rx="4" fill="url(#navB)" />
                  <rect x="60" y="60" width="35" height="30" rx="8" fill="url(#navB2)" />
                  <rect x="60" y="110" width="40" height="30" rx="8" fill="url(#navB3)" />
                  <rect x="120" y="60" width="18" height="80" rx="4" fill="url(#navM)" />
                  <rect x="142" y="60" width="18" height="65" rx="4" fill="url(#navM2)" />
                  <rect x="164" y="60" width="18" height="80" rx="4" fill="url(#navM3)" />
                  <defs>
                    <linearGradient id="navB" x1="40" y1="60" x2="60" y2="140">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="navB2" x1="60" y1="60" x2="95" y2="90">
                      <stop stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#a78bfa" />
                    </linearGradient>
                    <linearGradient id="navB3" x1="60" y1="110" x2="100" y2="140">
                      <stop stopColor="#7c3aed" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="navM" x1="120" y1="60" x2="138" y2="140">
                      <stop stopColor="#06b6d4" />
                      <stop offset="1" stopColor="#0891b2" />
                    </linearGradient>
                    <linearGradient id="navM2" x1="142" y1="60" x2="160" y2="125">
                      <stop stopColor="#14b8a6" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="navM3" x1="164" y1="60" x2="182" y2="140">
                      <stop stopColor="#0891b2" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                BizMod
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#modules" className="text-gray-600 hover:text-indigo-600 transition-colors">Modules</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Testimonials</a>
              <button 
                onClick={onLoginClick}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
              <a href="#modules" className="text-gray-600 hover:text-indigo-600">Modules</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600">Testimonials</a>
              <button 
                onClick={onLoginClick}
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🇳🇬 Built for Nigerian SMEs & Beyond
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Business,{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Your Modules
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Stop paying for features you don't need. BizMod lets you build your perfect business management system 
                by enabling only the modules that matter to your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  14-day free trial
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <BizModLogo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "5,000+", label: "Active Businesses" },
              { number: "₦2.5B+", label: "Revenue Managed" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Modules Section */}
      <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Build Your Perfect System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Toggle modules on and off to create a system tailored to your business. 
              Pay only for what you use, and scale as you grow.
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <p className="text-gray-600">Try it yourself! Click to enable or disable modules:</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, i) => {
                const Icon = module.icon;
                const isEnabled = enabledModules.includes(module.id);
                
                return (
                  <motion.button
                    key={module.id}
                    className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                      isEnabled 
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-cyan-50' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                    onClick={() => toggleModule(module.id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color}`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-all ${
                        isEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full m-0.5"
                          animate={{ x: isEnabled ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{module.name}</h3>
                    <p className="text-sm text-gray-600">
                      {isEnabled ? 'Active' : 'Disabled'}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <motion.div 
              className="mt-8 p-6 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl text-white text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg font-semibold mb-2">
                Your Monthly Cost: ₦{enabledModules.length * 2500 + 5000}/month
              </p>
              <p className="text-indigo-100">
                {enabledModules.length} modules enabled • Base price: ₦5,000 • Per module: ₦2,500
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for growing Nigerian businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "Modular & Flexible",
                description: "Enable or disable features as your business evolves. No more paying for unused features.",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for Nigerian internet speeds. Works smoothly even on slow connections.",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: Globe,
                title: "Multi-Currency Support",
                description: "Handle Naira, Dollars, and other currencies seamlessly with real-time exchange rates.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Add unlimited team members with customizable roles and permissions.",
                color: "from-cyan-500 to-teal-500"
              },
              {
                icon: BarChart,
                title: "Real-Time Analytics",
                description: "Make data-driven decisions with beautiful, easy-to-understand dashboards.",
                color: "from-teal-500 to-green-500"
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your data is encrypted and backed up automatically. SOC 2 compliant.",
                color: "from-green-500 to-emerald-500"
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  className="p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Perfect for Every Business Type
            </h2>
            <p className="text-xl text-gray-600">
              From retail shops to professional services, BizMod adapts to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Retail & E-commerce",
                businesses: "Supermarkets, Fashion stores, Electronics shops",
                modules: ["Inventory", "POS", "Accounting", "Multi-location"]
              },
              {
                title: "Service Businesses",
                businesses: "Salons, Gyms, Consulting firms, Clinics",
                modules: ["Scheduling", "CRM", "Payments", "SMS Reminders"]
              },
              {
                title: "Wholesale & Distribution",
                businesses: "Distributors, Manufacturers, Importers",
                modules: ["Inventory", "Invoicing", "Delivery", "Supplier Management"]
              },
            ].map((useCase, i) => (
              <motion.div
                key={i}
                className="p-6 bg-white rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{useCase.businesses}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.modules.map((module, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Nigerian Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Chioma Okafor",
                business: "Chic Boutique, Lagos",
                text: "BizMod transformed how we manage our 3 locations. The inventory module alone paid for itself in the first month by reducing stock-outs.",
                avatar: "CO"
              },
              {
                name: "Ibrahim Musa",
                business: "Tech Solutions Ltd, Abuja",
                text: "As a tech-savvy person, I appreciate the flexibility. I only enable the modules I need and the system is incredibly fast even on 3G.",
                avatar: "IM"
              },
              {
                name: "Grace Adeyemi",
                business: "Divine Beauty Salon, PH",
                text: "The scheduling and SMS reminder features reduced no-shows by 70%. My clients love the automated appointment confirmations!",
                avatar: "GA"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="p-6 bg-white rounded-xl shadow-md border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.business}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Calculator Section */}
      <button
        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        onClick={onCalculatorClick}
      >
        Calculate Your Price
        <ArrowRight size={20} />
      </button>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Pay only for what you use. No hidden fees.
            </p>
            <motion.button
              onClick={onCalculatorClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart size={20} />
              Try our Price Calculator
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "7,500",
                description: "Perfect for small businesses just getting started",
                features: [
                  "Up to 2 modules",
                  "1 user account",
                  "Basic analytics",
                  "Email support",
                  "Mobile app access"
                ],
                cta: "Start Free Trial",
                popular: false
              },
              {
                name: "Growth",
                price: "15,000",
                description: "For growing businesses that need more power",
                features: [
                  "Up to 5 modules",
                  "5 user accounts",
                  "Advanced analytics",
                  "Priority support",
                  "API access",
                  "Custom reports"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large businesses with custom needs",
                features: [
                  "Unlimited modules",
                  "Unlimited users",
                  "AI-powered insights",
                  "24/7 phone support",
                  "Dedicated account manager",
                  "Custom integrations"
                ],
                cta: "Contact Sales",
                popular: false
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                className={`p-8 rounded-2xl ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-2xl scale-105' 
                    : 'bg-white border-2 border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="px-4 py-1 bg-white/20 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    {plan.price === "Custom" ? plan.price : `₦${plan.price}`}
                  </span>
                  {plan.price !== "Custom" && <span className="text-sm">/month</span>}
                </div>
                <p className={`mb-6 ${plan.popular ? 'text-indigo-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check size={20} className={plan.popular ? 'text-white' : 'text-green-500'} />
                      <span className={plan.popular ? 'text-white' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join thousands of Nigerian businesses already using BizMod to scale and automate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your 14-Day Free Trial
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8">
                  <svg width="32" height="32" viewBox="0 0 200 200" fill="none">
                    <rect x="40" y="60" width="20" height="80" rx="4" fill="url(#footerB)" />
                    <rect x="60" y="60" width="35" height="30" rx="8" fill="url(#footerB)" />
                    <rect x="60" y="110" width="40" height="30" rx="8" fill="url(#footerB)" />
                    <rect x="120" y="60" width="18" height="80" rx="4" fill="url(#footerM)" />
                    <rect x="142" y="60" width="18" height="65" rx="4" fill="url(#footerM)" />
                    <rect x="164" y="60" width="18" height="80" rx="4" fill="url(#footerM)" />
                    <defs>
                      <linearGradient id="footerB" x1="40" y1="60" x2="100" y2="140">
                        <stop stopColor="#6366f1" />
                        <stop offset="1" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="footerM" x1="120" y1="60" x2="182" y2="140">
                        <stop stopColor="#06b6d4" />
                        <stop offset="1" stopColor="#0891b2" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="font-bold text-xl text-white">BizMod</span>
              </div>
              <p className="text-sm">
                Modular business management software built for African entrepreneurs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Modules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2024 BizMod. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}