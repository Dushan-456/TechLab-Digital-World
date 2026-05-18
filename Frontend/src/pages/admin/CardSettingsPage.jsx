import { useState, useEffect } from "react";
import API from "../../services/api";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from "react-icons/hi";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const CardSettingsPage = () => {
  const [ceremonyTypes, setCeremonyTypes] = useState([]);
  const [dressCodes, setDressCodes] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState([]);
  const [receptionTypes, setReceptionTypes] = useState([]);
  
  const [activeTab, setActiveTab] = useState("weddings");
  const tabs = [
    { id: "weddings", label: "Weddings", icon: "💍" },
    { id: "birthdays", label: "Birthdays", icon: "🎂" },
    { id: "events", label: "Events", icon: "🎉" },
    { id: "business", label: "Business Cards", icon: "💼" },
  ];

  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Add form states
  const [addCeremony, setAddCeremony] = useState({ open: false, label: "", description: "" });
  const [addDress, setAddDress] = useState({ open: false, label: "", description: "" });
  const [addMusic, setAddMusic] = useState({ open: false, label: "", description: "", file: null });
  const [addReception, setAddReception] = useState({ open: false, label: "", description: "" });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ label: "", description: "" });

  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Saving state
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const [ceremonyRes, dressRes, musicRes, receptionRes] = await Promise.all([
        API.get("card-settings?category=ceremonyType"),
        API.get("card-settings?category=dressCode"),
        API.get("card-settings?category=backgroundMusic"),
        API.get("card-settings?category=receptionType"),
      ]);
      setCeremonyTypes(ceremonyRes.data.data);
      setDressCodes(dressRes.data.data);
      setBackgroundMusic(musicRes.data.data);
      setReceptionTypes(receptionRes.data.data);
    } catch (err) {
      setError("Failed to load card settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ── Seed Initial Data ─────────────────────────────────────
  const handleSeed = async () => {
    setSeeding(true);
    setError("");
    try {
      const { data } = await API.post("card-settings/seed");
      showSuccess(data.message);
      await fetchSettings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to seed settings.");
    } finally {
      setSeeding(false);
    }
  };

  // ── Create ────────────────────────────────────────────────
  const handleCreate = async (category) => {
    let formState;
    if (category === "ceremonyType") formState = addCeremony;
    else if (category === "dressCode") formState = addDress;
    else if (category === "backgroundMusic") formState = addMusic;
    else formState = addReception;

    if (!formState.label.trim()) return;

    setSaving(true);
    setError("");
    try {
      let audioUrl = "";
      
      if (category === "backgroundMusic") {
        if (!formState.file) throw new Error("Audio file is required for Background Music.");
        
        const formData = new FormData();
        formData.append("audio", formState.file);
        const uploadRes = await API.post("/upload-audio", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        audioUrl = uploadRes.data.audioUrl;
      }

      await API.post("card-settings", {
        category,
        label: formState.label.trim(),
        description: formState.description?.trim() || "",
        url: audioUrl,
      });

      if (category === "ceremonyType") setAddCeremony({ open: false, label: "", description: "" });
      else if (category === "dressCode") setAddDress({ open: false, label: "", description: "" });
      else if (category === "backgroundMusic") setAddMusic({ open: false, label: "", description: "", file: null });
      else setAddReception({ open: false, label: "", description: "" });

      showSuccess(`Setting added successfully!`);
      await fetchSettings();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create setting.");
    } finally {
      setSaving(false);
    }
  };

  // ── Update ────────────────────────────────────────────────
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({ label: item.label, description: item.description || "" });
    setDeleteConfirmId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ label: "", description: "" });
  };

  const handleUpdate = async (id) => {
    if (!editForm.label.trim()) return;

    setSaving(true);
    setError("");
    try {
      await API.patch(`card-settings/${id}`, {
        label: editForm.label.trim(),
        description: editForm.description.trim(),
      });
      setEditingId(null);
      showSuccess("Setting updated successfully!");
      await fetchSettings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setSaving(true);
    setError("");
    try {
      await API.delete(`card-settings/${id}`);
      setDeleteConfirmId(null);
      showSuccess("Setting deleted successfully!");
      await fetchSettings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete setting.");
    } finally {
      setSaving(false);
    }
  };

  // ── Move Up / Down (sort order) ───────────────────────────
  const handleMove = async (items, index, direction, category) => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    setSaving(true);
    setError("");
    try {
      await Promise.all([
        API.patch(`card-settings/${items[index]._id}`, { sortOrder: items[swapIndex].sortOrder }),
        API.patch(`card-settings/${items[swapIndex]._id}`, { sortOrder: items[index].sortOrder }),
      ]);
      await fetchSettings();
    } catch (err) {
      setError("Failed to reorder.");
    } finally {
      setSaving(false);
    }
  };

  // ── Shared Styles ─────────────────────────────────────────
  const inputCls = "w-full h-10 px-3 text-sm bg-[var(--color-surface-50)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all";
  const btnPrimary = "h-9 px-4 text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-[var(--radius-md)] hover:shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5";
  const btnGhost = "h-9 px-3 text-sm font-medium border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-100)] transition-all cursor-pointer flex items-center gap-1.5";
  const btnDanger = "h-9 px-3 text-sm font-medium bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20 rounded-[var(--radius-md)] hover:bg-[var(--color-error)]/20 transition-all cursor-pointer flex items-center gap-1.5";
  const sectionTitle = "text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider";

  // ── Render a settings section ─────────────────────────────
  const renderSection = (title, emoji, items, category, addState, setAddState, isAudio = false) => (
    <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-50)]">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <h3 className={sectionTitle}>{title}</h3>
          <span className="ml-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-100)] px-2 py-0.5 rounded-full">
            {items.length} items
          </span>
        </div>
        <button
          onClick={() => setAddState(prev => ({ ...prev, open: !prev.open, label: "", description: "", file: null }))}
          className={btnPrimary}
          disabled={saving}
        >
          {addState.open ? <HiOutlineX className="text-base" /> : <HiOutlinePlus className="text-base" />}
          {addState.open ? "Cancel" : "Add New"}
        </button>
      </div>

      {/* Add Form (Collapsible) */}
      {addState.open && (
        <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-primary)]/[0.02]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Label *</label>
              <input
                value={addState.label}
                onChange={(e) => setAddState(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Name or Title"
                className={inputCls}
              />
            </div>
            
            {isAudio ? (
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Audio File (MP3/WAV) *</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAddState(prev => ({ ...prev, file: e.target.files[0] }))}
                  className={`${inputCls} py-1.5`}
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Description</label>
                <input
                  value={addState.description}
                  onChange={(e) => setAddState(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  className={inputCls}
                />
              </div>
            )}

            <button
              onClick={() => handleCreate(category)}
              disabled={!addState.label.trim() || (isAudio && !addState.file) || saving}
              className={btnPrimary}
            >
              <HiOutlineCheck className="text-base" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="divide-y divide-[var(--color-border)] min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar">
        {items.length === 0 ? (
          <div className="px-6 py-10 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
            <p className="text-sm text-[var(--color-text-muted)]">No {title.toLowerCase()} configured yet.</p>
            <button
              onClick={() => setAddState(prev => ({ ...prev, open: true }))}
              className="mt-2 text-sm text-[var(--color-primary)] font-medium hover:underline cursor-pointer"
            >
              Add your first entry
            </button>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item._id}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-[var(--color-surface-50)] transition-colors group"
            >
              {/* Value Badge */}
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--color-primary)]/15">
                <span className="text-sm font-bold text-[var(--color-primary)]">{item.value}</span>
              </div>

              {/* Content — Editing or Display */}
              {editingId === item._id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <input
                    value={editForm.label}
                    onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                    className={inputCls}
                    autoFocus
                  />
                  {!isAudio && (
                    <input
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                      className={inputCls}
                    />
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(item._id)} disabled={saving} className={btnPrimary}>
                      <HiOutlineCheck className="text-base" /> Save
                    </button>
                    <button onClick={cancelEdit} className={btnGhost}>
                      <HiOutlineX className="text-base" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">{item.label}</p>
                      {item.description && !isAudio && (
                        <p className="text-xs text-[var(--color-text-muted)] truncate">{item.description}</p>
                      )}
                    </div>
                    {isAudio && item.url && (
                      <div className="mr-4">
                        <audio controls src={`${API_BASE}${item.url}`} className="h-8 max-w-[200px]" />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Sort buttons */}
                    <button
                      onClick={() => handleMove(items, index, "up", category)}
                      disabled={index === 0 || saving}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-100)] hover:text-[var(--color-text)] disabled:opacity-30 transition-all cursor-pointer"
                      title="Move up"
                    >
                      <HiOutlineChevronUp className="text-base" />
                    </button>
                    <button
                      onClick={() => handleMove(items, index, "down", category)}
                      disabled={index === items.length - 1 || saving}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-100)] hover:text-[var(--color-text)] disabled:opacity-30 transition-all cursor-pointer"
                      title="Move down"
                    >
                      <HiOutlineChevronDown className="text-base" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => startEdit(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all cursor-pointer"
                      title="Edit"
                    >
                      <HiOutlinePencil className="text-base" />
                    </button>

                    {/* Delete */}
                    {deleteConfirmId === item._id ? (
                      <div className="flex items-center gap-1 ml-1">
                        <button onClick={() => handleDelete(item._id)} disabled={saving} className={btnDanger}>
                          {saving ? "..." : "Confirm"}
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className={btnGhost}>
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setDeleteConfirmId(item._id); setEditingId(null); }}
                        className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] transition-all cursor-pointer"
                        title="Delete"
                      >
                        <HiOutlineTrash className="text-base" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">Card Settings</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Manage dynamic configurations for wedding invitations
          </p>
        </div>
        <button onClick={handleSeed} disabled={seeding} className={btnGhost}>
          {seeding ? "Seeding..." : "Seed Default Data"}
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/20">
          <p className="text-sm text-[var(--color-accent)] font-medium flex items-center gap-2">
            <HiOutlineCheck className="text-base" /> {successMsg}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-error)]/8 border border-[var(--color-error)]/20">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-[var(--color-border)] mb-6 overflow-x-auto custom-scrollbar pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-dark)]"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "weddings" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {renderSection("Ceremony Types", "⛪", ceremonyTypes, "ceremonyType", addCeremony, setAddCeremony)}
          {renderSection("Reception Types", "🥂", receptionTypes, "receptionType", addReception, setAddReception)}
          {renderSection("Dress Codes", "👔", dressCodes, "dressCode", addDress, setAddDress)}
          {renderSection("Background Music", "🎵", backgroundMusic, "backgroundMusic", addMusic, setAddMusic, true)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
          <div className="w-16 h-16 flex items-center justify-center bg-[var(--color-surface-50)] rounded-full mb-4">
            <span className="text-3xl opacity-50">
              {tabs.find(t => t.id === activeTab)?.icon}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            {tabs.find(t => t.id === activeTab)?.label} Settings
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-sm text-center">
            Settings configuration for {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} is currently under development and will be available soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default CardSettingsPage;
