import { useAuth } from "../../contexts/AuthContext";
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck } from "react-icons/hi";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">Settings</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[var(--color-surface-50)] rounded-[var(--radius-md)]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white text-lg font-semibold">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">@{user?.username}</p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 px-4 py-3 border border-[var(--color-border)] rounded-[var(--radius-md)]">
              <HiOutlineMail className="text-lg text-[var(--color-text-muted)]" />
              <div>
                <p className="text-xs text-[var(--color-text-light)]">Email</p>
                <p className="text-sm text-[var(--color-text)]">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border border-[var(--color-border)] rounded-[var(--radius-md)]">
              <HiOutlineUser className="text-lg text-[var(--color-text-muted)]" />
              <div>
                <p className="text-xs text-[var(--color-text-light)]">Username</p>
                <p className="text-sm text-[var(--color-text)]">{user?.username || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border border-[var(--color-border)] rounded-[var(--radius-md)]">
              <HiOutlineShieldCheck className="text-lg text-[var(--color-text-muted)]" />
              <div>
                <p className="text-xs text-[var(--color-text-light)]">Role</p>
                <p className="text-sm text-[var(--color-text)]">{user?.role || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
