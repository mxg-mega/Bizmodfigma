import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { OnboardingFlow, OnboardingData } from "./components/OnboardingFlow";
import { Dashboard } from "./components/Dashboard";
import { PriceCalculator } from "./components/PriceCalculator";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

type Page = "landing" | "login" | "calculator" | "onboarding" | "dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [userEmail, setUserEmail] = useState("");
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    // For existing users, skip onboarding and go to dashboard
    // In a real app, you'd check if user has completed onboarding
    setCurrentPage("dashboard");
    
    // Mock onboarding data for demo login
    setOnboardingData({
      language: "en",
      businessName: "Demo Business",
      industry: "retail",
      businessSize: "small",
      locations: ["Lagos"],
      hasMultipleBusinesses: false,
      goals: ["sales", "inventory"],
      selectedModules: ["inventory", "sales", "accounting"],
      currency: "NGN",
      importData: false,
      teamMembers: [],
    });
  };

  const handleSignup = (email: string, name: string) => {
    setUserEmail(email);
    setCurrentPage("onboarding");
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setCurrentPage("dashboard");
  };

  return (
    <ThemeProvider>
      {currentPage === "landing" && (
        <LandingPage 
          onLoginClick={() => setCurrentPage("login")}
          onCalculatorClick={() => setCurrentPage("calculator")}
        />
      )}
      
      {currentPage === "login" && (
        <LoginPage 
          onBack={() => setCurrentPage("landing")}
          onLoginSuccess={handleLogin}
          onSignupSuccess={handleSignup}
        />
      )}
      
      {currentPage === "calculator" && (
        <div className="min-h-screen bg-white">
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <button 
                  onClick={() => setCurrentPage("landing")}
                  className="flex items-center gap-2 hover:opacity-80"
                >
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
                </button>
                <button 
                  onClick={() => setCurrentPage("landing")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
          <div className="pt-16">
            <PriceCalculator />
          </div>
        </div>
      )}
      
      {currentPage === "onboarding" && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      
      {currentPage === "dashboard" && onboardingData && (
        <Dashboard userData={onboardingData} userEmail={userEmail} />
      )}
      
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
