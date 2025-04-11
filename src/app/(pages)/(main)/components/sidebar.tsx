"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Book, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <Home />, href: "/dashboard" },
    { name: "Courses", icon: <Book />, href: "/courses" },
    { name: "Messages", icon: <MessageCircle />, href: "/messages" },
    { name: "Settings", icon: <Settings />, href: "/settings" },
  ];

  return (
    <div className="w-64 h-full pt-[62px] text-primary-foreground flex flex-col border-r fixed bottom-0 left-0 z-40 bg-white">
      <ul className="flex-1 px-3 space-y-2 mt-4">
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
    </div>
  );
}
