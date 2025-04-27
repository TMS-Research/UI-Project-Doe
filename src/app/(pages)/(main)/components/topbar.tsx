"use client";

import Link from "next/link";
import { useState } from "react";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useLayoutStore from "@/stores/layout-store";

export default function Topbar() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { toggleSidebar, isSidebarCollapsed, setSidebarContent } = useLayoutStore();

  const handleAvatarClick = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div className="flex items-center h-[62px] justify-between p-4 border-b fixed top-0 left-0 w-full z-50 bg-background">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="size-9"
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="!size-6" /> : <PanelLeftClose className="!size-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          asChild
          variant="ghost"
          onClick={() => setSidebarContent("default")}
          className="flex items-center gap-4 font-bold text-2xl"
        >
          <Link href="/dashboard">Logo</Link>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="w-8 h-8 rounded-full cursor-pointer bg-cover bg-center bg-primary"
          onClick={handleAvatarClick}
        />
      </div>
    </div>
  );
}
