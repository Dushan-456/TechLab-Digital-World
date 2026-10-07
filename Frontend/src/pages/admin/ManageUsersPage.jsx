import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi";

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("users");
      setUsers(data.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setFeedback({ type: "error", message: "Failed to load users list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userToDelete) => {
    if (userToDelete._id === currentUser?._id) {
      alert("You cannot delete your own account.");
      return;
    }

    const confirmMsg = `Are you sure you want to delete user "${userToDelete.username}" (${userToDelete.email})? This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    setDeletingId(userToDelete._id);
    setFeedback({ type: "", message: "" });

    try {
      await API.delete(`users/${userToDelete._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setFeedback({ type: "success", message: `User "${userToDelete.username}" was deleted successfully.` });
    } catch (err) {
      console.error("Error deleting user:", err);
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to delete user.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">
            Manage Users
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {filteredUsers.length} user account{filteredUsers.length !== 1 ? "s" : ""} registered in the system
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-base" />
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg text-sm w-full sm:w-72 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <Link
            to="/admin/users/create"
            className="flex items-center justify-center gap-2 h-10 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all"
          >
            <HiOutlineUserAdd className="text-lg" />
            Create User
          </Link>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback.message && (
        <div
          className={`p-4 rounded-[var(--radius-md)] border text-sm flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback({ type: "", message: "" })}
            className="text-xs uppercase font-bold tracking-wider opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3.5 bg-[var(--color-surface-50)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Created Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredUsers.map((u) => {
              const isSelf = u._id === currentUser?._id;
              const initials = `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "U";

              return (
                <div
                  key={u._id}
                  className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-start md:items-center hover:bg-[var(--color-surface-50)] transition-colors"
                >
                  {/* User Profile */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate flex items-center gap-2">
                        {u.firstName} {u.lastName}
                        {isSelf && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">@{u.username}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <HiOutlineMail className="text-base text-[var(--color-text-light)] shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <HiOutlineShieldCheck className="text-sm" />
                      {u.role || "USER"}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-xs text-[var(--color-text-muted)]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end w-full md:w-auto">
                    {isSelf ? (
                      <span className="text-xs text-[var(--color-text-light)] italic">—</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u._id}
                        title="Delete user"
                        className="w-8 h-8 rounded-md flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <HiOutlineTrash className="text-lg" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <HiOutlineUser className="mx-auto text-4xl text-[var(--color-text-light)] mb-3" />
            <p className="text-sm font-semibold text-[var(--color-text)]">No users found</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {searchQuery ? "Try refining your search keyword." : "Get started by creating your first administrator account."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
