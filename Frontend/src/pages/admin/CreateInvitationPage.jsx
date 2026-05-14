import { useState } from "react";
import API from "../../services/api";
import { HiOutlineCheckCircle, HiOutlineClipboardCopy } from "react-icons/hi";

const templates = [
  { id: "ethereal", name: "Ethereal", desc: "Ultra-minimalist, serif typography, soft earthy tones", color: "#b8a080" },
  { id: "lumina", name: "Lumina", desc: "Modern glassmorphism, frosted glass, subtle gradients", color: "#a78bfa" },
  { id: "kinetic", name: "Kinetic", desc: "Dynamic, fluid motion, deep calming colors", color: "#0ea5e9" },
];

const CreateInvitationPage = () => {
  const [form, setForm] = useState({
    cardId: "",
    templateId: "ethereal",
    brideName: "",
    groomName: "",
    eventDate: "",
    eventLocation: "",
    welcomeText: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      const { data } = await API.post("/invitations", form);
      setSuccess(data);
      setForm({ cardId: "", templateId: "ethereal", brideName: "", groomName: "", eventDate: "", eventLocation: "", welcomeText: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error?.[0]?.message || "Failed to create invitation.");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/v/${success?.data?.cardId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">Create Invitation</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Design a beautiful wedding invitation card</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)]/30 rounded-[var(--radius-lg)] p-5">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineCheckCircle className="text-[var(--color-accent)] text-xl" />
            <p className="text-sm font-semibold text-[var(--color-accent)]">Invitation Created!</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <code className="flex-1 text-sm bg-white px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text)]">
              {window.location.origin}/v/{success.data?.cardId}
            </code>
            <button onClick={copyUrl} className="h-9 px-3 flex items-center gap-1.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-100)] transition-colors cursor-pointer">
              <HiOutlineClipboardCopy />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-5">
        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-error)]/8 border border-[var(--color-error)]/20">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        {/* Card ID */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Card ID (URL Slug)</label>
          <input id="input-card-id" name="cardId" value={form.cardId} onChange={handleChange} placeholder="e.g. john-and-jane" required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
          <p className="text-xs text-[var(--color-text-light)] mt-1">This will be the URL: /v/{form.cardId || "your-slug"}</p>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Template</label>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((t) => (
              <button key={t.id} type="button" onClick={() => setForm((prev) => ({ ...prev, templateId: t.id }))}
                className={`p-4 rounded-[var(--radius-md)] border-2 text-left transition-all cursor-pointer ${form.templateId === t.id ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]/30" : "border-[var(--color-border)] hover:border-[var(--color-text-light)]"}`}>
                <div className="w-8 h-8 rounded-full mb-2" style={{ background: t.color }} />
                <p className="text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Names Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Bride Name</label>
            <input id="input-bride" name="brideName" value={form.brideName} onChange={handleChange} placeholder="Bride's name" required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Groom Name</label>
            <input id="input-groom" name="groomName" value={form.groomName} onChange={handleChange} placeholder="Groom's name" required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
          </div>
        </div>

        {/* Event Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Event Date</label>
            <input id="input-date" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Event Location</label>
            <input id="input-location" name="eventLocation" value={form.eventLocation} onChange={handleChange} placeholder="Venue & city" required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
          </div>
        </div>

        {/* Welcome Text */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Welcome Text (Optional)</label>
          <textarea id="input-welcome" name="welcomeText" value={form.welcomeText} onChange={handleChange} rows={3} placeholder="Together with their families, request the pleasure of your company" className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" />
        </div>

        {/* Submit */}
        <button id="submit-invitation" type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer">
          {loading ? "Creating..." : "Create Invitation"}
        </button>
      </form>
    </div>
  );
};

export default CreateInvitationPage;
