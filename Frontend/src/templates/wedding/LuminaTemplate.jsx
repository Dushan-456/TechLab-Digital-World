import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineMap, HiOutlineCalendar, HiOutlineX, HiOutlineHeart } from "react-icons/hi";
import confetti from "canvas-confetti";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const CEREMONY_FALLBACK = "Wedding Ceremony";
const DRESS_FALLBACK = { title: "Formal", desc: "Evening Wear" };
const RECEPTION_FALLBACK = { title: "Evening Banquet", desc: "Dinner & Celebration" };

const fadeIn = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] } }) 
};

const LuminaTemplate = ({ data, guestName, guestCount, cardSettings = {} }) => {
  const { couple, event, content } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const audioRef = useRef(null);

  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString("en-US", { month: "long" });
  const year = eventDate.getFullYear();
  const weekday = eventDate.toLocaleDateString("en-US", { weekday: "long" });

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
      colors: ["#a78bfa", "#ec4899", "#ffffff"]
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
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-16 relative overflow-x-hidden" style={{ background: "linear-gradient(135deg, #1a1025 0%, #2d1b4e 30%, #1e1233 60%, #0f0d1a 100%)" }}>
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
      <div className="absolute top-3/4 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />

      {/* Floating Background Music Player */}
      {data.backgroundMusic && (
        <>
          <audio ref={audioRef} src={`${API_BASE}${data.backgroundMusic}`} loop />
          <button 
            onClick={toggleMusic} 
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 bg-gradient-to-r from-[#a78bfa] to-[#ec4899] text-white"
            aria-label="Toggle background music"
          >
            {isPlaying ? <HiOutlineVolumeUp className="text-2xl" /> : <HiOutlineVolumeOff className="text-2xl" />}
          </button>
        </>
      )}

      {/* Hero Cover Image Banner */}
      {coverUrl && (
        <div className="relative w-full max-w-5xl h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1025] via-[#1a1025]/40 to-transparent" />
        </div>
      )}

      <motion.div initial="hidden" animate="visible" className="relative w-full max-w-4xl space-y-12">
        {/* Main Glassmorphism Header Card */}
        <div className="rounded-3xl p-8 md:p-14 text-center relative overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a78bfa] via-[#ec4899] to-[#38bdf8]" />

          {/* Welcome Text */}
          <motion.p custom={0} variants={fadeIn} className="text-xs md:text-sm tracking-[0.3em] uppercase mb-8" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.6)" }}>
            {content?.welcomeText || "Together with their families"}
          </motion.p>

          {/* Couple Names */}
          <motion.div custom={1} variants={fadeIn} className="my-8">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {couple.bride}
            </h1>
            <div className="flex items-center justify-center gap-6 my-6">
              <div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4))" }} />
              <span className="text-3xl font-light bg-gradient-to-r from-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent" style={{ fontFamily: "'Cormorant Garamond', serif" }}>&amp;</span>
              <div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.4), transparent)" }} />
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {couple.groom}
            </h1>
          </motion.div>

          {/* Parents Section */}
          {hasParents && (
            <motion.div custom={2} variants={fadeIn} className="mt-10 pt-8 border-t border-white/10 max-w-lg mx-auto space-y-3 text-xs md:text-sm tracking-[0.25em] uppercase text-white/60">
              {data.parents?.brideParents && <p>Daughter of <span className="text-white/90">{data.parents.brideParents}</span></p>}
              {data.parents?.groomParents && <p>Son of <span className="text-white/90">{data.parents.groomParents}</span></p>}
            </motion.div>
          )}

          {/* Date Bento Grid */}
          <motion.div custom={3} variants={fadeIn} className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="rounded-2xl py-6 px-4 bg-white/[0.04] border border-white/10 hover:border-[#a78bfa]/50 transition-colors">
              <p className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{day}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Day</p>
            </div>
            <div className="rounded-2xl py-6 px-4 bg-white/[0.04] border border-white/10 hover:border-[#ec4899]/50 transition-colors">
              <p className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{month.slice(0, 3)}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Month</p>
            </div>
            <div className="rounded-2xl py-6 px-4 bg-white/[0.04] border border-white/10 hover:border-[#38bdf8]/50 transition-colors">
              <p className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{year}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Year</p>
            </div>
          </motion.div>

          <motion.p custom={4} variants={fadeIn} className="text-xs md:text-sm tracking-[0.25em] uppercase mt-6 text-[#a78bfa]">
            {weekday} {displayTime && `· ${displayTime}`}
          </motion.p>

          <motion.div custom={5} variants={fadeIn} className="mt-6">
            <button onClick={addToCalendar} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 border-b border-white/40 pb-1 hover:text-white hover:border-white transition-all">
              Add to Calendar
            </button>
          </motion.div>
        </div>

        {/* Venue & Map Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div custom={6} variants={fadeIn} className="rounded-3xl p-8 md:p-10 bg-white/[0.05] backdrop-blur-xl border border-white/10 flex flex-col justify-center items-center text-center shadow-xl">
            <HiOutlineMap className="text-4xl text-[#a78bfa] mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Venue Location</p>
            <p className="text-xl md:text-2xl text-white font-light mb-6 px-4 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{event.location}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95 transition-all duration-300"
            >
              Get Directions
            </a>
          </motion.div>

          {hasMap ? (
            <motion.div custom={7} variants={fadeIn} className="rounded-3xl overflow-hidden h-80 md:h-auto border border-white/10 shadow-xl bg-white/[0.02]">
              <iframe title="Venue Map" src={event.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </motion.div>
          ) : (
            <motion.div custom={7} variants={fadeIn} className="rounded-3xl p-8 md:p-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col justify-center items-center text-center shadow-xl">
              <HiOutlineCalendar className="text-4xl text-[#ec4899] mb-4" />
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Celebration Day</p>
              <p className="text-lg text-white/80 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>We look forward to sharing our special day with friends and family.</p>
            </motion.div>
          )}
        </div>

        {/* Additional Details Grid (Ceremony, Reception, Dress Code) */}
        <motion.div custom={8} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-8 bg-white/[0.04] backdrop-blur-lg border border-white/10 text-center hover:bg-white/[0.06] transition-colors">
            <p className="text-xs tracking-[0.3em] uppercase text-[#a78bfa] mb-2 font-semibold">Ceremony</p>
            <p className="text-xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ceremonyLabel}</p>
          </div>
          <div className="rounded-2xl p-8 bg-white/[0.04] backdrop-blur-lg border border-white/10 text-center hover:bg-white/[0.06] transition-colors">
            <p className="text-xs tracking-[0.3em] uppercase text-[#ec4899] mb-2 font-semibold">Reception</p>
            <p className="text-xl text-white font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{receptionInfo.title}</p>
            {receptionInfo.desc && <p className="text-xs text-white/50 mt-1">{receptionInfo.desc}</p>}
          </div>
          <div className="rounded-2xl p-8 bg-white/[0.04] backdrop-blur-lg border border-white/10 text-center hover:bg-white/[0.06] transition-colors">
            <p className="text-xs tracking-[0.3em] uppercase text-[#38bdf8] mb-2 font-semibold">Dress Code</p>
            <p className="text-xl text-white font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{dressInfo.title}</p>
            {dressInfo.desc && <p className="text-xs text-white/50 mt-1">{dressInfo.desc}</p>}
          </div>
        </motion.div>

        {/* Photo Gallery Section */}
        {hasGallery && (
          <motion.div custom={9} variants={fadeIn} className="rounded-3xl p-8 md:p-12 bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="text-center mb-10">
              <h3 className="text-xs tracking-[0.4em] uppercase text-[#a78bfa] font-semibold mb-2">Captured Moments</h3>
              <h2 className="text-4xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Gallery</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.galleryImages.map((img, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg cursor-pointer border border-white/10 bg-white/[0.02]"
                  onClick={() => setSelectedImage(`${API_BASE}${img}`)}
                >
                  <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RSVP Section */}
        <motion.div custom={10} variants={fadeIn} className="rounded-3xl p-10 md:p-14 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/15 text-center relative overflow-hidden shadow-2xl max-w-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a78bfa] via-[#ec4899] to-[#38bdf8]" />
          <HiOutlineHeart className="text-5xl text-[#ec4899] mx-auto mb-6 animate-pulse" />
          <h3 className="text-xs uppercase font-bold tracking-[0.5em] text-[#a78bfa] mb-4">RSVP</h3>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Kindly respond by {rsvpDeadline || "the earliest convenience"}
          </h2>
          {guestName && (
            <p className="text-sm text-white/70 mb-8">
              Reserved for <span className="font-semibold text-white">{guestName}</span> {guestCount && `(& ${guestCount} guests)`}
            </p>
          )}
          <button 
            onClick={handleRSVP}
            className="px-10 py-4 bg-gradient-to-r from-[#a78bfa] to-[#ec4899] text-white rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:shadow-[0_0_25px_rgba(167,139,250,0.5)] active:scale-95 transition-all duration-300"
          >
            Confirm Attendance
          </button>
        </motion.div>
      </motion.div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0f0d1a]/95 backdrop-blur-xl flex items-center justify-center p-4"
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
              className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
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

export default LuminaTemplate;
