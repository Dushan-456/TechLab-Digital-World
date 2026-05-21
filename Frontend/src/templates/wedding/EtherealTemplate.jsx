import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineMap, HiOutlineCalendar, HiOutlineX, HiOutlineHeart } from "react-icons/hi";
import confetti from "canvas-confetti";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const CEREMONY_FALLBACK = "Wedding Ceremony";
const DRESS_FALLBACK = { title: "Formal", desc: "Evening Wear" };
const RECEPTION_FALLBACK = { title: "Evening Banquet", desc: "Dinner & Celebration" };

const fadeIn = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8, ease: [0.4, 0, 0.2, 1] } }) 
};

const EtherealTemplate = ({ data, guestName, guestCount, cardSettings = {} }) => {
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
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    return `${getOrdinal(day)} ${month}, ${year}`;
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
      colors: ["#B8A080", "#4A3F35", "#FAF7F2"]
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
    <div className="min-h-screen relative text-[#4A3F35] overflow-x-hidden font-sans" style={{ background: "linear-gradient(180deg, #FAF7F2 0%, #F0EBE3 50%, #E8E0D5 100%)" }}>
      {/* Background Music Player */}
      {data.backgroundMusic && (
        <>
          <audio ref={audioRef} src={`${API_BASE}${data.backgroundMusic}`} loop />
          <button 
            onClick={toggleMusic} 
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 bg-[#B8A080] text-[#FAF7F2]"
            aria-label="Toggle background music"
          >
            {isPlaying ? <HiOutlineVolumeUp className="text-2xl" /> : <HiOutlineVolumeOff className="text-2xl" />}
          </button>
        </>
      )}

      {/* Hero Cover Banner */}
      {coverUrl && (
        <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF7F2]/40 to-[#FAF7F2]" />
        </div>
      )}

      {/* Main Content Container */}
      <div className={`max-w-5xl mx-auto px-4 ${coverUrl ? 'pt-8' : 'pt-24'} pb-24`}>
        {/* Header / Welcome */}
        <motion.div initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
          <motion.div custom={0} variants={fadeIn} className="w-20 h-[1px] mx-auto mb-10" style={{ background: "linear-gradient(90deg, transparent, #B8A080, transparent)" }} />

          <motion.p custom={1} variants={fadeIn} className="text-xs md:text-sm tracking-[0.4em] uppercase mb-10 text-[#9E8E7E] px-4">
            {content?.welcomeText || "Together with their families, request the pleasure of your company"}
          </motion.p>

          {/* Couple Names */}
          <motion.div custom={2} variants={fadeIn} className="space-y-4 my-8">
            <h1 className="text-6xl md:text-8xl leading-none tracking-tight font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4A3F35" }}>
              {couple.bride}
            </h1>
            <p className="text-3xl md:text-4xl italic font-light py-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#B8A080" }}>&amp;</p>
            <h1 className="text-6xl md:text-8xl leading-none tracking-tight font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4A3F35" }}>
              {couple.groom}
            </h1>
          </motion.div>

          {/* Parents Section */}
          {hasParents && (
            <motion.div custom={3} variants={fadeIn} className="mt-10 pt-6 border-t border-[#B8A080]/20 max-w-md mx-auto space-y-3 text-xs md:text-sm tracking-[0.25em] uppercase text-[#9E8E7E]">
              {data.parents?.brideParents && <p>Daughter of {data.parents.brideParents}</p>}
              {data.parents?.groomParents && <p>Son of {data.parents.groomParents}</p>}
            </motion.div>
          )}

          <motion.div custom={4} variants={fadeIn} className="w-32 h-[1px] mx-auto my-16" style={{ background: "linear-gradient(90deg, transparent, #B8A080, transparent)" }} />
        </motion.div>

        {/* Event Details Section */}
        <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center my-16">
          {/* Date & Time */}
          <motion.div custom={5} variants={fadeIn} className="bg-[#FAF7F2]/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-[#B8A080]/15 flex flex-col items-center justify-center">
            <HiOutlineCalendar className="text-4xl text-[#B8A080] mb-4" />
            <p className="text-xs tracking-[0.4em] uppercase mb-3 text-[#B8A080] font-semibold">When</p>
            <p className="text-2xl md:text-3xl mb-2 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{formattedDate}</p>
            {displayTime && <p className="text-lg text-[#9E8E7E] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>at {displayTime}</p>}
            <button onClick={addToCalendar} className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B8A080] border-b border-[#B8A080] pb-1 hover:text-[#4A3F35] hover:border-[#4A3F35] transition-all">
              Add to Calendar
            </button>
          </motion.div>

          {/* Venue & Location */}
          <motion.div custom={6} variants={fadeIn} className="bg-[#FAF7F2]/80 backdrop-blur-sm p-10 rounded-2xl shadow-sm border border-[#B8A080]/15 flex flex-col items-center justify-center">
            <HiOutlineMap className="text-4xl text-[#B8A080] mb-4" />
            <p className="text-xs tracking-[0.4em] uppercase mb-3 text-[#B8A080] font-semibold">Where</p>
            <p className="text-xl md:text-2xl mb-4 font-medium px-4 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{event.location}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B8A080] border-b border-[#B8A080] pb-1 hover:text-[#4A3F35] hover:border-[#4A3F35] transition-all"
            >
              Get Directions
            </a>
          </motion.div>
        </motion.div>

        {/* Map Embed Section */}
        {hasMap && (
          <motion.div initial="hidden" animate="visible" custom={7} variants={fadeIn} className="my-16 max-w-4xl mx-auto">
            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-md border border-[#B8A080]/20 bg-[#FAF7F2]">
              <iframe title="Venue Map" src={event.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </motion.div>
        )}

        {/* Additional Event Information Grid (Ceremony, Reception, Dress Code) */}
        <motion.div initial="hidden" animate="visible" custom={8} variants={fadeIn} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="bg-[#FAF7F2]/60 backdrop-blur-sm p-8 rounded-xl border border-[#B8A080]/15 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#B8A080] mb-2 font-semibold">Ceremony</p>
            <p className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ceremonyLabel}</p>
          </div>
          <div className="bg-[#FAF7F2]/60 backdrop-blur-sm p-8 rounded-xl border border-[#B8A080]/15 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#B8A080] mb-2 font-semibold">Reception</p>
            <p className="text-xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{receptionInfo.title}</p>
            {receptionInfo.desc && <p className="text-xs text-[#9E8E7E] mt-1">{receptionInfo.desc}</p>}
          </div>
          <div className="bg-[#FAF7F2]/60 backdrop-blur-sm p-8 rounded-xl border border-[#B8A080]/15 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#B8A080] mb-2 font-semibold">Dress Code</p>
            <p className="text-xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{dressInfo.title}</p>
            {dressInfo.desc && <p className="text-xs text-[#9E8E7E] mt-1">{dressInfo.desc}</p>}
          </div>
        </motion.div>

        {/* Photo Gallery Section */}
        {hasGallery && (
          <motion.div initial="hidden" animate="visible" custom={9} variants={fadeIn} className="my-20 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-xs tracking-[0.4em] uppercase text-[#B8A080] font-semibold mb-2">Captured Moments</h3>
              <h2 className="text-4xl italic font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Gallery</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {data.galleryImages.map((img, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm cursor-pointer border border-[#B8A080]/20 bg-[#FAF7F2]"
                  onClick={() => setSelectedImage(`${API_BASE}${img}`)}
                >
                  <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RSVP Section */}
        <motion.div initial="hidden" animate="visible" custom={10} variants={fadeIn} className="my-20 max-w-xl mx-auto bg-[#FAF7F2]/90 backdrop-blur-md p-12 rounded-3xl shadow-sm border border-[#B8A080]/25 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B8A080] to-transparent" />
          <HiOutlineHeart className="text-4xl text-[#B8A080] mx-auto mb-6 animate-pulse" />
          <h3 className="text-xs uppercase font-bold tracking-[0.5em] text-[#B8A080] mb-4">RSVP</h3>
          <h2 className="text-3xl md:text-4xl font-light italic text-[#4A3F35] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Kindly respond by {rsvpDeadline || "the earliest convenience"}
          </h2>
          {guestName && (
            <p className="text-sm text-[#9E8E7E] mb-8">
              Reserved for <span className="font-semibold text-[#4A3F35]">{guestName}</span> {guestCount && `(& ${guestCount} guests)`}
            </p>
          )}
          <button 
            onClick={handleRSVP}
            className="px-10 py-4 bg-[#B8A080] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#9E8E7E] hover:shadow-lg active:scale-95 transition-all duration-300"
          >
            Confirm Attendance
          </button>
        </motion.div>

        {/* Footer Ornament */}
        <motion.div custom={11} variants={fadeIn} className="w-20 h-[1px] mx-auto mt-24 mb-8" style={{ background: "linear-gradient(90deg, transparent, #B8A080, transparent)" }} />
        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-[#9E8E7E]">Looking forward to celebrating with you</p>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#4A3F35]/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-[#FAF7F2] p-2 hover:rotate-90 transition-transform duration-300"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              <HiOutlineX className="text-3xl" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
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

export default EtherealTemplate;
