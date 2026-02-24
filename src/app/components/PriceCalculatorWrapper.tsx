import { useNavigate } from "react-router";
import { PriceCalculator } from "./PriceCalculator";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function PriceCalculatorWrapper() {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button 
                onClick={() => navigate("/")}
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
                onClick={() => navigate("/")}
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
      <ThemeSwitcher />
    </>
  );
}