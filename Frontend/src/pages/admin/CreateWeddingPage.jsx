import { HiOutlineCheckCircle, HiOutlineClipboardCopy, HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";
import { useInvitationForm, inputCls, labelCls, sectionTitle, cardCls } from "./useInvitationForm";

const CreateWeddingPage = () => {
  const {
    form, handleChange, isEditMode, loading, saving, error, success, copied,
    coverImagePreview, handleCoverImage, removeCoverImage,
    galleryPreviews, existingGallery, handleGalleryImages, removeGalleryImage, removeExistingGalleryImage,
    handleSubmit, copyUrl, currentTemplates,
    ceremonyTypes, dressCodes, backgroundMusicOptions, receptionTypes, API_BASE,
  } = useInvitationForm("wedding");

  if (loading) return <div className="p-8 text-[var(--color-text-muted)]">Loading invitation details...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          {isEditMode ? "Edit Wedding Invitation" : "Create Wedding Invitation"}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Design a beautiful digital wedding invitation card</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── LEFT COLUMN ────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className={cardCls}>
              <p className={sectionTitle}>📋 Basic Information</p>
              <div>
                <label className={labelCls}>Card ID (URL Slug)</label>
                <input name="cardId" value={form.cardId} onChange={handleChange} disabled={isEditMode} placeholder="e.g. john-and-jane" required className={`${inputCls} disabled:opacity-50`} />
              </div>
              <div>
                <label className={labelCls}>Template</label>
                <select name="templateId" value={form.templateId} onChange={handleChange} className={`${inputCls} outline-none`}>
                  {currentTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} — {t.desc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Couple Details */}
            <div className={cardCls}>
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
            <div className={cardCls}>
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

            {/* Ceremony, Dress Code & Reception */}
            <div className={cardCls}>
              <p className={sectionTitle}>⛪ Ceremony, Dress Code & Reception</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Ceremony Type</label>
                  <select name="ceremonyType" value={form.ceremonyType} onChange={handleChange} className={`${inputCls} outline-none`}>
                    {ceremonyTypes.map((c) => <option key={c.value} value={c.value}>{c.label}{c.description ? ` (${c.description})` : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Dress Code</label>
                  <select name="dressCode" value={form.dressCode} onChange={handleChange} className={`${inputCls} outline-none`}>
                    {dressCodes.map((d) => <option key={d.value} value={d.value}>{d.label}{d.description ? ` — ${d.description}` : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Reception</label>
                  <select name="receptionType" value={form.receptionType} onChange={handleChange} className={`${inputCls} outline-none`}>
                    {receptionTypes.map((r) => <option key={r.value} value={r.value}>{r.label}{r.description ? ` (${r.description})` : ""}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Background Music */}
            <div className={cardCls}>
              <p className={sectionTitle}>🎵 Background Music</p>
              <div>
                <label className={labelCls}>Select Music</label>
                <select name="backgroundMusic" value={form.backgroundMusic} onChange={handleChange} className={`${inputCls} outline-none`}>
                  <option value="">No Background Music</option>
                  {backgroundMusicOptions.map((a) => <option key={a.value} value={a.url}>{a.label}</option>)}
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

          {/* ── RIGHT COLUMN ───────────────────────────────────── */}
          <div className="space-y-6 mb-5">
            {/* Cover Image */}
            <div className={cardCls}>
              <p className={sectionTitle}>🖼️ Cover Image</p>
              <p className="text-xs text-[var(--color-text-light)] mb-3">Hero Section background. Recommended: 1920×1080px or larger.</p>
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

            {/* Gallery Images */}
            <div className={cardCls}>
              <p className={sectionTitle}>📸 Gallery Images</p>
              <p className="text-xs text-[var(--color-text-light)] mb-3">Upload up to 10 photos for the gallery section.</p>
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

            {/* Event Details */}
            <div className={cardCls}>
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
                  <input name="eventLocation" value={form.eventLocation} onChange={handleChange} required placeholder="Hotel Name" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Google Map Embed URL</label>
                  <input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} placeholder="Paste Google Maps embed URL here" className={inputCls} />
                  <p className="text-xs text-[var(--color-text-light)] mt-1">Go to Google Maps → Share → Embed a map → Copy the src URL</p>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>RSVP Deadline</label>
                  <input name="rsvpDeadline" type="date" value={form.rsvpDeadline} onChange={handleChange} className={inputCls} />
                  <p className="text-xs text-[var(--color-text-light)] mt-1">Last date for guests to respond (Optional)</p>
                </div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className={cardCls}>
              <label className={labelCls}>Welcome Text / Tagline</label>
              <textarea name="welcomeText" value={form.welcomeText} onChange={handleChange} rows={2} className="w-full px-4 py-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all resize-none" />
            </div>
          </div>
        </div>
          {error && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-error)]/8 border border-[var(--color-error)]/20">
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            </div>
          )}

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
                <button onClick={copyUrl} type="button" className="h-9 px-3 flex items-center gap-1.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-100)] transition-colors cursor-pointer">
                  <HiOutlineClipboardCopy />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

        {/* ── FULL-WIDTH SUBMIT AREA ─────────────────────────── */}
        <div className="mt-6 space-y-4">
          <button type="submit" disabled={saving} className="w-full h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer">
            {saving ? "Saving..." : isEditMode ? "Update Invitation" : "Create Invitation"}
          </button>

        
        </div>
      </form>
    </div>
  );
};

export default CreateWeddingPage;
