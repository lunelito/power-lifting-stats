"use client";
import React, { useState, useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.add(savedTheme);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}