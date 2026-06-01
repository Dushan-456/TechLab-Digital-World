import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { getTemplatesByType, getDefaultTemplateId } from "../../templates/templateRegistry";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

export const useInvitationForm = (invitationType) => {
  const { cardId: editCardId } = useParams();
  const isEditMode = !!editCardId;

  const [form, setForm] = useState({
    cardId: "", templateId: getDefaultTemplateId(invitationType),
    eventDate: "", eventTime: "", eventLocation: "", mapEmbedUrl: "", welcomeText: "",
    brideName: "", groomName: "", brideParents: "", groomParents: "",
    ceremonyType: "1", dressCode: "1", receptionType: "1", backgroundMusic: "",
    celebrantName: "", age: "", eventName: "", organizer: "", description: "", rsvpDeadline: "",
  });

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
  const [ceremonyTypes, setCeremonyTypes] = useState([]);
  const [dressCodes, setDressCodes] = useState([]);
  const [backgroundMusicOptions, setBackgroundMusicOptions] = useState([]);
  const [receptionTypes, setReceptionTypes] = useState([]);

  useEffect(() => {
    const fetchCardSettings = async () => {
      try {
        const [ceremonyRes, dressRes, musicRes, receptionRes] = await Promise.all([
          API.get("card-settings?category=ceremonyType"),
          API.get("card-settings?category=dressCode"),
          API.get("card-settings?category=backgroundMusic"),
          API.get("card-settings?category=receptionType"),
        ]);
        setCeremonyTypes(ceremonyRes.data.data);
        setDressCodes(dressRes.data.data);
        setBackgroundMusicOptions(musicRes.data.data);
        setReceptionTypes(receptionRes.data.data);
      } catch (err) {
        console.error("Failed to load card settings:", err);
      }
    };
    fetchCardSettings();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchInvitation = async () => {
      try {
        const { data } = await API.get(`invitations/${editCardId}`);
        const inv = data.data;
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
      } catch {
        setError("Failed to load invitation.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [editCardId]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Cover image exceeds the 5MB size limit."); return; }
    setCoverImageFile(file); setCoverImagePreview(URL.createObjectURL(file)); setError("");
  };
  const removeCoverImage = () => { setCoverImageFile(null); setCoverImagePreview(null); };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    const valid = []; let oversized = false;
    files.forEach((f) => (f.size > 5 * 1024 * 1024 ? (oversized = true) : valid.push(f)));
    setError(oversized ? "Some images exceed 5MB and were skipped." : "");
    setGalleryFiles((p) => [...p, ...valid]);
    setGalleryPreviews((p) => [...p, ...valid.map((f) => URL.createObjectURL(f))]);
  };
  const removeGalleryImage = (i) => {
    setGalleryFiles((p) => p.filter((_, idx) => idx !== i));
    setGalleryPreviews((p) => p.filter((_, idx) => idx !== i));
  };
  const removeExistingGalleryImage = (i) => setExistingGallery((p) => p.filter((_, idx) => idx !== i));

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
      const res = isEditMode
        ? await API.patch(`invitations/${editCardId}`, payload)
        : await API.post("invitations", payload);
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error?.[0]?.message || "Failed to save invitation.");
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

  return {
    form, handleChange, isEditMode, loading, saving, error, success, copied,
    coverImagePreview, handleCoverImage, removeCoverImage,
    galleryPreviews, existingGallery, handleGalleryImages, removeGalleryImage, removeExistingGalleryImage,
    handleSubmit, copyUrl, currentTemplates: getTemplatesByType(invitationType),
    ceremonyTypes, dressCodes, backgroundMusicOptions, receptionTypes, API_BASE,
  };
};

// Shared CSS classes
export const inputCls = "w-full h-11 px-4 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all";
export const labelCls = "block text-sm font-medium text-[var(--color-text)] mb-1.5";
export const sectionTitle = "text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider pb-2 border-b border-[var(--color-border)] mb-4";
export const cardCls = "bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 space-y-5";
