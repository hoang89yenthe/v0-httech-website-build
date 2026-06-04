"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";

// 6:00–18:00 → sáng | 18:00–6:00 → tối
const DAY_START = 6;
const DAY_END   = 18;

export function getTimeTheme(): "light" | "dark" {
  const h = new Date().getHours();
  return h >= DAY_START && h < DAY_END ? "light" : "dark";
}

interface AutoThemeCtx {
  isAuto: boolean;
  setManualOverride: (theme: "light" | "dark") => void;
}

const Ctx = createContext<AutoThemeCtx>({
  isAuto: true,
  setManualOverride: () => {},
});

export function useAutoTheme() {
  return useContext(Ctx);
}

export function AutoThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [isAuto, setIsAuto] = useState(true);
  // Track the last boundary so we only flip when the boundary is crossed
  const lastBoundary = useRef<"light" | "dark">(getTimeTheme());

  // Apply time-based theme on first mount
  useEffect(() => {
    setTheme(lastBoundary.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll every 60 s; flip theme only when crossing 6:00 or 18:00
  useEffect(() => {
    const id = setInterval(() => {
      const next = getTimeTheme();
      if (next !== lastBoundary.current) {
        lastBoundary.current = next;
        setTheme(next);
        setIsAuto(true); // boundary crossed → reset any manual override
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [setTheme]);

  const setManualOverride = useCallback(
    (theme: "light" | "dark") => {
      setIsAuto(false);
      setTheme(theme);
    },
    [setTheme]
  );

  return (
    <Ctx.Provider value={{ isAuto, setManualOverride }}>
      {children}
    </Ctx.Provider>
  );
}
