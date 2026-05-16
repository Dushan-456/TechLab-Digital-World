import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import {
  HiOutlinePlusCircle,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineExternalLink,
  HiOutlineArrowRight,
} from "react-icons/hi";

const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 hover:shadow-[var(--shadow-md)] transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-[var(--color-text-muted)] font-medium">{label}</p>
        <p className="text-3xl font-bold text-[var(--color-text)] mt-1 font-[var(--font-display)]">{value}</p>
      </div>
      <div className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center" style={{ background: gradient }}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("invitations/stats/overview");
        setStats(data.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">Overview</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Your wedding invitation platform at a glance</p>
        </div>
        <Link to="/admin/create" className="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all">
          <HiOutlinePlusCircle className="text-lg" />
          New Invitation
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineDocumentText} label="Total Invitations" value={stats?.totalInvitations || 0} gradient="linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" />
        <StatCard icon={HiOutlineCheckCircle} label="Published" value={stats?.publishedCount || 0} gradient="linear-gradient(135deg, var(--color-accent), #3d7a5e)" />
        <StatCard icon={HiOutlineEye} label="Total Views" value={stats?.totalViews || 0} gradient="linear-gradient(135deg, #6366f1, #4f46e5)" />
        <StatCard icon={HiOutlineDocumentText} label="Drafts" value={stats?.draftCount || 0} gradient="linear-gradient(135deg, var(--color-text-muted), var(--color-dark-300))" />
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-base font-semibold text-[var(--color-text)]">Recent Invitations</h3>
          <Link to="/admin/invitations" className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium">
            View All <HiOutlineArrowRight />
          </Link>
        </div>
        {stats?.recentInvitations?.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {stats.recentInvitations.map((inv) => (
              <div key={inv._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--color-surface-50)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-xs font-bold uppercase text-white" style={{ background: inv.templateId === "ethereal" ? "linear-gradient(135deg,#b8a080,#8c7060)" : inv.templateId === "lumina" ? "linear-gradient(135deg,#a78bfa,#7c3aed)" : "linear-gradient(135deg,#0ea5e9,#0369a1)" }}>
                    {inv.templateId?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{inv.couple?.bride} & {inv.couple?.groom}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">/{inv.cardId} · {inv.templateId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-[var(--color-text-muted)]">{new Date(inv.event?.date).toLocaleDateString()}</p>
                    <p className="text-xs text-[var(--color-text-light)]">{inv.views} views</p>
                  </div>
                  <a href={`/v/${inv.cardId}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-100)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all">
                    <HiOutlineExternalLink />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <HiOutlineDocumentText className="mx-auto text-4xl text-[var(--color-text-light)] mb-3" />
            <p className="text-sm text-[var(--color-text-muted)]">No invitations yet.</p>
            <Link to="/admin/create" className="inline-flex items-center gap-1.5 mt-3 text-sm text-[var(--color-primary)] font-medium">
              <HiOutlinePlusCircle /> Create Invitation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
