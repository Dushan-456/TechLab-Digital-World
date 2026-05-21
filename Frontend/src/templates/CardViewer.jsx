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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const [invRes, ceremonyRes, dressRes, musicRes, receptionRes] = await Promise.all([
          API.get(`invitations/${cardId}`),
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

