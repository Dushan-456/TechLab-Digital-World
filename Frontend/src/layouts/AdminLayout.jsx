import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

// Map paths to page titles
const pageTitles = {
  "/admin": "Dashboard",
  "/admin/create": "Create Invitation",
  "/admin/invitations": "Manage Invitations",
  "/admin/settings": "Settings",
};

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className="transition-all duration-300 ease-[var(--ease-smooth)]"
        style={{
          marginLeft: isCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
        }}
      >
        {/* Header */}
        <AdminHeader isCollapsed={isCollapsed} pageTitle={pageTitle} />

        {/* Page Content */}
        <main
          className="p-6 min-h-screen mx-auto max-w-7xl"
          style={{ paddingTop: "calc(var(--header-height) + 24px)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
