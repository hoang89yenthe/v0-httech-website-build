"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAutoTheme } from "@/components/auto-theme";

export function ThemeToggle() {
  const { resolvedTheme } = useTheme();
  const { isAuto, setManualOverride } = useAutoTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" aria-hidden="true" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setManualOverride(isDark ? "light" : "dark")}
      aria-label={
        isAuto
          ? `Tự động theo giờ — nhấn để chuyển sang chế độ ${isDark ? "sáng" : "tối"}`
          : isDark
          ? "Chuyển sang chế độ sáng"
          : "Chuyển sang chế độ tối"
      }
      title={
        isAuto
          ? "Tự động: sáng 6h–18h · tối 18h–6h"
          : "Đang ghi đè thủ công — tự reset lúc 6h hoặc 18h"
      }
      className="relative w-9 h-9 rounded-xl flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
    >
      {isDark ? (
        <Moon className="w-[18px] h-[18px]" />
      ) : (
        <Sun className="w-[18px] h-[18px]" />
      )}
      {/* Chấm xanh nhỏ = đang ở chế độ tự động */}
      <span
        aria-hidden="true"
        className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary transition-opacity duration-300 ${
          isAuto ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}
