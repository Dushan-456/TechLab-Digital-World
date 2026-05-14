import React from 'react';

const EtherealTemplate = ({ data }) => {
  const { couple, event, content } = data;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#333333] flex flex-col items-center justify-center p-8 font-serif selection:bg-[#E5E0D8] selection:text-[#333333]">
      <div className="max-w-2xl w-full text-center space-y-16 animate-fade-in-up">
        
        {/* Minimalist Top Ornament */}
        <div className="w-px h-16 bg-[#D4CFC9] mx-auto opacity-70"></div>

        {/* Welcome Text */}
        <p className="text-sm uppercase tracking-[0.3em] text-[#8C8781] font-sans">
          {content.welcomeText}
        </p>

        {/* Couple Names */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-light tracking-wide text-[#2C2C2C]">
            {couple.bride}
          </h1>
          <div className="text-2xl italic text-[#8C8781] font-serif">&amp;</div>
          <h1 className="text-5xl md:text-7xl font-light tracking-wide text-[#2C2C2C]">
            {couple.groom}
          </h1>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 py-8">
          <div className="w-12 h-px bg-[#E5E0D8]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4CFC9]"></div>
          <div className="w-12 h-px bg-[#E5E0D8]"></div>
        </div>

        {/* Event Details */}
        <div className="space-y-6 font-sans">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-[#A39E98] mb-2">When</p>
            <p className="text-lg md:text-xl font-light text-[#4A4A4A] tracking-wider">
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-[#A39E98] mb-2">Where</p>
            <p className="text-lg md:text-xl font-light text-[#4A4A4A] tracking-wider">
              {event.location}
            </p>
          </div>
        </div>

        {/* Minimalist Bottom Ornament */}
        <div className="w-px h-16 bg-[#D4CFC9] mx-auto opacity-70 mt-16"></div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EtherealTemplate;
