import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      <div className="lg:pl-60">

        <Topbar
          onMenuClick={openMobileSidebar}
        />

        <main className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}