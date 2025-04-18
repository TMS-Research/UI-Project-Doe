"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useLayoutStore from "@/stores/layout-store";
import { Book, BookOpen, FileText, Home, Link2, List, Settings, Trophy, Video } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import SyllabusStepper from "./syllabus-stepper";

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
}

const DefaultSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <Home />, href: "/dashboard" },
    { name: "Courses", icon: <Book />, href: "/courses" },
    { name: "Leaderboard", icon: <Trophy />, href: "/leaderboard" },
    { name: "Settings", icon: <Settings />, href: "/settings" },
  ];

  return (
    <motion.div
      initial={{ width: "0px" }}
      animate={{ width: "16rem" }}
      exit={{ width: "0px" }}
      transition={{ duration: 0.3 }}
      className="h-screen overflow-hidden pt-[62px] text-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-background flex-[0_0_auto]"
    >
      <ul className="px-3 space-y-2 mt-4 w-[16rem]">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Button
              asChild
              variant={pathname === item.href ? "light" : "ghost"}
              className={cn("w-full justify-start", pathname == item.href ? "text-primary" : "text-foreground")}
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
      animate={{ width: "20rem" }}
      exit={{ width: "0px" }}
      transition={{ duration: 0.3 }}
      className="h-screen overflow-hidden pt-[62px] text-primary-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-background flex-[0_0_auto]"
    >
      {/* Top section - Syllabus Navigation */}
      <SyllabusStepper />

      {/* Bottom section - Resources */}
      <div className="p-4 border-t">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search resources..."
              className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                >
                  <List className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Resources</h4>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Course Notes
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Video Lectures
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Reading Materials
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      External Links
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
