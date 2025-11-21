"use client";
import React, { useState, useEffect } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      // Set default theme
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Update DOM
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    
    // Save to localStorage
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;