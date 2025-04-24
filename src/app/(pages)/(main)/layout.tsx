import { Metadata } from "next";
import AIAssistant from "./components/ai-assistant";
import Main from "./components/main";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";

export const metadata: Metadata = {
  title: "Project Doe",
  description: "Project Doe",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted-300 min-h-screen">
      <Topbar />
      <div className="flex w-full gap-4">
        <Sidebar />
        <Main>{children}</Main>
        <AIAssistant />
      </div>
    </div>
  );
}
