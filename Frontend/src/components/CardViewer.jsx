import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// --- Templates ---

const EtherealTemplate = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-8 font-serif text-[#4A443F]">
      <div className="max-w-2xl w-full text-center space-y-16 py-20">
        <div className="space-y-4">
          <p className="uppercase tracking-[0.3em] text-xs opacity-60">The Wedding of</p>
          <h1 className="text-6xl md:text-8xl font-light lowercase">
            {data.couple.bride} <span className="block italic text-4xl my-4">&</span> {data.couple.groom}
          </h1>
        </div>
        
        <div className="h-px w-24 bg-[#4A443F] mx-auto opacity-20"></div>

        <div className="space-y-8 max-w-md mx-auto leading-relaxed">
          <p className="text-lg italic opacity-80">{data.content.welcomeText}</p>
          <div className="space-y-2">
            <p className="text-2xl font-light">{new Date(data.event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <p className="uppercase tracking-widest text-sm">{data.event.location}</p>
          </div>
        </div>

        <button className="px-10 py-4 border border-[#4A443F] border-opacity-20 hover:border-opacity-100 transition-all duration-700 text-sm uppercase tracking-[0.2em] mt-12">
          RSVP
        </button>
      </div>
    </div>
  );
};

const LuminaTemplate = ({ data }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0E7FF] via-[#F3F4F6] to-[#FDF2F8] flex items-center justify-center p-6 font-sans">
      <div className="relative max-w-4xl w-full">
        {/* Background blobs for depth */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative bg-white bg-opacity-40 backdrop-blur-xl border border-white border-opacity-50 rounded-[2.5rem] shadow-2xl overflow-hidden p-12 md:p-20 text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 bg-white bg-opacity-50 rounded-full text-xs font-semibold tracking-wider text-blue-600 uppercase">
                Save the Date
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                {data.couple.bride} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">&</span> {data.couple.groom}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-sm">
                {data.content.welcomeText}
              </p>
            </div>

            <div className="bg-white bg-opacity-30 rounded-3xl p-8 border border-white border-opacity-20 space-y-6">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-gray-400">When</p>
                <p className="text-xl font-medium">{new Date(data.event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-gray-400">Where</p>
                <p className="text-xl font-medium">{data.event.location}</p>
              </div>
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg">
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KineticTemplate = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-5xl w-full relative z-10">
        <div className="space-y-12">
          {/* Kinetic Typography Headings */}
          <div className="space-y-0">
            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] animate-kinetic-up">
              {data.couple.bride}
            </h1>
            <div className="flex items-center space-x-6">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></span>
              <span className="text-3xl md:text-5xl font-serif italic text-blue-400">and</span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></span>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] text-right animate-kinetic-down">
              {data.couple.groom}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 items-end">
            <div className="md:col-span-2 space-y-6">
              <p className="text-xl md:text-2xl font-light text-slate-400 max-w-xl leading-relaxed">
                {data.content.welcomeText}
              </p>
            </div>
            <div className="space-y-4 text-right">
              <p className="text-4xl font-bold text-blue-400">
                {new Date(data.event.date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </p>
              <p className="uppercase tracking-[0.4em] text-xs text-slate-500">
                {data.event.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-blue-500 animate-slide-down"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-blue-500 animate-slide-up"></div>
      </div>
    </div>
  );
};

// --- Main Component ---

const CardViewer = () => {
  const { cardId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/invitations/${cardId}`);
        setData(response.data);
      } catch (err) {
        setError('Invitation not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cardId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-2 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2] text-center p-6">
      <div>
        <h2 className="text-3xl font-serif text-gray-800">Invitation not found</h2>
        <p className="text-gray-500 mt-4">Please check the URL and try again.</p>
      </div>
    </div>
  );

  // Render template based on templateId
  switch (data.templateId) {
    case 'ethereal': return <EtherealTemplate data={data} />;
    case 'lumina': return <LuminaTemplate data={data} />;
    case 'kinetic': return <KineticTemplate data={data} />;
    default: return <EtherealTemplate data={data} />;
  }
};

export default CardViewer;
