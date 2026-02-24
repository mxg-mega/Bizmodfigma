import { useNavigate } from "react-router";
import { LandingPage } from "./LandingPage";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function LandingPageWrapper() {
  const navigate = useNavigate();

  return (
    <>
      <LandingPage
        onLoginClick={() => navigate("/login")}
        onCalculatorClick={() => navigate("/calculator")}
      />
      <ThemeSwitcher />
    </>
  );
}