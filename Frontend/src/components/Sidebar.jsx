import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineViewGrid,
  HiOutlinePlusCircle,
  HiOutlineCollection,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineHeart,
} from "react-icons/hi";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: HiOutlineViewGrid,
    end: true,
  },
  {
    label: "Create Invitation",
    path: "/admin/create",
    icon: HiOutlinePlusCircle,
  },
  {
    label: "Manage Cards",
    path: "/admin/invitations",
    icon: HiOutlineCollection,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: HiOutlineCog,
  },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 ease-[var(--ease-smooth)] ${
        isCollapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-width)]"
      }`}
      style={{
        background: "linear-gradient(180deg, var(--color-dark) 0%, var(--color-dark-50) 100%)",
      }}
    >
      {/* ── Logo Area ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 h-[var(--header-height)] border-b border-[var(--color-border-dark)]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
            <HiOutlineHeart className="text-white text-lg" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-sm font-semibold text-[var(--color-text-inverted)] font-[var(--font-display)] tracking-wide">
                Digital Wedding
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-inverted)] hover:bg-[var(--color-dark-200)] transition-all duration-200 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        >
          <HiOutlineChevronLeft className="text-base" />
        </button>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-all duration-200 relative ${
                  isActive
                    ? "bg-[var(--color-primary)]/15 text-[var(--color-primary-light)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverted)] hover:bg-[var(--color-dark-200)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-primary)] rounded-r-full" />
                  )}
                  <item.icon
                    className={`text-xl flex-shrink-0 ${
                      isActive ? "text-[var(--color-primary)]" : ""
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── User & Logout ──────────────────────────────────────────── */}
      <div className="p-3 border-t border-[var(--color-border-dark)]">
        {/* User info */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-[var(--color-text-inverted)] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-all duration-200"
        >
          <HiOutlineLogout className="text-xl flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
