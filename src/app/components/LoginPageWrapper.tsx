import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { LoginPage } from "./LoginPage";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function LoginPageWrapper() {
  const navigate = useNavigate();
  const { user, loading, onboardingCompleted } = useAuth();

  // Redirect logged-in users appropriately
  useEffect(() => {
    if (!loading && user) {
      // If user hasn't completed onboarding, send them there
      if (!onboardingCompleted) {
        console.log('User logged in but onboarding not completed, redirecting to onboarding');
        navigate("/onboarding", { replace: true });
      } else {
        // User is logged in and onboarding is complete, go to dashboard
        console.log('User logged in and onboarding completed, redirecting to dashboard');
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, loading, onboardingCompleted, navigate]);

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

  return (
    <>
      <LoginPage
        onBack={() => navigate("/")}
        onLoginSuccess={() => {
          // This will be handled by the useEffect above
        }}
        onSignupSuccess={() => {
          // After signup, user should go to onboarding
          navigate("/onboarding");
        }}
      />
      <ThemeSwitcher />
    </>
  );
}