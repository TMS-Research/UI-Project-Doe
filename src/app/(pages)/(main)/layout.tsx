import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <Sidebar />
      <main className="flex-1 ml-[16rem] mt-[62px] overflow-auto p-4 bg-secondary min-h-screen">{children}</main>
    </>
  );
}
