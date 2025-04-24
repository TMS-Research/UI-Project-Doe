"use client";

import { cn } from "@/lib/utils";
import useLayoutStore from "@/stores/layout-store";

export default function Main({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <main
      className={cn("w-full pt-[62px] overflow-auto p-4 bg-muted-300 min-h-screen", isSidebarCollapsed ? "ml-0" : "")}
    >
      {children}
    </main>
  );
}
