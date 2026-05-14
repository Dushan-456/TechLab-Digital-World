import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { HiOutlineCheckCircle, HiOutlineClipboardCopy } from "react-icons/hi";

const templates = {
  wedding: [
    { id: "ethereal", name: "Ethereal", desc: "Ultra-minimalist, serif typography", color: "#b8a080" },
    { id: "lumina", name: "Lumina", desc: "Modern glassmorphism, frosted glass", color: "#a78bfa" },
    { id: "kinetic", name: "Kinetic", desc: "Dynamic, fluid motion", color: "#0ea5e9" },
    { id: "royalgold", name: "Royal Gold", desc: "Premium envelope reveal, personalized for guests", color: "#d4af37" },
  ],
  birthday: [
    { id: "joyful", name: "Joyful", desc: "Bright colors, fun animations", color: "#f472b6" },
  ],
  event: [
    { id: "corporate", name: "Corporate", desc: "Clean, professional layout", color: "#1e293b" },
  ]
};

const CreateInvitationPage = () => {
  const { type, cardId: editCardId } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!editCardId;
  const [invitationType, setInvitationType] = useState(type || "wedding");
  
  const [form, setForm] = useState({
    cardId: "",
    templateId: templates[type || "wedding"]?.[0]?.id || "ethereal",
    eventDate: "",
    eventLocation: "",
    welcomeText: "",
    brideName: "",
    groomName: "",
    celebrantName: "",
    age: "",
    eventName: "",
    organizer: "",
    description: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchInvitation = async () => {
        try {
          const { data } = await API.get(`/invitations/${editCardId}`);
          const inv = data.data;
          setInvitationType(inv.invitationType);
          setForm({
            cardId: inv.cardId,
            templateId: inv.templateId,
            eventDate: new Date(inv.event.date).toISOString().split('T')[0],
            eventLocation: inv.event.location,
            welcomeText: inv.content?.welcomeText || "",
            brideName: inv.couple?.bride || "",
            groomName: inv.couple?.groom || "",
            celebrantName: inv.celebrantName || "",
            age: inv.age || "",
            eventName: inv.eventName || "",
            organizer: inv.organizer || "",
            description: inv.description || "",
          });
        } catch (err) {
          setError("Failed to load invitation.");
        } finally {
          setLoading(false);
        }
      };
      fetchInvitation();
    } else {
      setInvitationType(type || "wedding");
      setForm(prev => ({ ...prev, templateId: templates[type || "wedding"]?.[0]?.id || "ethereal" }));
    }
  }, [editCardId, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setSaving(true);

    const payload = { ...form, invitationType };
    
    try {
      let data;
      if (isEditMode) {
        const res = await API.patch(`/invitations/${editCardId}`, payload);
        data = res.data;
      } else {
        const res = await API.post("/invitations", payload);
        data = res.data;
      }
      setSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error?.[0]?.message || "Failed to save invitation.");
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/v/${success?.data?.cardId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-[var(--color-text-muted)]">Loading invitation details...</div>;

  const currentTemplates = templates[invitationType] || templates.wedding;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)] capitalize">
          {isEditMode ? `Edit ${invitationType} Invitation` : `Create ${invitationType} Invitation`}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Design a beautiful digital invitation card</p>
      </div>

      {success && (
        <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)]/30 rounded-[var(--radius-lg)] p-5">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineCheckCircle className="text-[var(--color-accent)] text-xl" />
            <p className="text-sm font-semibold text-[var(--color-accent)]">Invitation Saved!</p>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-5">
        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-error)]/8 border border-[var(--color-error)]/20">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Card ID (URL Slug)</label>
          <input name="cardId" value={form.cardId} onChange={handleChange} disabled={isEditMode} placeholder="e.g. john-and-jane" required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all disabled:opacity-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Template</label>
          <select
            name="templateId"
            value={form.templateId}
            onChange={handleChange}
            className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all outline-none"
          >
            {currentTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.desc}
              </option>
            ))}
          </select>
        </div>

        {invitationType === "wedding" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Bride Name</label>
              <input name="brideName" value={form.brideName} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Groom Name</label>
              <input name="groomName" value={form.groomName} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
            </div>
          </div>
        )}

        {invitationType === "birthday" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Celebrant Name</label>
              <input name="celebrantName" value={form.celebrantName} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
            </div>
          </div>
        )}

        {invitationType === "event" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Event Name</label>
              <input name="eventName" value={form.eventName} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Organizer</label>
              <input name="organizer" value={form.organizer} onChange={handleChange} className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Event Date</label>
            <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Event Location</label>
            <input name="eventLocation" value={form.eventLocation} onChange={handleChange} required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Welcome Text / Tagline</label>
          <textarea name="welcomeText" value={form.welcomeText} onChange={handleChange} rows={2} className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" />
        </div>

        <button type="submit" disabled={saving} className="w-full h-11 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer">
          {saving ? "Saving..." : isEditMode ? "Update Invitation" : "Create Invitation"}
        </button>
      </form>
    </div>
  );
};

export default CreateInvitationPage;
