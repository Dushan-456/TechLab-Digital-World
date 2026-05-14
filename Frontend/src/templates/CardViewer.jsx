import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EtherealTemplate from "./EtherealTemplate";
import LuminaTemplate from "./LuminaTemplate";
import KineticTemplate from "./KineticTemplate";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const templateMap = {
  ethereal: EtherealTemplate,
  lumina: LuminaTemplate,
  kinetic: KineticTemplate,
};

const CardViewer = () => {
  const { cardId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/invitations/${cardId}`);
        setData(res.data.data);
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

  const TemplateComponent = templateMap[data?.templateId];

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <p className="text-sm text-[var(--color-text-muted)]">Unknown template type.</p>
      </div>
    );
  }

  return <TemplateComponent data={data} />;
};

export default CardViewer;
