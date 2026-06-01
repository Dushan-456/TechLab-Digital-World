import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { HiOutlineCheckCircle, HiOutlineClipboardCopy, HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";
import { getTemplatesByType, getDefaultTemplateId } from "../../templates/templateRegistry";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const EditInvitationPage = () => {
  const { cardId: editCardId } = useParams();
  const [invitationType, setInvitationType] = useState("wedding");
  const [form, setForm] = useState({
    cardId: "", templateId: "", eventDate: "", eventTime: "", eventLocation: "",
    mapEmbedUrl: "", welcomeText: "", brideName: "", groomName: "",
    brideParents: "", groomParents: "", ceremonyType: "1", dressCode: "1",
    receptionType: "1", backgroundMusic: "", celebrantName: "", age: "",
    eventName: "", organizer: "", description: "", rsvpDeadline: "",
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [ceremonyTypes, setCeremonyTypes] = useState([]);
  const [dressCodes, setDressCodes] = useState([]);
  const [backgroundMusicOptions, setBackgroundMusicOptions] = useState([]);
  const [receptionTypes, setReceptionTypes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [ceremonyRes, dressRes, musicRes, receptionRes] = await Promise.all([
          API.get("card-settings?category=ceremonyType"), API.get("card-settings?category=dressCode"),
          API.get("card-settings?category=backgroundMusic"), API.get("card-settings?category=receptionType"),
        ]);
        setCeremonyTypes(ceremonyRes.data.data); setDressCodes(dressRes.data.data);
        setBackgroundMusicOptions(musicRes.data.data); setReceptionTypes(receptionRes.data.data);
      } catch (err) { console.error("Failed to load card settings:", err); }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!editCardId) return;
    const fetchInvitation = async () => {
      try {
        const { data } = await API.get(`invitations/${editCardId}`);
        const inv = data.data;
        setInvitationType(inv.invitationType);
        setForm({
          cardId: inv.cardId, templateId: inv.templateId,
          eventDate: new Date(inv.event.date).toISOString().split("T")[0],
          eventTime: inv.event?.time || "", eventLocation: inv.event.location,
          mapEmbedUrl: inv.event?.mapEmbedUrl || "", welcomeText: inv.content?.welcomeText || "",
          brideName: inv.couple?.bride || "", groomName: inv.couple?.groom || "",
          brideParents: inv.parents?.brideParents || "", groomParents: inv.parents?.groomParents || "",
          ceremonyType: String(inv.ceremonyType || 1), dressCode: String(inv.dressCode || 1),
          receptionType: String(inv.receptionType || 1), backgroundMusic: inv.backgroundMusic || "",
          celebrantName: inv.celebrantName || "", age: inv.age || "",
          eventName: inv.eventName || "", organizer: inv.organizer || "",
          description: inv.description || "",
          rsvpDeadline: inv.rsvp?.deadline ? new Date(inv.rsvp.deadline).toISOString().split("T")[0] : "",
        });
        if (inv.coverImage) setCoverImagePreview(`${API_BASE}${inv.coverImage}`);
        if (inv.galleryImages?.length > 0) setExistingGallery(inv.galleryImages);
      } catch { setError("Failed to load invitation."); }
      finally { setLoading(false); }
    };
    fetchInvitation();
  }, [editCardId]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleCoverImage = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Cover image exceeds 5MB."); return; }
    setCoverImageFile(file); setCoverImagePreview(URL.createObjectURL(file)); setError("");
  };
  const removeCoverImage = () => { setCoverImageFile(null); setCoverImagePreview(null); };
  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files); const valid = []; let big = false;
    files.forEach((f) => (f.size > 5 * 1024 * 1024 ? (big = true) : valid.push(f)));
    setError(big ? "Some images exceed 5MB and were skipped." : "");
    setGalleryFiles((p) => [...p, ...valid]);
    setGalleryPreviews((p) => [...p, ...valid.map((f) => URL.createObjectURL(f))]);
  };
  const removeGalleryImage = (i) => { setGalleryFiles((p) => p.filter((_, x) => x !== i)); setGalleryPreviews((p) => p.filter((_, x) => x !== i)); };
  const removeExistingGalleryImage = (i) => setExistingGallery((p) => p.filter((_, x) => x !== i));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess(null); setSaving(true);
    try {
      const payload = new FormData();
      payload.append("invitationType", invitationType);
      Object.entries(form).forEach(([k, v]) => { if (v !== "" && v != null) payload.append(k, v); });
      if (coverImageFile) {
        payload.append("coverImage", coverImageFile);
      } else if (!coverImagePreview) {
        payload.append("removeCoverImage", "true");
      }
      payload.append("existingGallery", JSON.stringify(existingGallery));
      galleryFiles.forEach((f) => payload.append("galleryImages", f));
      const res = await API.patch(`invitations/${editCardId}`, payload);
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error?.[0]?.message || "Failed to save.");
    } finally { setSaving(false); }
  };
  const copyUrl = () => {
    const text = `${window.location.origin}/v/${success?.data?.cardId}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-[var(--color-text-muted)]">Loading invitation details...</div>;

  const currentTemplates = getTemplatesByType(invitationType);
  const inputCls = "w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all";
  const labelCls = "block text-sm font-medium text-[var(--color-text)] mb-1.5";
  const sectionTitle = "text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider pb-2 border-b border-[var(--color-border)] mb-4";
  const cardCls = "bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-5";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] capitalize">Edit {invitationType} Invitation</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Update your digital invitation card</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 mb-5 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className={cardCls}>
              <p className={sectionTitle}>📋 Basic Information</p>
              <div>
                <label className={labelCls}>Card ID (URL Slug)</label>
                <input name="cardId" value={form.cardId} disabled className={`${inputCls} disabled:opacity-50`} />
              </div>
              <div>
                <label className={labelCls}>Template</label>
                <select name="templateId" value={form.templateId} onChange={handleChange} className={`${inputCls} outline-none`}>
                  {currentTemplates.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.desc}</option>)}
                </select>
              </div>
            </div>

            {/* Wedding Fields */}
            {invitationType === "wedding" && (
              <>
                <div className={cardCls}>
                  <p className={sectionTitle}>💍 Couple Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Bride Name</label><input name="brideName" value={form.brideName} onChange={handleChange} required className={inputCls} /></div>
                    <div><label className={labelCls}>Groom Name</label><input name="groomName" value={form.groomName} onChange={handleChange} required className={inputCls} /></div>
                  </div>
                </div>
                <div className={cardCls}>
                  <p className={sectionTitle}>👨‍👩‍👧 Parents</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Bride's Parents</label><input name="brideParents" value={form.brideParents} onChange={handleChange} placeholder="e.g. Mr. & Mrs. Silva" className={inputCls} /></div>
                    <div><label className={labelCls}>Groom's Parents</label><input name="groomParents" value={form.groomParents} onChange={handleChange} placeholder="e.g. Mr. & Mrs. Perera" className={inputCls} /></div>
                  </div>
                </div>
                <div className={cardCls}>
                  <p className={sectionTitle}>⛪ Ceremony, Dress Code & Reception</p>
                  <div className="space-y-4">
                    <div><label className={labelCls}>Ceremony Type</label><select name="ceremonyType" value={form.ceremonyType} onChange={handleChange} className={`${inputCls} outline-none`}>{ceremonyTypes.map((c) => <option key={c.value} value={c.value}>{c.label}{c.description ? ` (${c.description})` : ""}</option>)}</select></div>
                    <div><label className={labelCls}>Dress Code</label><select name="dressCode" value={form.dressCode} onChange={handleChange} className={`${inputCls} outline-none`}>{dressCodes.map((d) => <option key={d.value} value={d.value}>{d.label}{d.description ? ` — ${d.description}` : ""}</option>)}</select></div>
                    <div><label className={labelCls}>Reception</label><select name="receptionType" value={form.receptionType} onChange={handleChange} className={`${inputCls} outline-none`}>{receptionTypes.map((r) => <option key={r.value} value={r.value}>{r.label}{r.description ? ` (${r.description})` : ""}</option>)}</select></div>
                  </div>
                </div>
                <div className={cardCls}>
                  <p className={sectionTitle}>🎵 Background Music</p>
                  <div><label className={labelCls}>Select Music</label><select name="backgroundMusic" value={form.backgroundMusic} onChange={handleChange} className={`${inputCls} outline-none`}><option value="">No Background Music</option>{backgroundMusicOptions.map((a) => <option key={a.value} value={a.url}>{a.label}</option>)}</select></div>
                  {form.backgroundMusic && (<div className="p-4 bg-[var(--color-surface-50)] rounded-[var(--radius-md)] border border-[var(--color-border)]"><p className="text-xs text-[var(--color-text-muted)] mb-2">Preview:</p><audio src={`${API_BASE}${form.backgroundMusic}`} controls className="w-full h-10" /></div>)}
                </div>
              </>
            )}

            {/* Birthday Fields */}
            {invitationType === "birthday" && (
              <div className={cardCls}>
                <p className={sectionTitle}>🎂 Celebrant Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Celebrant Name</label><input name="celebrantName" value={form.celebrantName} onChange={handleChange} required className={inputCls} /></div>
                  <div><label className={labelCls}>Age</label><input type="number" name="age" value={form.age} onChange={handleChange} className={inputCls} /></div>
                </div>
              </div>
            )}

            {/* Event Fields */}
            {invitationType === "event" && (
              <div className={cardCls}>
                <p className={sectionTitle}>🎪 Event Information</p>
                <div className="space-y-4">
                  <div><label className={labelCls}>Event Name</label><input name="eventName" value={form.eventName} onChange={handleChange} required className={inputCls} /></div>
                  <div><label className={labelCls}>Organizer</label><input name="organizer" value={form.organizer} onChange={handleChange} className={inputCls} /></div>
                  <div><label className={labelCls}>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" /></div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6 mb-5">
            {/* Cover Image */}
            <div className={cardCls}>
              <p className={sectionTitle}>🖼️ Cover Image</p>
              <p className="text-xs text-[var(--color-text-light)] mb-3">Recommended: 1920×1080px or larger.</p>
              {coverImagePreview ? (
                <div className="relative rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] h-48">
                  <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeCoverImage} className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"><HiOutlineX className="text-sm" /></button>
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

            {/* Gallery Images (wedding only) */}
            {invitationType === "wedding" && (
              <div className={cardCls}>
                <p className={sectionTitle}>📸 Gallery Images</p>
                {existingGallery.length > 0 && (
                  <div className="mb-3"><p className="text-xs text-[var(--color-text-muted)] mb-2">Existing:</p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">{existingGallery.map((img, i) => (
                      <div key={`e-${i}`} className="relative aspect-square rounded-[var(--radius-sm)] overflow-hidden border border-[var(--color-border)]">
                        <img src={`${API_BASE}${img}`} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingGalleryImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><HiOutlineX className="text-xs" /></button>
                      </div>))}</div></div>
                )}
                {galleryPreviews.length > 0 && (
                  <div className="mb-3"><p className="text-xs text-[var(--color-text-muted)] mb-2">New:</p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">{galleryPreviews.map((p, i) => (
                      <div key={`n-${i}`} className="relative aspect-square rounded-[var(--radius-sm)] overflow-hidden border border-[var(--color-primary)]/30">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><HiOutlineX className="text-xs" /></button>
                      </div>))}</div></div>
                )}
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-50)] transition-all">
                  <HiOutlinePhotograph className="text-2xl text-[var(--color-text-light)] mb-1" />
                  <span className="text-xs text-[var(--color-text-muted)]">Click to add gallery images</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryImages} className="hidden" />
                </label>
              </div>
            )}

            {/* Event Details */}
            <div className={cardCls}>
              <p className={sectionTitle}>📅 Event Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Event Date</label><input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className={inputCls} /></div>
                <div><label className={labelCls}>Event Time</label><input name="eventTime" type="time" value={form.eventTime} onChange={handleChange} className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>Event Location</label><input name="eventLocation" value={form.eventLocation} onChange={handleChange} required className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>Google Map Embed URL</label><input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>RSVP Deadline</label><input name="rsvpDeadline" type="date" value={form.rsvpDeadline} onChange={handleChange} className={inputCls} /></div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className={cardCls}>
              <label className={labelCls}>Welcome Text / Tagline</label>
              <textarea name="welcomeText" value={form.welcomeText} onChange={handleChange} rows={2} className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" />
            </div>
          </div>
        </div>

        {/* ── FULL-WIDTH FOOTER ── */}
        {error && (<div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-error)]/8 border border-[var(--color-error)]/20 mb-4"><p className="text-sm text-[var(--color-error)]">{error}</p></div>)}
        {success && (
          <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)]/30 rounded-[var(--radius-lg)] p-5 mb-4">
            <div className="flex items-center gap-2 mb-2"><HiOutlineCheckCircle className="text-[var(--color-accent)] text-xl" /><p className="text-sm font-semibold text-[var(--color-accent)]">Invitation Updated!</p></div>
            <div className="flex items-center gap-2 mt-2">
              <code className="flex-1 text-sm bg-white px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text)]">{window.location.origin}/v/{success.data?.cardId}</code>
              <button onClick={copyUrl} type="button" className="h-9 px-3 flex items-center gap-1.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-100)] transition-colors cursor-pointer"><HiOutlineClipboardCopy />{copied ? "Copied!" : "Copy"}</button>
            </div>
          </div>
        )}
        <div className="mt-6">
          <button type="submit" disabled={saving} className="w-full h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer">
            {saving ? "Saving..." : "Update Invitation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInvitationPage;
