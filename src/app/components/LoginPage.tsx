import { motion } from "motion/react";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, Apple } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onBack?: () => void;
  onLoginSuccess?: (email: string) => void;
  onSignupSuccess?: (email: string, name: string) => void;
}

export function LoginPage({ onBack, onLoginSuccess, onSignupSuccess }: LoginPageProps) {
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    
    try {
      if (!isSignUp) {
        // Login
        const { error: signInError } = await signIn(email, password);
        
        if (signInError) {
          setError(signInError.message || "Invalid credentials");
          setLoading(false);
          return;
        }
        
        // Success - will be redirected by auth state change
        setLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(email);
        }
      } else {
        // Signup
        if (!name || !email || !password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        
        const { error: signUpError } = await signUp(email, password, name);
        
        if (signUpError) {
          setError(signUpError.message || "Signup failed");
          setLoading(false);
          return;
        }
        
        // Account created successfully - user is now logged in
        setSuccessMessage(
          "Account created successfully! You are now logged in."
        );
        setLoading(false);
        
        // Call success callback if provided
        if (onSignupSuccess) {
          onSignupSuccess(email, name);
        }
        
        // Auto-close success message after 2 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);
    
    const { error: googleError } = await signInWithGoogle();
    
    if (googleError) {
      setError(googleError.message || "Google sign-in failed");
      setLoading(false);
    }
    
    // Note: For Google OAuth to work, you need to configure it in your Supabase dashboard
    // Follow instructions at https://supabase.com/docs/guides/auth/social-login/auth-google
  };

  return (
    <div className={`min-h-screen ${theme.backgroundColor} flex`}>
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="mb-8">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
              <svg width="40" height="40" viewBox="0 0 200 200" fill="none">
                <rect x="40" y="60" width="20" height="80" rx="4" fill="url(#loginB)" />
                <rect x="60" y="60" width="35" height="30" rx="8" fill="url(#loginB2)" />
                <rect x="60" y="110" width="40" height="30" rx="8" fill="url(#loginB3)" />
                <rect x="120" y="60" width="18" height="80" rx="4" fill="url(#loginM)" />
                <rect x="142" y="60" width="18" height="65" rx="4" fill="url(#loginM2)" />
                <rect x="164" y="60" width="18" height="80" rx="4" fill="url(#loginM3)" />
                <defs>
                  <linearGradient id="loginB" x1="40" y1="60" x2="60" y2="140">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="loginB2" x1="60" y1="60" x2="95" y2="90">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#a78bfa" />
                  </linearGradient>
                  <linearGradient id="loginB3" x1="60" y1="110" x2="100" y2="140">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="loginM" x1="120" y1="60" x2="138" y2="140">
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#0891b2" />
                  </linearGradient>
                  <linearGradient id="loginM2" x1="142" y1="60" x2="160" y2="125">
                    <stop stopColor="#14b8a6" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="loginM3" x1="164" y1="60" x2="182" y2="140">
                    <stop stopColor="#0891b2" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={`text-2xl font-bold ${theme.textGradient}`}>BizMod</span>
            </button>
            <h1 className="text-3xl font-bold mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-gray-600">
              {isSignUp
                ? "Start your 14-day free trial today"
                : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <motion.button
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
            >
              <Chrome size={20} />
              <span>Continue with Google</span>
            </motion.button>
            <motion.button
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Apple size={20} />
              <span>Continue with Apple</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {successMessage}
              </motion.div>
            )}

            {!isSignUp && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>Email: <code className="bg-blue-100 px-1 rounded">demo@bizmod.ng</code></p>
                <p>Password: <code className="bg-blue-100 px-1 rounded">BizMod2024!</code></p>
              </div>
            )}

            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                  placeholder="John Doe"
                  required={isSignUp}
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </a>
              </div>
            )}

            {isSignUp && (
              <div className="text-sm text-gray-600">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            )}

            <motion.button
              type="submit"
              className={`${theme.buttonPrimary} w-full flex items-center justify-center gap-2`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight size={20} />
            </motion.button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {/* Trust Badges */}
          {isSignUp && (
            <motion.div
              className="mt-8 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-600 text-center mb-4">
                Trusted by over 5,000 businesses
              </p>
              <div className="flex justify-center gap-8 opacity-50">
                <div className="text-2xl">🇳🇬</div>
                <div className="text-2xl">🏪</div>
                <div className="text-2xl">💼</div>
                <div className="text-2xl">🚀</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Visual/Testimonial */}
      <motion.div
        className={`hidden lg:flex flex-1 ${theme.primaryGradient} text-white p-12 items-center justify-center`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md">
          <motion.div
            className="mb-8"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
              <rect x="40" y="60" width="20" height="80" rx="4" fill="white" opacity="0.9" />
              <rect x="60" y="60" width="35" height="30" rx="8" fill="white" opacity="0.8" />
              <rect x="60" y="110" width="40" height="30" rx="8" fill="white" opacity="0.8" />
              <rect x="120" y="60" width="18" height="80" rx="4" fill="white" opacity="0.9" />
              <rect x="142" y="60" width="18" height="65" rx="4" fill="white" opacity="0.8" />
              <rect x="164" y="60" width="18" height="80" rx="4" fill="white" opacity="0.9" />
            </svg>
          </motion.div>

          <h2 className="text-3xl font-bold mb-4">
            {isSignUp
              ? "Start growing your business today"
              : "Your business management hub awaits"}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of Nigerian businesses using BizMod to streamline operations, boost sales,
            and scale efficiently.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold mb-1">No Credit Card Required</h3>
                <p className="text-sm opacity-80">Start your 14-day free trial instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold mb-1">Free Data Migration</h3>
                <p className="text-sm opacity-80">We'll help you move your existing data</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold mb-1">24/7 Support</h3>
                <p className="text-sm opacity-80">Our team is always here to help you succeed</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="italic mb-2">
              "BizMod transformed how we manage our business. The modular approach means we only pay
              for what we need!"
            </p>
            <p className="font-semibold">— Chioma O., Lagos</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}