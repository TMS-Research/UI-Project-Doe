import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import AIAssistant from "./components/ai-assistant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Doe",
  description: "Project Doe",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-secondary min-h-screen">
      <Topbar />
      <div className="flex w-full">
        <Sidebar />
        <main className="w-full pt-[62px] overflow-auto p-4 bg-secondary min-h-screen">{children}</main>
        <AIAssistant />
      </div>
    </div>
  );
}
