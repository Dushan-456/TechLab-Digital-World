import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { HiOutlineCheckCircle, HiOutlineClipboardCopy, HiOutlineCloudUpload, HiOutlineUserCircle } from "react-icons/hi";

const templates = [
  { id: "modern", name: "Modern Pro", desc: "Sleek dark mode with glassmorphism", color: "#1e293b" },
  { id: "minimal", name: "Minimalist", desc: "Clean white design with focus on typography", color: "#f8fafc" },
  { id: "classic", name: "Classic Gold", desc: "Traditional layout with gold accents", color: "#d4af37" },
];

const CreateBusinessCardPage = () => {
  const { cardId: editCardId } = useParams();
  const isEditMode = !!editCardId;

  const [form, setForm] = useState({
    cardId: "",
    templateId: "modern",
    personalInfo: { fullName: "", jobTitle: "", company: "", bio: "", profilePic: "" },
    contactInfo: { email: "", phone: "", website: "", address: "" },
    socialLinks: { linkedin: "", twitter: "", github: "", instagram: "" },
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCard = async () => {
        try {
          const { data } = await API.get(`business-cards/${editCardId}`);
          const card = data.data;
          setForm({
            cardId: card.cardId,
            templateId: card.templateId || "modern",
            personalInfo: {
              fullName: card.personalInfo?.fullName || "",
              jobTitle: card.personalInfo?.jobTitle || "",
              company: card.personalInfo?.company || "",
              bio: card.personalInfo?.bio || "",
              profilePic: card.personalInfo?.profilePic || "",
            },
            contactInfo: {
              email: card.contactInfo?.email || "",
              phone: card.contactInfo?.phone || "",
              website: card.contactInfo?.website || "",
              address: card.contactInfo?.address || "",
            },
            socialLinks: {
              linkedin: card.socialLinks?.linkedin || "",
              twitter: card.socialLinks?.twitter || "",
              github: card.socialLinks?.github || "",
              instagram: card.socialLinks?.instagram || "",
            },
          });
        } catch (err) {
          setError("Failed to load business card.");
        } finally {
          setLoading(false);
        }
      };
      fetchCard();
    }
  }, [editCardId]);

  const handleChange = (section, field, value) => {
    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError("");

    try {
      const { data } = await API.post("upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleChange("personalInfo", "profilePic", data.imageUrl);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setSaving(true);

    try {
      let data;
      if (isEditMode) {
        const res = await API.patch(`business-cards/${editCardId}`, form);
        data = res.data;
      } else {
        const res = await API.post("business-cards", form);
        data = res.data;
      }
      setSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error?.[0]?.message || "Failed to save business card.");
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/b/${success?.data?.cardId}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url);
    } else {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-[var(--color-text-muted)]">Loading business card details...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">
          {isEditMode ? "Edit Business Card" : "Create Business Card"}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Design your professional digital identity</p>
      </div>

      {success && (
        <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)]/30 rounded-[var(--radius-lg)] p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineCheckCircle className="text-[var(--color-accent)] text-xl" />
            <p className="text-sm font-semibold text-[var(--color-accent)]">Business Card Saved!</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <code className="flex-1 text-sm bg-white px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text)]">
              {window.location.origin}/b/{success.data?.cardId}
            </code>
            <button onClick={copyUrl} className="h-9 px-3 flex items-center gap-1.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-100)] transition-colors cursor-pointer">
              <HiOutlineClipboardCopy />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-8">
        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-error)]/8 border border-[var(--color-error)]/20">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        {/* Template Selection */}
        <section className="space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Template</label>
          <select
            name="templateId"
            value={form.templateId}
            onChange={(e) => handleChange(null, "templateId", e.target.value)}
            className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all outline-none"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.desc}
              </option>
            ))}
          </select>
        </section>

        {/* Profile Pic & Slug */}
        <section className="space-y-5">
           <h3 className="font-semibold text-[var(--color-text)] border-b pb-2 text-sm uppercase tracking-wider">Identity</h3>
           <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Pic Upload */}
              <div className="flex flex-col items-center gap-3">
                 <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-100 overflow-hidden flex items-center justify-center relative group">
                    {form.personalInfo.profilePic ? (
                       <img src={import.meta.env.VITE_API_BASE_URL.split('/api/v1')[0] + form.personalInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <HiOutlineUserCircle className="text-gray-300 text-6xl" />
                    )}
                    {uploading && (
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                       </div>
                    )}
                 </div>
                 <label className="cursor-pointer group">
                    <span className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] flex items-center gap-1 transition-colors">
                       <HiOutlineCloudUpload />
                       {form.personalInfo.profilePic ? "Change Photo" : "Upload Photo"}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                 </label>
              </div>

              {/* Slug */}
              <div className="flex-1 w-full">
                 <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Card ID (URL Slug)</label>
                 <input value={form.cardId} onChange={(e) => handleChange(null, "cardId", e.target.value.toLowerCase().replace(/\s+/g, '-'))} disabled={isEditMode} placeholder="e.g. john-doe-pro" required className="w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all disabled:opacity-50" />
                 <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">Your card will be available at: /b/{form.cardId || '...'}</p>
              </div>
           </div>
        </section>

        {/* Personal Info */}
        <section className="space-y-4">
          <h3 className="font-semibold text-[var(--color-text)] border-b pb-2 text-sm uppercase tracking-wider">Professional Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full Name</label>
              <input value={form.personalInfo.fullName} onChange={(e) => handleChange("personalInfo", "fullName", e.target.value)} required className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:border-[var(--color-primary)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Job Title</label>
              <input value={form.personalInfo.jobTitle} onChange={(e) => handleChange("personalInfo", "jobTitle", e.target.value)} placeholder="e.g. Senior Software Engineer" className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:border-[var(--color-primary)] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Company</label>
              <input value={form.personalInfo.company} onChange={(e) => handleChange("personalInfo", "company", e.target.value)} placeholder="e.g. Tech Solutions Inc." className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:border-[var(--color-primary)] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Short Bio</label>
              <textarea value={form.personalInfo.bio} onChange={(e) => handleChange("personalInfo", "bio", e.target.value)} rows={3} placeholder="Tell people a bit about what you do..." className="w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] resize-none focus:border-[var(--color-primary)] outline-none" />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="space-y-4">
          <h3 className="font-semibold text-[var(--color-text)] border-b pb-2 text-sm uppercase tracking-wider">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Professional Email</label>
              <input type="email" value={form.contactInfo.email} onChange={(e) => handleChange("contactInfo", "email", e.target.value)} className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:border-[var(--color-primary)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Phone Number</label>
              <input value={form.contactInfo.phone} onChange={(e) => handleChange("contactInfo", "phone", e.target.value)} className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:border-[var(--color-primary)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Website</label>
              <input type="url" value={form.contactInfo.website} onChange={(e) => handleChange("contactInfo", "website", e.target.value)} placeholder="https://yourportfolio.com" className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:border-[var(--color-primary)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Location</label>
              <input value={form.contactInfo.address} onChange={(e) => handleChange("contactInfo", "address", e.target.value)} placeholder="e.g. New York, USA" className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] focus:border-[var(--color-primary)] outline-none" />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-4">
          <h3 className="font-semibold text-[var(--color-text)] border-b pb-2 text-sm uppercase tracking-wider">Social Presence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">LinkedIn Profile</label>
              <input type="url" value={form.socialLinks.linkedin} onChange={(e) => handleChange("socialLinks", "linkedin", e.target.value)} placeholder="https://linkedin.com/in/username" className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">GitHub Profile</label>
              <input type="url" value={form.socialLinks.github} onChange={(e) => handleChange("socialLinks", "github", e.target.value)} placeholder="https://github.com/username" className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Twitter / X</label>
              <input type="url" value={form.socialLinks.twitter} onChange={(e) => handleChange("socialLinks", "twitter", e.target.value)} placeholder="https://twitter.com/username" className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Instagram</label>
              <input type="url" value={form.socialLinks.instagram} onChange={(e) => handleChange("socialLinks", "instagram", e.target.value)} placeholder="https://instagram.com/username" className="w-full h-11 px-4 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)]" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={saving || uploading} className="w-full h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-lg)] hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer shadow-md">
          {saving ? "Saving Changes..." : isEditMode ? "Update Business Card" : "Create Business Card"}
        </button>
      </form>
    </div>
  );
};

export default CreateBusinessCardPage;
