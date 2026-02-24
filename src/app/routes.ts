import { createBrowserRouter, Navigate } from "react-router";
import { LandingPageWrapper } from "./components/LandingPageWrapper";
import { LoginPageWrapper } from "./components/LoginPageWrapper";
import { OnboardingFlowWrapper } from "./components/OnboardingFlowWrapper";
import { PriceCalculatorWrapper } from "./components/PriceCalculatorWrapper";
import { BusinessSetupWrapper } from "./components/BusinessSetupWrapper";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { InventoryPage } from "./components/InventoryPage";
import { SalesPage } from "./components/SalesPage";
import { CustomersPage } from "./components/CustomersPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPageWrapper,
  },
  {
    path: "/login",
    Component: LoginPageWrapper,
  },
  {
    path: "/onboarding",
    Component: OnboardingFlowWrapper,
  },
  {
    path: "/calculator",
    Component: PriceCalculatorWrapper,
  },
  {
    path: "/business-setup",
    Component: BusinessSetupWrapper,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "inventory",
        Component: InventoryPage,
      },
      {
        path: "sales",
        Component: SalesPage,
      },
      {
        path: "customers",
        Component: CustomersPage,
      },
      {
        path: "analytics",
        Component: AnalyticsPage,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
]);