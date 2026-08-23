import { useNavigate } from "react-router";
import { OnboardingFlow, OnboardingData } from "./OnboardingFlow";
import { useBusiness } from "../context/BusinessContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export function OnboardingFlowWrapper() {
  const navigate = useNavigate();
  const { createBusiness, createLocation } = useBusiness();
  const { user, loading, setOnboardingCompleted, onboardingCompleted } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      console.log('Onboarding completed, creating business...');
      
      // Create the business
      const business = await createBusiness({
        name: data.businessName,
        industry: data.industry,
        currency: data.currency,
      });
      
      console.log('Business created successfully:', business);

      // Create default location
      if (data.locations.length > 0) {
        console.log('Creating location for business:', business.id);
        await createLocation({
          businessId: business.id,
          name: data.locations[0],
          address: "",
          city: data.locations[0],
          state: "",
          country: "Nigeria",
          isDefault: true,
        });
        console.log('Location created successfully');
      }

      // Mark onboarding as completed
      setOnboardingCompleted(true);
      console.log('Onboarding marked as complete, navigating to dashboard');

      // Small delay to ensure state updates
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError(error instanceof Error ? error.message : "An error occurred during onboarding");
      
      // Still navigate to dashboard after showing error
      setTimeout(() => {
        setOnboardingCompleted(true);
        navigate("/dashboard");
      }, 2000);
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

  return (
    <>
      <OnboardingFlow onComplete={handleComplete} />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <p className="font-semibold">Setup Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1 text-red-600">Redirecting to dashboard...</p>
        </div>
      )}
    </>
  );
}