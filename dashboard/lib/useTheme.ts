"use client";

// lib/useTheme.ts — hook de alternância light / dark
// Persiste preferência em localStorage e aplica data-theme no <html>

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(t: Theme) {
  if (t === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("sancho-theme") as Theme | null;
    const initial: Theme = saved ?? "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("sancho-theme", next);
  };

  return { theme, isDark: theme === "dark", toggle };
}
