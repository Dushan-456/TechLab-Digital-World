import React from 'react';

const KineticTemplate = ({ data }) => {
  const { couple, event, content } = data;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative font-sans flex flex-col justify-center items-center">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 w-full h-screen overflow-hidden pointer-events-none opacity-30">
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-[100px] -top-[400px] -right-[400px] animate-blob"></div>
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-[80px] bottom-[10%] -left-[200px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 md:px-12 py-20 flex flex-col h-full justify-between animate-fade-in">
        
        <header className="mb-20 overflow-hidden">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-zinc-400 font-medium animate-slide-up">
            {content.welcomeText}
          </p>
        </header>

        <main className="flex-grow flex flex-col justify-center space-y-2 md:space-y-4 mb-24">
          <div className="overflow-hidden">
            <h1 className="text-[12vw] leading-none font-bold tracking-tighter text-zinc-100 hover:text-emerald-400 transition-colors duration-500 cursor-default animate-slide-up animation-delay-300">
              {couple.bride.toUpperCase()}
            </h1>
          </div>
          <div className="overflow-hidden flex items-center gap-8">
            <div className="h-[2px] w-16 md:w-32 bg-zinc-800 animate-slide-right animation-delay-500"></div>
            <h1 className="text-[12vw] leading-none font-bold tracking-tighter text-zinc-100 hover:text-cyan-400 transition-colors duration-500 cursor-default animate-slide-up animation-delay-700">
              {couple.groom.toUpperCase()}
            </h1>
          </div>
        </main>

        <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-800/50 pt-12 animate-fade-in animation-delay-1000">
          <div className="group">
            <h3 className="text-zinc-500 text-sm uppercase tracking-widest mb-3 group-hover:text-emerald-400 transition-colors duration-300">Date</h3>
            <p className="text-2xl md:text-4xl font-light text-zinc-200">
               {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short', day: '2-digit', year: 'numeric'
              })}
            </p>
          </div>
          <div className="group">
            <h3 className="text-zinc-500 text-sm uppercase tracking-widest mb-3 group-hover:text-cyan-400 transition-colors duration-300">Location</h3>
            <p className="text-2xl md:text-4xl font-light text-zinc-200 max-w-xs">
              {event.location}
            </p>
          </div>
        </footer>

      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-right {
          animation: slideRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </div>
  );
};

export default KineticTemplate;
