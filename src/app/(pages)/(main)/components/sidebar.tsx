"use client";

import useLayoutStore from "@/stores/layout-store";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Settings } from "lucide-react";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import SyllabusNavigation from "./syllabus-navigation";

export default function Sidebar() {
  const { sidebarContent, setSidebarContent } = useLayoutStore();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/courses") && pathname.includes("/learn")) {
      setSidebarContent("syllabus");
    } else {
      setSidebarContent("default");
    }
  }, [pathname, setSidebarContent]);

  return sidebarContent === "default" ? (
    <AnimatePresence>
      <DefaultSidebar />
    </AnimatePresence>
  ) : (
    <AnimatePresence>
      <SyllabusSidebar />
    </AnimatePresence>
  );
  // <div className="w-fit h-full border-r bg-white">
  // </div>
}

const DefaultSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <Home />, href: "/dashboard" },
    { name: "Courses", icon: <Book />, href: "/courses" },
    { name: "Messages", icon: <MessageCircle />, href: "/messages" },
    { name: "Settings", icon: <Settings />, href: "/settings" },
  ];

  return (
    <motion.div
      initial={{ width: "0px" }}
      animate={{ width: "16rem" }}
      exit={{ width: "0px" }}
      transition={{ duration: 0.3 }}
      className="h-screen overflow-hidden pt-[62px] text-primary-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-white flex-[0_0_auto]"
    >
      <ul className="px-3 space-y-2 mt-4 w-[16rem]">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Button
              asChild
              variant={pathname === item.href ? "light" : "ghost"}
              className={cn("w-full justify-start", pathname == item.href ? "text-primary" : "text-black")}
            >
              <Link
                href={item.href}
                className="flex items-center gap-2"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const SyllabusSidebar = () => {
  return (
    <motion.div
      initial={{ width: "0px" }}
      animate={{ width: "16rem" }}
      exit={{ width: "0px" }}
      transition={{ duration: 0.3 }}
      className="h-screen overflow-hidden pt-[62px] text-primary-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-white flex-[0_0_auto]"
    >
      <SyllabusNavigation />
    </motion.div>
  );
};
