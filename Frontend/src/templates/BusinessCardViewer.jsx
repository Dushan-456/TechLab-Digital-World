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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await API.get(`business-cards/${cardId}`);
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
