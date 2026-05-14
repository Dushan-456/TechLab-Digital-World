import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { HiOutlineExternalLink, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff, HiOutlinePencil, HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";

const ManageInvitationsPage = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

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

  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      // Type Filter
      if (filterType !== "all" && inv.invitationType !== filterType) return false;
      
      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesCardId = inv.cardId?.toLowerCase().includes(query);
        const matchesBride = inv.couple?.bride?.toLowerCase().includes(query);
        const matchesGroom = inv.couple?.groom?.toLowerCase().includes(query);
        const matchesCelebrant = inv.celebrantName?.toLowerCase().includes(query);
        const matchesEventName = inv.eventName?.toLowerCase().includes(query);
        const matchesLocation = inv.event?.location?.toLowerCase().includes(query);
        
        return matchesCardId || matchesBride || matchesGroom || matchesCelebrant || matchesEventName || matchesLocation;
      }
      return true;
    });
  }, [invitations, filterType, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getSubject = (inv) => {
    if (inv.invitationType === "wedding") return `${inv.couple?.bride} & ${inv.couple?.groom}`;
    if (inv.invitationType === "birthday") return inv.celebrantName;
    if (inv.invitationType === "event") return inv.eventName;
    return "Unknown";
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">Manage Invitations</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{filteredInvitations.length} invitation{filteredInvitations.length !== 1 ? "s" : ""} found</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search invitations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
          <div className="relative">
            <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-auto appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 bg-white"
            >
              <option value="all">All Types</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--color-surface-50)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <div className="col-span-3">Subject & Type</div>
          <div className="col-span-2">Card ID</div>
          <div className="col-span-2">Template</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Views</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredInvitations.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredInvitations.map((inv) => (
              <div key={inv._id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center hover:bg-[var(--color-surface-50)] transition-colors">
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{getSubject(inv)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--color-text-light)] uppercase tracking-wider font-semibold">{inv.invitationType}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-[var(--color-text-light)] truncate max-w-[150px]">{inv.event?.location}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <code className="text-xs bg-[var(--color-surface-100)] px-2 py-1 rounded text-[var(--color-text-muted)] border border-gray-100">{inv.cardId}</code>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${inv.templateId === "ethereal" ? "bg-amber-50 text-amber-700 border-amber-100" : inv.templateId === "lumina" ? "bg-violet-50 text-violet-700 border-violet-100" : inv.templateId === "kinetic" ? "bg-sky-50 text-sky-700 border-sky-100" : "bg-gray-50 text-gray-700 border-gray-200"}`}>
                    {inv.templateId}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-[var(--color-text-muted)]">{new Date(inv.event?.date).toLocaleDateString()}</div>
                <div className="col-span-1 text-sm text-[var(--color-text-muted)]">{inv.views}</div>
                <div className="col-span-2 flex items-center justify-end gap-1.5">
                  <Link to={`/admin/edit/${inv.cardId}`} className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-100)] text-[var(--color-text-muted)] hover:text-blue-500 transition-all" title="Edit">
                    <HiOutlinePencil />
                  </Link>
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
            <p className="text-sm text-[var(--color-text-muted)]">No invitations found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInvitationsPage;
