import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import API from "../services/api";
import { getTemplateComponent } from "./templateRegistry";

const CardViewer = () => {
  const { cardId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const guestName = searchParams.get("name") || "";
  const guestCount = searchParams.get("guests") || "";
  const [data, setData] = useState(null);
  const [cardSettings, setCardSettings] = useState({ ceremonyTypes: [], dressCodes: [], backgroundMusic: [], receptionTypes: [] });
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const invRes = await API.get(`invitations/${cardId}`);
        if (invRes.data.isPendingActivation) {
          setIsPending(true);
          setData(invRes.data.data);
          setLoading(false);
          return;
        }

        const [ceremonyRes, dressRes, musicRes, receptionRes] = await Promise.all([
          API.get("card-settings?category=ceremonyType"),
          API.get("card-settings?category=dressCode"),
          API.get("card-settings?category=backgroundMusic"),
          API.get("card-settings?category=receptionType"),
        ]);
        setData(invRes.data.data);
        setCardSettings({
          ceremonyTypes: ceremonyRes.data.data,
          dressCodes: dressRes.data.data,
          backgroundMusic: musicRes.data.data,
          receptionTypes: receptionRes.data.data,
        });
      } catch (err) {
        setError(err.response?.status === 404 ? "Invitation not found." : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    if (cardId) fetchCard();
  }, [cardId]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--color-text-muted)] mt-4 font-[var(--font-serif)]">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="text-center">
          <p className="text-6xl mb-4">💌</p>
          <h2 className="text-xl font-semibold text-[var(--color-text)] font-[var(--font-serif)]">{error}</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">This invitation link may be incorrect or expired.</p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-6">
        <div className="max-w-md w-full bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl">
            🔒
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-serif)]">
              Pending Activation
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
              This digital invitation is awaiting payment confirmation.
            </p>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-50)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-left space-y-1.5">
            <p className="font-semibold text-[var(--color-text)]">Are you the host or creator?</p>
            <p>Please log in to your account, upload your bank transfer payment slip from your profile dashboard, and our team will activate your invitation immediately.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="/login"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-xs font-semibold rounded-[var(--radius-md)] hover:shadow-lg transition-all text-center"
            >
              Log In to Dashboard
            </a>
            <a
              href="/"
              className="flex-1 py-3 px-4 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-surface-100)] transition-colors text-center"
            >
              Home Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  const TemplateComponent = getTemplateComponent(data?.templateId);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <p className="text-sm text-[var(--color-text-muted)]">Unknown template type.</p>
      </div>
    );
  }

  return <TemplateComponent data={data} guestName={guestName} guestCount={guestCount} cardSettings={cardSettings} />;
};

export default CardViewer;

