import React from 'react';

const LuminaTemplate = ({ data }) => {
  const { couple, event, content } = data;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/50 blur-[120px] mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/50 blur-[120px] mix-blend-multiply"></div>

      {/* Glass Container */}
      <div className="relative z-10 w-full max-w-3xl bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-10 md:p-20 text-center animate-scale-up">
        
        <p className="text-sm font-medium tracking-widest uppercase text-slate-500 mb-12">
          {content.welcomeText}
        </p>

        <div className="space-y-6 mb-16">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
            {couple.bride}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <span className="text-3xl font-light text-slate-400">&amp;</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-800 bg-clip-text text-transparent bg-gradient-to-l from-slate-800 to-slate-500">
            {couple.groom}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-slate-600 bg-white/30 rounded-3xl p-8 border border-white/50">
          <div className="space-y-2">
            <div className="w-8 h-8 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">Date</p>
            <p className="text-lg font-medium">
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>
          <div className="space-y-2">
             <div className="w-8 h-8 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">Location</p>
            <p className="text-lg font-medium">
              {event.location}
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default LuminaTemplate;
