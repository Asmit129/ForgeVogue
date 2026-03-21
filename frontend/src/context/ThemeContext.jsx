import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("fv:theme") || "dark");

  useEffect(() => {
    localStorage.setItem("fv:theme", theme);
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.add("theme-light");
    } else {
      html.classList.remove("theme-light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
