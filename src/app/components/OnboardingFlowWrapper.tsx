import { useNavigate } from "react-router";
import { OnboardingFlow, OnboardingData } from "./OnboardingFlow";
import { useBusiness } from "../context/BusinessContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function OnboardingFlowWrapper() {
  const navigate = useNavigate();
  const { createBusiness, createLocation } = useBusiness();
  const { user, loading, setOnboardingCompleted, onboardingCompleted } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login');
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // If user already completed onboarding, redirect to dashboard
  useEffect(() => {
    if (!loading && user && onboardingCompleted) {
      console.log('User already completed onboarding, redirecting to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, onboardingCompleted, navigate]);

  const handleComplete = async (data: OnboardingData) => {
    try {
      console.log('Onboarding completed, creating business...');
      
      // Create the business
      const business = await createBusiness({
        name: data.businessName,
        industry: data.industry,
        currency: data.currency,
      });

      // Create default location
      if (data.locations.length > 0) {
        await createLocation({
          businessId: business.id,
          name: data.locations[0],
          address: "",
          city: data.locations[0],
          state: "",
          country: "Nigeria",
          isDefault: true,
        });
      }

      // Mark onboarding as completed
      setOnboardingCompleted(true);
      console.log('Onboarding marked as complete, navigating to dashboard');

      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated or already completed onboarding
  if (!user || onboardingCompleted) {
    return null;
  }

  return <OnboardingFlow onComplete={handleComplete} />;
}