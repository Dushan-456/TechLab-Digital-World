import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  HiOutlineUserAdd,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi";

const inputCls =
  "w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all";
const labelCls = "block text-sm font-medium text-[var(--color-text)] mb-1.5";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await API.post("users/register", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setSuccess(true);
    } catch (err) {
      console.error("User registration error:", err);
      const apiMsg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to create user.";
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-2"
          >
            <HiOutlineArrowLeft className="text-sm" /> Back to Users
          </Link>
          <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">
            Create New User
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Add a new administrator account with system access
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 sm:p-8">
        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
              <HiOutlineCheckCircle />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">User Created Successfully!</h3>
            <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
              Administrator account for <strong className="text-[var(--color-text)]">@{form.username}</strong> ({form.email}) has been registered.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setForm({
                    firstName: "",
                    lastName: "",
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
                className="px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text)] text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-surface-100)] transition-colors cursor-pointer"
              >
                Create Another
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all cursor-pointer"
              >
                View Users List
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-[var(--radius-md)] bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name *</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-base" />
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="e.g. John"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Last Name *</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-base" />
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Doe"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Username *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-sm font-medium">@</span>
                  <input
                    name="username"
                    type="text"
                    required
                    value={form.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={`${inputCls} pl-9`}
                  />
                </div>
                <p className="text-[11px] text-[var(--color-text-light)] mt-1">Alphanumeric, 3-30 characters</p>
              </div>

              <div>
                <label className={labelCls}>Email Address *</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-base" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Password *</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-base" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className={`${inputCls} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] cursor-pointer"
                  >
                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelCls}>Confirm Password *</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-base" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`${inputCls} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] cursor-pointer"
                  >
                    {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)]">
              <Link
                to="/admin/users"
                className="px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm font-medium rounded-[var(--radius-md)] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                <HiOutlineUserAdd className="text-lg" />
                {loading ? "Creating User..." : "Create Administrator"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateUserPage;
