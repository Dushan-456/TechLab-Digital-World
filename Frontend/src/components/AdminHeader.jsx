import { HiOutlineSearch, HiOutlineBell } from "react-icons/hi";

const AdminHeader = ({ isCollapsed, pageTitle }) => {
  return (
    <header
      className="fixed top-0 right-0 z-30 h-[var(--header-height)] flex items-center justify-between px-6 transition-all duration-300 ease-[var(--ease-smooth)] border-b border-[var(--color-border)]"
      style={{
        left: isCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
        backgroundColor: "rgba(249, 246, 243, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-semibold text-[var(--color-text)] font-[var(--font-display)]">
          {pageTitle || "Dashboard"}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-base" />
          <input
            type="text"
            placeholder="Search..."
            className="w-52 h-9 pl-9 pr-4 text-sm bg-[var(--color-surface-100)] border border-[var(--color-border)] rounded-[var(--radius-full)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-100)] transition-colors">
          <HiOutlineBell className="text-xl text-[var(--color-text-muted)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary)] rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
