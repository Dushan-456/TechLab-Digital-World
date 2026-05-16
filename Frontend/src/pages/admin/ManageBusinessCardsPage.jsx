import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { HiOutlineExternalLink, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff, HiOutlinePencil, HiOutlineSearch } from "react-icons/hi";

const ManageBusinessCardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCards = async () => {
    try {
      const { data } = await API.get("business-cards");
      setCards(data.data);
    } catch (error) {
      console.error("Failed to fetch business cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, []);

  const handleDelete = async (cardId) => {
    if (!window.confirm(`Delete business card "${cardId}"? This cannot be undone.`)) return;
    try {
      await API.delete(`business-cards/${cardId}`);
      setCards((prev) => prev.filter((c) => c.cardId !== cardId));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const togglePublish = async (cardId, currentStatus) => {
    try {
      await API.patch(`business-cards/${cardId}`, { isPublished: !currentStatus });
      setCards((prev) => prev.map((c) => c.cardId === cardId ? { ...c, isPublished: !currentStatus } : c));
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const filteredCards = useMemo(() => {
    if (!searchQuery) return cards;
    const query = searchQuery.toLowerCase();
    return cards.filter((c) => 
      c.cardId?.toLowerCase().includes(query) ||
      c.personalInfo?.fullName?.toLowerCase().includes(query) ||
      c.personalInfo?.company?.toLowerCase().includes(query)
    );
  }, [cards, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">Manage Business Cards</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{filteredCards.length} card{filteredCards.length !== 1 ? "s" : ""} found</p>
        </div>
        
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, company, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--color-surface-50)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <div className="col-span-4">Professional Details</div>
          <div className="col-span-3">Card ID</div>
          <div className="col-span-2">Template</div>
          <div className="col-span-1">Views</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredCards.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredCards.map((card) => (
              <div key={card._id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center hover:bg-[var(--color-surface-50)] transition-colors">
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{card.personalInfo?.fullName}</p>
                  <p className="text-xs text-[var(--color-text-light)]">
                    {card.personalInfo?.jobTitle} {card.personalInfo?.company ? `@ ${card.personalInfo?.company}` : ""}
                  </p>
                </div>
                <div className="col-span-3">
                  <code className="text-xs bg-[var(--color-surface-100)] px-2 py-1 rounded text-[var(--color-text-muted)] border border-gray-100">{card.cardId}</code>
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border bg-slate-50 text-slate-700 border-slate-200">
                    {card.templateId}
                  </span>
                </div>
                <div className="col-span-1 text-sm text-[var(--color-text-muted)]">{card.views}</div>
                <div className="col-span-2 flex items-center justify-end gap-1.5">
                  <Link to={`/admin/business-cards/edit/${card.cardId}`} className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-100)] text-[var(--color-text-muted)] hover:text-blue-500 transition-all" title="Edit">
                    <HiOutlinePencil />
                  </Link>
                  <a href={`/b/${card.cardId}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-100)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all" title="View">
                    <HiOutlineExternalLink />
                  </a>
                  <button onClick={() => togglePublish(card.cardId, card.isPublished)} className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-100)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-all cursor-pointer" title={card.isPublished ? "Unpublish" : "Publish"}>
                    {card.isPublished ? <HiOutlineEye /> : <HiOutlineEyeOff />}
                  </button>
                  <button onClick={() => handleDelete(card.cardId)} className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-error)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-all cursor-pointer" title="Delete">
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">No business cards found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBusinessCardsPage;
