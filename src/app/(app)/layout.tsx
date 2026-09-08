import { ReactNode } from "react";
import { SidebarNav } from "@/components/shell/SidebarNav";
import { Topbar } from "@/components/shell/Topbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <div className="animate-view-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
