"use client";

import { useState } from "react";
import Account from "./components/Account";
import PersonalInfo from "./components/PersonalInfo";
import Preferences from "./components/Preferences";
import HelpSupport from "./components/HelpSupport";
import Privacy from "./components/Privacy";
import { User, Settings, FileText, HelpCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const menuItems = [
    { id: "account", label: "Account", icon: <User className="w-5 h-5" />, component: <Account /> },
    { id: "personal", label: "Personal Info", icon: <FileText className="w-5 h-5" />, component: <PersonalInfo /> },
    { id: "preferences", label: "Preferences", icon: <Settings className="w-5 h-5" />, component: <Preferences /> },
    { id: "help", label: "Help & Support", icon: <HelpCircle className="w-5 h-5" />, component: <HelpSupport /> },
    { id: "privacy", label: "Privacy", icon: <Lock className="w-5 h-5" />, component: <Privacy /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Settings</h1>
      <p className="text-gray-600 mb-6">Manage your account and preferences</p>

      <div className="flex gap-6">
        <div className="w-64 bg-white rounded-lg shadow p-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              variant={activeTab === item.id ? "light" : "ghost"}
              className={cn("w-full justify-start mb-2", activeTab === item.id ? "text-primary" : "text-black")}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="flex-1">{menuItems.find((item) => item.id === activeTab)?.component}</div>
      </div>
    </div>
  );
}
