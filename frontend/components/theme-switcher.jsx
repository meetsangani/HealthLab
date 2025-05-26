import React from 'react';
import { useTheme, availableThemes } from '../src/providers/theme-provider';

export function ThemeSwitcher({ className = "" }) {
  const { theme, setTheme } = useTheme();
  
  // Theme color indicators
  const themeColors = {
    light: 'bg-white border border-gray-200',
    dark: 'bg-gray-900 border border-gray-700',
    system: 'bg-gradient-to-r from-white to-gray-900 border border-gray-300',
    dim: 'bg-[#191927] border border-gray-700',
    ocean: 'bg-[#0a1a2a] border border-blue-900',
    sunset: 'bg-gradient-to-r from-orange-600 to-pink-600 border border-orange-700',
    purple: 'bg-gradient-to-r from-purple-800 to-indigo-700 border border-purple-900'
  };
  
  return (
    <div className={`theme-switcher ${className}`}>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2 shadow-sm">
        {availableThemes.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`relative flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              theme === t 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-muted"
            }`}
          >
            <span className={`mr-2 inline-block h-3 w-3 rounded-full ${themeColors[t]}`}></span>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {theme === t && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThemeToggle({ className = "" }) {
  const { theme, setTheme, isDarkTheme, resolvedTheme } = useTheme();
  
  // Function to get next theme in rotation
  const getNextTheme = () => {
    const themeOrder = ['light', 'dark', 'sunset', 'purple', 'ocean', 'dim'];
    const currentIndex = themeOrder.indexOf(resolvedTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  };
  
  return (
    <button
      onClick={() => setTheme(getNextTheme())}
      className={`relative h-10 w-10 overflow-hidden rounded-full border bg-background shadow-sm transition-all hover:opacity-80 ${className}`}
      aria-label="Cycle themes"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isDarkTheme ? (
          resolvedTheme === 'sunset' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
            </svg>
          ) : resolvedTheme === 'purple' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          )
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        )}
      </div>
      <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></span>
    </button>
  );
}
