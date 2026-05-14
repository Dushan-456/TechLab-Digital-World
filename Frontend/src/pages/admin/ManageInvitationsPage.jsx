import { useState, useEffect } from "react";
import API from "../../services/api";
import { HiOutlineExternalLink, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const ManageInvitationsPage = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    try {
      const { data } = await API.get("/invitations");
      setInvitations(data.data);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvitations(); }, []);

  const handleDelete = async (cardId) => {
    if (!window.confirm(`Delete invitation "${cardId}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/invitations/${cardId}`);
      setInvitations((prev) => prev.filter((inv) => inv.cardId !== cardId));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const togglePublish = async (cardId, currentStatus) => {
    try {
      await API.patch(`/invitations/${cardId}`, { isPublished: !currentStatus });
      setInvitations((prev) => prev.map((inv) => inv.cardId === cardId ? { ...inv, isPublished: !currentStatus } : inv));
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">Manage Invitations</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{invitations.length} invitation{invitations.length !== 1 ? "s" : ""} total</p>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--color-surface-50)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <div className="col-span-3">Couple</div>
          <div className="col-span-2">Card ID</div>
          <div className="col-span-2">Template</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Views</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {invitations.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {invitations.map((inv) => (
              <div key={inv._id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center hover:bg-[var(--color-surface-50)] transition-colors">
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{inv.couple?.bride} & {inv.couple?.groom}</p>
                  <p className="text-xs text-[var(--color-text-light)]">{inv.event?.location}</p>
                </div>
                <div className="col-span-2">
                  <code className="text-xs bg-[var(--color-surface-100)] px-2 py-1 rounded text-[var(--color-text-muted)]">{inv.cardId}</code>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${inv.templateId === "ethereal" ? "bg-amber-50 text-amber-700" : inv.templateId === "lumina" ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"}`}>
                    {inv.templateId}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-[var(--color-text-muted)]">{new Date(inv.event?.date).toLocaleDateString()}</div>
                <div className="col-span-1 text-sm text-[var(--color-text-muted)]">{inv.views}</div>
                <div className="col-span-2 flex items-center justify-end gap-1.5">
                  <a href={`/v/${inv.cardId}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-100)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all" title="View">
                    <HiOutlineExternalLink />
                  </a>
                  <button onClick={() => togglePublish(inv.cardId, inv.isPublished)} className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-100)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all cursor-pointer" title={inv.isPublished ? "Unpublish" : "Publish"}>
                    {inv.isPublished ? <HiOutlineEye /> : <HiOutlineEyeOff />}
                  </button>
                  <button onClick={() => handleDelete(inv.cardId)} className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-error)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-all cursor-pointer" title="Delete">
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">No invitations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInvitationsPage;
