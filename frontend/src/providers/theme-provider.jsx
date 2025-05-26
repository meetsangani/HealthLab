import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
  isDarkTheme: false,
  toggleTheme: () => null,
  themes: [],
});

export const availableThemes = ["light", "dark", "system", "dim", "ocean", "sunset", "purple"];

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );
  
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    // Add transition styles to document
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
      `)
    );
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "dim", "ocean", "sunset", "purple");

    let newTheme = theme;
    
    if (theme === "system") {
      newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    
    setResolvedTheme(newTheme);
    root.classList.add(newTheme);
    
    // Apply theme-specific CSS variables
    if (newTheme === "dim") {
      root.style.setProperty("--background", "hsl(240, 10%, 10%)");
      root.style.setProperty("--foreground", "hsl(0, 0%, 85%)");
      root.style.setProperty("--primary", "hsl(240, 60%, 60%)");
    } else if (newTheme === "ocean") {
      root.style.setProperty("--background", "hsl(210, 50%, 10%)");
      root.style.setProperty("--foreground", "hsl(210, 20%, 90%)");
      root.style.setProperty("--primary", "hsl(200, 80%, 50%)");
    } else if (newTheme === "sunset") {
      root.style.setProperty("--background", "hsl(0, 15%, 10%)");
      root.style.setProperty("--foreground", "hsl(40, 100%, 97%)");
      root.style.setProperty("--primary", "hsl(20, 80%, 60%)");
      root.style.setProperty("--secondary", "hsl(40, 90%, 60%)");
      root.style.setProperty("--accent", "hsl(320, 80%, 60%)");
      root.style.setProperty("--muted", "hsl(10, 20%, 20%)");
      root.style.setProperty("--muted-foreground", "hsl(30, 20%, 70%)");
    } else if (newTheme === "purple") {
      root.style.setProperty("--background", "hsl(270, 50%, 8%)");
      root.style.setProperty("--foreground", "hsl(270, 20%, 95%)");
      root.style.setProperty("--primary", "hsl(270, 80%, 60%)");
      root.style.setProperty("--secondary", "hsl(290, 70%, 50%)");
      root.style.setProperty("--accent", "hsl(320, 80%, 60%)");
      root.style.setProperty("--muted", "hsl(270, 30%, 15%)");
      root.style.setProperty("--muted-foreground", "hsl(270, 10%, 70%)");
    } else {
      // Reset custom properties for light/dark themes
      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--primary");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--muted");
      root.style.removeProperty("--muted-foreground");
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark", "dim", "ocean", "sunset", "purple");
        const systemTheme = e.matches ? "dark" : "light";
        root.classList.add(systemTheme);
        setResolvedTheme(systemTheme);
      };

      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    isDarkTheme: resolvedTheme === "dark" || resolvedTheme === "dim" || resolvedTheme === "ocean" || resolvedTheme === "sunset" || resolvedTheme === "purple",
    toggleTheme: () => {
      const newTheme = resolvedTheme === "light" ? "dark" : "light";
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    themes: availableThemes,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
