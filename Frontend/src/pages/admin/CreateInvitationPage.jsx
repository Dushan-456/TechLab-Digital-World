import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { HiOutlineCheckCircle, HiOutlineClipboardCopy, HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

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

const CEREMONY_TYPES = [
  { value: 1, label: "Poruwa Ceremony (Traditional Sri Lankan)" },
  { value: 2, label: "Church Wedding (Christian)" },
  { value: 3, label: "Registry Wedding (Civil)" },
  { value: 4, label: "Hindu Wedding Ceremony" },
  { value: 5, label: "Muslim Nikah Ceremony" },
];

const DRESS_CODES = [
  { value: 1, label: "Formal — Black Tie / Evening Wear" },
  { value: 2, label: "Semi-Formal — Cocktail Attire" },
  { value: 3, label: "Casual — Relaxed & Comfortable" },
];

const AUDIO_OPTIONS = [
  { value: "", label: "No Background Music" },
  { value: "/audio/music1.mp3", label: "Romantic Piano (Music 1)" },
  { value: "/audio/music2.mp3", label: "Wedding March (Music 2)" },
  { value: "/audio/music3.mp3", label: "Wedding Bells (Music 3)" },
];

const CreateInvitationPage = () => {
  const { type, cardId: editCardId } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!editCardId;
  const [invitationType, setInvitationType] = useState(type || "wedding");
  
  const [form, setForm] = useState({
    cardId: "",
    templateId: templates[type || "wedding"]?.[0]?.id || "ethereal",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    mapEmbedUrl: "",
    welcomeText: "",
    brideName: "",
    groomName: "",
    brideParents: "",
    groomParents: "",
    ceremonyType: "1",
    dressCode: "1",
    backgroundMusic: "",
    celebrantName: "",
    age: "",
    eventName: "",
    organizer: "",
    description: "",
    rsvpDeadline: "",
  });

  // Image states
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchInvitation = async () => {
        try {
          const { data } = await API.get(`invitations/${editCardId}`);
          const inv = data.data;
          setInvitationType(inv.invitationType);
          setForm({
            cardId: inv.cardId,
            templateId: inv.templateId,
            eventDate: new Date(inv.event.date).toISOString().split('T')[0],
            eventTime: inv.event?.time || "",
            eventLocation: inv.event.location,
            mapEmbedUrl: inv.event?.mapEmbedUrl || "",
            welcomeText: inv.content?.welcomeText || "",
            brideName: inv.couple?.bride || "",
            groomName: inv.couple?.groom || "",
            brideParents: inv.parents?.brideParents || "",
            groomParents: inv.parents?.groomParents || "",
            ceremonyType: String(inv.ceremonyType || 1),
            dressCode: String(inv.dressCode || 1),
            backgroundMusic: inv.backgroundMusic || "",
            celebrantName: inv.celebrantName || "",
            age: inv.age || "",
            eventName: inv.eventName || "",
            organizer: inv.organizer || "",
            description: inv.description || "",
            rsvpDeadline: inv.rsvp?.deadline ? new Date(inv.rsvp.deadline).toISOString().split('T')[0] : "",
          });
          if (inv.coverImage) {
            setCoverImagePreview(`${API_BASE}${inv.coverImage}`);
          }
          if (inv.galleryImages?.length > 0) {
            setExistingGallery(inv.galleryImages);
          }
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

  // Cover image handler
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Cover image exceeds the 5MB size limit. Please upload a smaller image.");
        return;
      }
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
      setError(""); // clear error
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  // Gallery images handler
  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let hasOversized = false;

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        hasOversized = true;
      } else {
        validFiles.push(file);
      }
    });

    if (hasOversized) {
      setError("One or more gallery images exceed the 5MB limit and were skipped.");
    } else {
      setError("");
    }

    setGalleryFiles(prev => [...prev, ...validFiles]);
    const previews = validFiles.map(f => URL.createObjectURL(f));
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("invitationType", invitationType);

      // Append all text fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      // Append cover image
      if (coverImageFile) {
        payload.append("coverImage", coverImageFile);
      }

      // Append gallery images (new files only)
      galleryFiles.forEach(file => {
        payload.append("galleryImages", file);
      });

      let data;

      if (isEditMode) {
        const res = await API.patch(`invitations/${editCardId}`, payload);
        data = res.data;
      } else {
        const res = await API.post("invitations", payload);
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

  // Shared input class
  const inputCls = "w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all";
  const labelCls = "block text-sm font-medium text-[var(--color-text)] mb-1.5";
  const sectionTitle = "text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider pb-2 border-b border-[var(--color-border)] mb-4";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)] capitalize">
          {isEditMode ? `Edit ${invitationType} Invitation` : `Create ${invitationType} Invitation`}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Design a beautiful digital invitation card</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-6">
        {/* ── Basic Info ─────────────────────────────────── */}
        <div>
          <label className={labelCls}>Card ID (URL Slug)</label>
          <input name="cardId" value={form.cardId} onChange={handleChange} disabled={isEditMode} placeholder="e.g. john-and-jane" required className={`${inputCls} disabled:opacity-50`} />
        </div>

        <div>
          <label className={labelCls}>Template</label>
          <select name="templateId" value={form.templateId} onChange={handleChange} className={`${inputCls} outline-none`}>
            {currentTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.desc}
              </option>
            ))}
          </select>
        </div>

        {/* ── Wedding-Specific Fields ─────────────────────── */}
        {invitationType === "wedding" && (
          <>
            {/* Couple Names */}
            <div>
              <p className={sectionTitle}>💍 Couple Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Bride Name</label>
                  <input name="brideName" value={form.brideName} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Groom Name</label>
                  <input name="groomName" value={form.groomName} onChange={handleChange} required className={inputCls} />
                </div>
              </div>
            </div>

            {/* Parents */}
            <div>
              <p className={sectionTitle}>👨‍👩‍👧 Parents</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Bride's Parents</label>
                  <input name="brideParents" value={form.brideParents} onChange={handleChange} placeholder="e.g. Mr. & Mrs. Silva" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Groom's Parents</label>
                  <input name="groomParents" value={form.groomParents} onChange={handleChange} placeholder="e.g. Mr. & Mrs. Perera" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Ceremony Type & Dress Code Dropdowns */}
            <div>
              <p className={sectionTitle}>⛪ Ceremony & Dress Code</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Ceremony Type</label>
                  <select name="ceremonyType" value={form.ceremonyType} onChange={handleChange} className={`${inputCls} outline-none`}>
                    {CEREMONY_TYPES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Dress Code</label>
                  <select name="dressCode" value={form.dressCode} onChange={handleChange} className={`${inputCls} outline-none`}>
                    {DRESS_CODES.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Background Music Dropdown */}
            <div>
              <p className={sectionTitle}>🎵 Background Music</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Select Music</label>
                  <select name="backgroundMusic" value={form.backgroundMusic} onChange={handleChange} className={`${inputCls} outline-none`}>
                    {AUDIO_OPTIONS.map((audio) => (
                      <option key={audio.value} value={audio.value}>{audio.label}</option>
                    ))}
                  </select>
                </div>
                {form.backgroundMusic && (
                  <div className="p-4 bg-[var(--color-surface-50)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">Preview Selected Music:</p>
                    <audio src={`${API_BASE}${form.backgroundMusic}`} controls className="w-full h-10" />
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <p className={sectionTitle}>🖼️ Cover Image</p>
              <p className="text-xs text-[var(--color-text-light)] mb-3">This image will be used as the Hero Section background. Recommended: 1920×1080px or larger.</p>
              {coverImagePreview ? (
                <div className="relative rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] h-48">
                  <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeCoverImage} className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer">
                    <HiOutlineX className="text-sm" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-50)] transition-all">
                  <HiOutlinePhotograph className="text-3xl text-[var(--color-text-light)] mb-2" />
                  <span className="text-sm text-[var(--color-text-muted)]">Click to upload cover image</span>
                  <span className="text-xs text-[var(--color-text-light)] mt-1">JPG, PNG, WEBP — Max 5MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverImage} className="hidden" />
                </label>
              )}
            </div>

            {/* Gallery Images Upload */}
            <div>
              <p className={sectionTitle}>📸 Gallery Images</p>
              <p className="text-xs text-[var(--color-text-light)] mb-3">Upload up to 10 photos for the gallery section.</p>

              {/* Existing gallery thumbnails (edit mode) */}
              {existingGallery.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">Existing images:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {existingGallery.map((img, idx) => (
                      <div key={`existing-${idx}`} className="relative aspect-square rounded-[var(--radius-sm)] overflow-hidden border border-[var(--color-border)]">
                        <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingGalleryImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                          <HiOutlineX className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New gallery previews */}
              {galleryPreviews.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">New images to upload:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {galleryPreviews.map((preview, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square rounded-[var(--radius-sm)] overflow-hidden border border-[var(--color-primary)]/30">
                        <img src={preview} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                          <HiOutlineX className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-50)] transition-all">
                <HiOutlinePhotograph className="text-2xl text-[var(--color-text-light)] mb-1" />
                <span className="text-xs text-[var(--color-text-muted)]">Click to add gallery images</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryImages} className="hidden" />
              </label>
            </div>
          </>
        )}

        {/* ── Birthday-Specific Fields ────────────────────── */}
        {invitationType === "birthday" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Celebrant Name</label>
              <input name="celebrantName" value={form.celebrantName} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        )}

        {/* ── Event-Specific Fields ───────────────────────── */}
        {invitationType === "event" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Event Name</label>
              <input name="eventName" value={form.eventName} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Organizer</label>
              <input name="organizer" value={form.organizer} onChange={handleChange} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" />
            </div>
          </div>
        )}

        {/* ── Event Details (All Types) ───────────────────── */}
        <div>
          <p className={sectionTitle}>📅 Event Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Event Date</label>
              <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Event Time</label>
              <input name="eventTime" type="time" value={form.eventTime} onChange={handleChange} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Event Location</label>
              <input name="eventLocation" value={form.eventLocation} onChange={handleChange} required placeholder="e.g. Monarch Imperial, Kotte" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Google Map Embed URL</label>
              <input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} placeholder="Paste Google Maps embed URL here" className={inputCls} />
              <p className="text-xs text-[var(--color-text-light)] mt-1">Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code</p>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>RSVP Deadline</label>
              <input name="rsvpDeadline" type="date" value={form.rsvpDeadline} onChange={handleChange} className={inputCls} />
              <p className="text-xs text-[var(--color-text-light)] mt-1">Last date for guests to respond (Optional)</p>
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>Welcome Text / Tagline</label>
          <textarea name="welcomeText" value={form.welcomeText} onChange={handleChange} rows={2} className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" />
        </div>

        <button type="submit" disabled={saving} className="w-full h-11 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer">
          {saving ? "Saving..." : isEditMode ? "Update Invitation" : "Create Invitation"}
        </button>

        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-error)]/8 border border-[var(--color-error)]/20 mt-4">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)]/30 rounded-[var(--radius-lg)] p-5 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineCheckCircle className="text-[var(--color-accent)] text-xl" />
              <p className="text-sm font-semibold text-[var(--color-accent)]">Invitation Saved!</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <code className="flex-1 text-sm bg-white px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text)]">
                {window.location.origin}/v/{success.data?.cardId}
              </code>
              <button onClick={copyUrl} type="button" className="h-9 px-3 flex items-center gap-1.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-100)] transition-colors cursor-pointer">
                <HiOutlineClipboardCopy />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateInvitationPage;
