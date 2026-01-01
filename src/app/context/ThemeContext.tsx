import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type DesignTheme = "modern" | "futuristic" | "minimalist" | "professional" | "vibrant";
export type ColorScheme = "indigo-cyan" | "purple-pink" | "green-teal" | "orange-red" | "blue-violet";

interface ThemeContextType {
  designTheme: DesignTheme;
  colorScheme: ColorScheme;
  setDesignTheme: (theme: DesignTheme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  getThemeClasses: () => ThemeClasses;
}

interface ThemeClasses {
  primaryGradient: string;
  secondaryGradient: string;
  cardStyle: string;
  buttonPrimary: string;
  buttonSecondary: string;
  textGradient: string;
  accentColor: string;
  backgroundColor: string;
  borderStyle: string;
  shadowStyle: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [designTheme, setDesignTheme] = useState<DesignTheme>(() => {
    const saved = localStorage.getItem("designTheme");
    return (saved as DesignTheme) || "modern";
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem("colorScheme");
    return (saved as ColorScheme) || "indigo-cyan";
  });

  useEffect(() => {
    localStorage.setItem("designTheme", designTheme);
  }, [designTheme]);

  useEffect(() => {
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  const getThemeClasses = (): ThemeClasses => {
    // Color scheme mappings
    const colorSchemes = {
      "indigo-cyan": {
        primary: "from-indigo-600 to-cyan-600",
        secondary: "from-indigo-500 to-cyan-500",
        text: "from-indigo-600 via-purple-600 to-cyan-600",
        accent: "indigo-600",
        light: "from-slate-50 via-indigo-50 to-cyan-50",
      },
      "purple-pink": {
        primary: "from-purple-600 to-pink-600",
        secondary: "from-purple-500 to-pink-500",
        text: "from-purple-600 via-fuchsia-600 to-pink-600",
        accent: "purple-600",
        light: "from-slate-50 via-purple-50 to-pink-50",
      },
      "green-teal": {
        primary: "from-green-600 to-teal-600",
        secondary: "from-green-500 to-teal-500",
        text: "from-green-600 via-emerald-600 to-teal-600",
        accent: "green-600",
        light: "from-slate-50 via-green-50 to-teal-50",
      },
      "orange-red": {
        primary: "from-orange-600 to-red-600",
        secondary: "from-orange-500 to-red-500",
        text: "from-orange-600 via-rose-600 to-red-600",
        accent: "orange-600",
        light: "from-slate-50 via-orange-50 to-red-50",
      },
      "blue-violet": {
        primary: "from-blue-600 to-violet-600",
        secondary: "from-blue-500 to-violet-500",
        text: "from-blue-600 via-indigo-600 to-violet-600",
        accent: "blue-600",
        light: "from-slate-50 via-blue-50 to-violet-50",
      },
    };

    const colors = colorSchemes[colorScheme];

    // Design theme mappings
    const themes: Record<DesignTheme, ThemeClasses> = {
      modern: {
        primaryGradient: `bg-gradient-to-r ${colors.primary}`,
        secondaryGradient: `bg-gradient-to-br ${colors.secondary}`,
        cardStyle: "rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
        buttonPrimary: `px-6 py-3 bg-gradient-to-r ${colors.primary} text-white rounded-lg hover:shadow-lg transition-all`,
        buttonSecondary: `px-6 py-3 bg-white text-${colors.accent} border-2 border-${colors.accent} rounded-lg hover:bg-gray-50 transition-all`,
        textGradient: `bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`,
        accentColor: colors.accent,
        backgroundColor: `bg-gradient-to-br ${colors.light}`,
        borderStyle: "border-2 border-gray-200",
        shadowStyle: "shadow-lg",
      },
      futuristic: {
        primaryGradient: `bg-gradient-to-r ${colors.primary}`,
        secondaryGradient: `bg-gradient-to-br ${colors.secondary}`,
        cardStyle: "rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl hover:shadow-cyan-500/50 transition-all backdrop-blur-xl",
        buttonPrimary: `px-6 py-3 bg-gradient-to-r ${colors.primary} text-white rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all border border-cyan-400/30`,
        buttonSecondary: `px-6 py-3 bg-transparent text-cyan-400 border-2 border-cyan-400 rounded-full hover:bg-cyan-400/10 transition-all`,
        textGradient: `bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`,
        accentColor: "cyan-400",
        backgroundColor: "bg-gradient-to-br from-gray-950 via-gray-900 to-black",
        borderStyle: "border-2 border-cyan-400/30",
        shadowStyle: "shadow-2xl shadow-cyan-500/20",
      },
      minimalist: {
        primaryGradient: `bg-${colors.accent}`,
        secondaryGradient: `bg-gray-900`,
        cardStyle: "rounded-lg bg-white border border-gray-300 hover:border-gray-400 transition-colors",
        buttonPrimary: `px-6 py-3 bg-${colors.accent} text-white rounded-md hover:opacity-90 transition-opacity`,
        buttonSecondary: `px-6 py-3 bg-white text-${colors.accent} border border-${colors.accent} rounded-md hover:bg-gray-50 transition-colors`,
        textGradient: `text-gray-900`,
        accentColor: colors.accent,
        backgroundColor: "bg-white",
        borderStyle: "border border-gray-300",
        shadowStyle: "shadow-sm",
      },
      professional: {
        primaryGradient: `bg-gradient-to-r ${colors.primary}`,
        secondaryGradient: `bg-gradient-to-br ${colors.secondary}`,
        cardStyle: "rounded-lg bg-white border-l-4 border-l-indigo-600 shadow-md hover:shadow-lg transition-shadow",
        buttonPrimary: `px-8 py-3 bg-gradient-to-r ${colors.primary} text-white rounded-md hover:shadow-md transition-all font-semibold`,
        buttonSecondary: `px-8 py-3 bg-white text-${colors.accent} border-2 border-${colors.accent} rounded-md hover:bg-gray-100 transition-all font-semibold`,
        textGradient: `text-gray-900 font-bold`,
        accentColor: colors.accent,
        backgroundColor: "bg-gray-50",
        borderStyle: "border-2 border-gray-300",
        shadowStyle: "shadow-xl",
      },
      vibrant: {
        primaryGradient: `bg-gradient-to-r ${colors.primary}`,
        secondaryGradient: `bg-gradient-to-br ${colors.secondary}`,
        cardStyle: `rounded-3xl bg-gradient-to-br from-white to-${colors.accent}/10 border-4 border-${colors.accent}/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all`,
        buttonPrimary: `px-8 py-4 bg-gradient-to-r ${colors.primary} text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all font-bold`,
        buttonSecondary: `px-8 py-4 bg-white text-${colors.accent} border-4 border-${colors.accent} rounded-2xl hover:bg-${colors.accent} hover:text-white transition-all font-bold`,
        textGradient: `bg-gradient-to-r ${colors.text} bg-clip-text text-transparent font-bold`,
        accentColor: colors.accent,
        backgroundColor: `bg-gradient-to-br ${colors.light}`,
        borderStyle: `border-4 border-${colors.accent}/30`,
        shadowStyle: "shadow-2xl",
      },
    };

    return themes[designTheme];
  };

  return (
    <ThemeContext.Provider
      value={{
        designTheme,
        colorScheme,
        setDesignTheme,
        setColorScheme,
        getThemeClasses,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
