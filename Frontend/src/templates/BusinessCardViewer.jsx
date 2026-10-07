import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ModernBusinessTemplate from "./business/ModernBusinessTemplate";
import MinimalBusinessTemplate from "./business/MinimalBusinessTemplate";
import ClassicBusinessTemplate from "./business/ClassicBusinessTemplate";

const templateMap = {
  modern: ModernBusinessTemplate,
  minimal: MinimalBusinessTemplate,
  classic: ClassicBusinessTemplate,
};

const BusinessCardViewer = () => {
  const { cardId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await API.get(`business-cards/${cardId}`);
        if (res.data.isPendingActivation) {
          setIsPending(true);
          setData(res.data.data);
          return;
        }
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.status === 404 ? "Card not found." : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    if (cardId) fetchCard();
  }, [cardId]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-center p-4">
        <div>
          <p className="text-6xl mb-4">📇</p>
          <h2 className="text-xl font-semibold">{error}</h2>
          <p className="text-slate-400 mt-2">This link may be incorrect or the card was unpublished.</p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 text-center space-y-6 text-white">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-3xl">
            🔒
          </div>
          <div>
            <h2 className="text-2xl font-bold font-sans">Pending Activation</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              This digital business card is awaiting payment verification.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 text-left space-y-1.5">
            <p className="font-semibold text-white">Are you the card owner?</p>
            <p>Please log in to your account and upload your bank transfer slip from your profile dashboard to activate this card.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="/login"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all text-center"
            >
              Log In to Dashboard
            </a>
            <a
              href="/"
              className="flex-1 py-3 px-4 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors text-center"
            >
              Home Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  const TemplateComponent = templateMap[data?.templateId || "modern"];

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Template not found.</p>
      </div>
    );
  }

  return <TemplateComponent data={data} />;
};

export default BusinessCardViewer;
