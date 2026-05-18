import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineMap, HiOutlineCalendar, HiOutlineX, HiOutlineHeart } from "react-icons/hi";
import confetti from "canvas-confetti";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const CEREMONY_FALLBACK = "Wedding Ceremony";
const DRESS_FALLBACK = { title: "Formal", desc: "Evening Wear" };
const RECEPTION_FALLBACK = { title: "Evening Banquet", desc: "Dinner & Celebration" };

const letterAnimation = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { delay: 0.6 + i * 0.04, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8, ease: [0.4, 0, 0.2, 1] } }),
};

const KineticName = ({ name, className = "" }) => (
  <span className={`inline-flex flex-wrap justify-center ${className}`}>
    {name.split("").map((char, i) => (
      <motion.span key={i} custom={i} variants={letterAnimation} initial="hidden" animate="visible" className="inline-block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

const KineticTemplate = ({ data, guestName, guestCount, cardSettings = {} }) => {
  const { couple, event, content } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const audioRef = useRef(null);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const eventTime = event?.time || "";
  const displayTime = (() => {
    if (!eventTime) return "";
    const [h, m] = eventTime.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${m} ${ampm}`;
  })();

  const rsvpDeadline = (() => {
    if (!data.rsvp?.deadline) return "";
    const date = new Date(data.rsvp.deadline);
    const d = date.getDate();
    const m = date.toLocaleString("en-US", { month: "long" });
    const y = date.getFullYear();
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    return `${getOrdinal(d)} ${m}, ${y}`;
  })();

  const toggleMusic = () => {
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setIsPlaying(!isPlaying);
  };

  const handleRSVP = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0ea5e9", "#06b6d4", "#ffffff"]
    });
  };

  const addToCalendar = () => {
    const start = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = `${couple.bride} & ${couple.groom}'s Wedding`;
    const details = `Join us for the wedding of ${couple.bride} and ${couple.groom} at ${event.location}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location)}`;
    window.open(url, "_blank");
  };

  const hasCoverImage = !!data.coverImage;
  const coverUrl = hasCoverImage ? `${API_BASE}${data.coverImage}` : null;
  const hasParents = data.parents?.brideParents || data.parents?.groomParents;
  const hasGallery = data.galleryImages?.length > 0;
  const hasMap = !!event?.mapEmbedUrl;

  const ceremonyEntry = (cardSettings.ceremonyTypes || []).find(c => Number(c.value) === Number(data.ceremonyType));
  const ceremonyLabel = ceremonyEntry ? ceremonyEntry.label : CEREMONY_FALLBACK;

  const dressEntry = (cardSettings.dressCodes || []).find(d => Number(d.value) === Number(data.dressCode));
  const dressInfo = dressEntry ? { title: dressEntry.label, desc: dressEntry.description || "" } : DRESS_FALLBACK;

  const receptionEntry = (cardSettings.receptionTypes || []).find(r => Number(r.value) === Number(data.receptionType));
  const receptionInfo = receptionEntry ? { title: receptionEntry.label, desc: receptionEntry.description || "" } : RECEPTION_FALLBACK;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-16 relative overflow-x-hidden font-sans" style={{ background: "linear-gradient(180deg, #0A1628 0%, #0F1D32 40%, #162A46 70%, #1B3254 100%)" }}>
      {/* Animated floating orbs */}
      <motion.div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#0ea5e9" }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#06b6d4" }} animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-3/4 left-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#38bdf8" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />

      {/* Floating Background Music Player */}
      {data.backgroundMusic && (
        <>
          <audio ref={audioRef} src={`${API_BASE}${data.backgroundMusic}`} loop />
          <button 
            onClick={toggleMusic} 
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white"
            aria-label="Toggle background music"
          >
            {isPlaying ? <HiOutlineVolumeUp className="text-2xl" /> : <HiOutlineVolumeOff className="text-2xl" />}
          </button>
        </>
      )}

      {/* Hero Cover Image Banner */}
      {coverUrl && (
        <div className="relative w-full max-w-5xl h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-[#0ea5e9]/20">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        </div>
      )}

      <motion.div initial="hidden" animate="visible" className="relative w-full max-w-4xl space-y-12">
        {/* Kinetic Header Card */}
        <div className="rounded-3xl p-8 md:p-14 text-center relative overflow-hidden bg-[#0F1D32]/80 backdrop-blur-xl border border-[#0ea5e9]/30 shadow-[0_10px_30px_rgba(14,165,233,0.15)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0ea5e9] via-[#06b6d4] to-[#38bdf8]" />

          {/* Welcome Text */}
          <motion.p custom={0} variants={fadeIn} className="text-xs md:text-sm tracking-[0.3em] uppercase mb-10 text-[#0ea5e9]">
            {content?.welcomeText || "Together with their families"}
          </motion.p>

          {/* Kinetic Couple Names */}
          <div className="my-8 space-y-4">
            <div><KineticName name={couple.bride} className="text-5xl md:text-7xl font-light text-white" /></div>
            <motion.div custom={1} variants={fadeIn} className="flex items-center justify-center gap-6 my-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#0ea5e9]/60" />
              <span className="text-3xl font-light text-[#0ea5e9]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>&amp;</span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-[#0ea5e9]/60 to-transparent" />
            </motion.div>
            <div><KineticName name={couple.groom} className="text-5xl md:text-7xl font-light text-white" /></div>
          </div>

          {/* Parents Section */}
          {hasParents && (
            <motion.div custom={2} variants={fadeIn} className="mt-10 pt-8 border-t border-[#0ea5e9]/20 max-w-lg mx-auto space-y-3 text-xs md:text-sm tracking-[0.25em] uppercase text-slate-400">
              {data.parents?.brideParents && <p>Daughter of <span className="text-slate-200">{data.parents.brideParents}</span></p>}
              {data.parents?.groomParents && <p>Son of <span className="text-slate-200">{data.parents.groomParents}</span></p>}
            </motion.div>
          )}

          {/* Date Badge */}
          <motion.div custom={3} variants={fadeIn} className="mt-12">
            <div className="inline-flex flex-col items-center gap-2 px-8 py-4 rounded-2xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
              <p className="text-lg md:text-xl font-medium text-white tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{formattedDate}</p>
              {displayTime && <p className="text-sm text-[#0ea5e9] tracking-widest uppercase font-semibold">at {displayTime}</p>}
            </div>
          </motion.div>

          <motion.div custom={4} variants={fadeIn} className="mt-8">
            <button onClick={addToCalendar} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 border-b border-slate-600 pb-1 hover:text-white hover:border-[#0ea5e9] transition-all">
              Add to Calendar
            </button>
          </motion.div>
        </div>

        {/* Venue & Map Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div custom={5} variants={fadeIn} className="rounded-3xl p-8 md:p-10 bg-[#0F1D32]/80 backdrop-blur-xl border border-[#0ea5e9]/30 flex flex-col justify-center items-center text-center shadow-[0_10px_30px_rgba(14,165,233,0.1)]">
            <HiOutlineMap className="text-4xl text-[#0ea5e9] mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-[#0ea5e9] mb-3 font-semibold">Venue Location</p>
            <p className="text-xl md:text-2xl text-white font-light mb-6 px-4 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{event.location}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-[#0ea5e9]/20 text-white border border-[#0ea5e9]/40 hover:bg-[#0ea5e9] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all duration-300"
            >
              Get Directions
            </a>
          </motion.div>

          {hasMap ? (
            <motion.div custom={6} variants={fadeIn} className="rounded-3xl overflow-hidden h-80 md:h-auto border border-[#0ea5e9]/30 shadow-[0_10px_30px_rgba(14,165,233,0.1)] bg-[#0F1D32]">
              <iframe title="Venue Map" src={event.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </motion.div>
          ) : (
            <motion.div custom={6} variants={fadeIn} className="rounded-3xl p-8 md:p-10 bg-[#0F1D32]/80 backdrop-blur-xl border border-[#0ea5e9]/30 flex flex-col justify-center items-center text-center shadow-[0_10px_30px_rgba(14,165,233,0.1)]">
              <HiOutlineCalendar className="text-4xl text-[#06b6d4] mb-4" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#0ea5e9] mb-3 font-semibold">Celebration Day</p>
              <p className="text-lg text-slate-300 font-light leading-relaxed">We look forward to sharing our special day with friends and family.</p>
            </motion.div>
          )}
        </div>

        {/* Additional Details Grid (Ceremony, Reception, Dress Code) */}
        <motion.div custom={7} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-8 bg-[#0F1D32]/60 backdrop-blur-lg border border-[#0ea5e9]/20 text-center hover:border-[#0ea5e9]/50 transition-colors">
            <p className="text-xs tracking-[0.3em] uppercase text-[#0ea5e9] mb-2 font-semibold">Ceremony</p>
            <p className="text-xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ceremonyLabel}</p>
          </div>
          <div className="rounded-2xl p-8 bg-[#0F1D32]/60 backdrop-blur-lg border border-[#0ea5e9]/20 text-center hover:border-[#0ea5e9]/50 transition-colors">
            <p className="text-xs tracking-[0.3em] uppercase text-[#06b6d4] mb-2 font-semibold">Reception</p>
            <p className="text-xl text-white font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{receptionInfo.title}</p>
            {receptionInfo.desc && <p className="text-xs text-slate-400 mt-1">{receptionInfo.desc}</p>}
          </div>
          <div className="rounded-2xl p-8 bg-[#0F1D32]/60 backdrop-blur-lg border border-[#0ea5e9]/20 text-center hover:border-[#0ea5e9]/50 transition-colors">
            <p className="text-xs tracking-[0.3em] uppercase text-[#38bdf8] mb-2 font-semibold">Dress Code</p>
            <p className="text-xl text-white font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{dressInfo.title}</p>
            {dressInfo.desc && <p className="text-xs text-slate-400 mt-1">{dressInfo.desc}</p>}
          </div>
        </motion.div>

        {/* Photo Gallery Section */}
        {hasGallery && (
          <motion.div custom={8} variants={fadeIn} className="rounded-3xl p-8 md:p-12 bg-[#0F1D32]/80 backdrop-blur-xl border border-[#0ea5e9]/30 shadow-[0_10px_30px_rgba(14,165,233,0.15)]">
            <div className="text-center mb-10">
              <h3 className="text-xs tracking-[0.4em] uppercase text-[#0ea5e9] font-semibold mb-2">Captured Moments</h3>
              <h2 className="text-4xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Gallery</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.galleryImages.map((img, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg cursor-pointer border border-[#0ea5e9]/30 bg-[#0A1628]"
                  onClick={() => setSelectedImage(`${API_BASE}${img}`)}
                >
                  <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RSVP Section */}
        <motion.div custom={9} variants={fadeIn} className="rounded-3xl p-10 md:p-14 bg-gradient-to-br from-[#0F1D32] to-[#162A46] backdrop-blur-2xl border border-[#0ea5e9]/40 text-center relative overflow-hidden shadow-[0_15px_50px_rgba(14,165,233,0.2)] max-w-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0ea5e9] via-[#06b6d4] to-[#38bdf8]" />
          <HiOutlineHeart className="text-5xl text-[#0ea5e9] mx-auto mb-6 animate-pulse" />
          <h3 className="text-xs uppercase font-bold tracking-[0.5em] text-[#0ea5e9] mb-4">RSVP</h3>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Kindly respond by {rsvpDeadline || "the earliest convenience"}
          </h2>
          {guestName && (
            <p className="text-sm text-slate-300 mb-8">
              Reserved for <span className="font-semibold text-white">{guestName}</span> {guestCount && `(& ${guestCount} guests)`}
            </p>
          )}
          <button 
            onClick={handleRSVP}
            className="px-10 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] active:scale-95 transition-all duration-300"
          >
            Confirm Attendance
          </button>
        </motion.div>

        {/* Footer Accent */}
        <motion.div custom={10} variants={fadeIn} className="mt-20 text-center">
          <motion.div className="w-2 h-2 mx-auto rounded-full bg-[#0ea5e9]" animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
          <p className="text-[10px] tracking-[0.3em] uppercase text-slate-500 mt-6">Looking forward to celebrating with you</p>
        </motion.div>
      </motion.div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A1628]/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white p-2 hover:rotate-90 transition-transform duration-300"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              <HiOutlineX className="text-3xl" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-[#0ea5e9]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Enlarged view" className="w-full h-full object-contain max-h-[85vh]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KineticTemplate;
