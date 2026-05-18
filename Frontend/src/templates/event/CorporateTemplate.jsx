import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineMap, HiOutlineCalendar, HiOutlineX, HiOutlineCheckCircle } from "react-icons/hi";
import confetti from "canvas-confetti";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const fadeIn = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] } }) 
};

const CorporateTemplate = ({ data, guestName, guestCount }) => {
  const { eventName, organizer, description, event, content } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const audioRef = useRef(null);

  const eventDate = new Date(event?.date || Date.now());
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
      colors: ["#06b6d4", "#10b981", "#3b82f6", "#ffffff"]
    });
  };

  const addToCalendar = () => {
    const start = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = eventName || "Corporate Event";
    const details = description || `Join us for ${eventName} hosted by ${organizer}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event?.location || '')}`;
    window.open(url, "_blank");
  };

  const hasCoverImage = !!data.coverImage;
  const coverUrl = hasCoverImage ? `${API_BASE}${data.coverImage}` : null;
  const hasGallery = data.galleryImages?.length > 0;
  const hasMap = !!event?.mapEmbedUrl;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-16 px-4 relative overflow-x-hidden font-sans">
      {/* Professional subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Background Music Player */}
      {data.backgroundMusic && (
        <>
          <audio ref={audioRef} src={`${API_BASE}${data.backgroundMusic}`} loop />
          <button 
            onClick={toggleMusic} 
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 bg-slate-800 border border-slate-700 text-cyan-400 hover:bg-slate-700 hover:border-cyan-500/50"
            aria-label="Toggle background music"
          >
            {isPlaying ? <HiOutlineVolumeUp className="text-2xl" /> : <HiOutlineVolumeOff className="text-2xl" />}
          </button>
        </>
      )}

      {/* Hero Cover Image Banner */}
      {coverUrl && (
        <div className="relative w-full max-w-5xl h-[40vh] md:h-[55vh] rounded-2xl overflow-hidden mb-12 shadow-2xl border border-slate-800">
          <motion.div 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
      )}

      {/* Main Corporate Card */}
      <motion.div initial="hidden" animate="visible" className="max-w-4xl w-full bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-16 border border-slate-800 relative overflow-hidden my-8 z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />

        {/* Organizer / Tagline */}
        <motion.div custom={0} variants={fadeIn} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-800">
          <div>
            <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-1">
              {organizer || "Exclusive Invitation"}
            </p>
            <p className="text-slate-400 text-sm italic">
              {content?.welcomeText || "Cordially requests the honor of your presence"}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-300 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Official Event
          </div>
        </motion.div>

        {/* Event Name */}
        <motion.h1 custom={1} variants={fadeIn} className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          {eventName}
        </motion.h1>

        {/* Description */}
        <motion.p custom={2} variants={fadeIn} className="text-base md:text-lg text-slate-300 mb-12 leading-relaxed font-light max-w-3xl">
          {description || "Join us for an exclusive gathering of industry leaders, innovators, and visionaries for an evening of insightful keynotes, networking, and celebration."}
        </motion.p>

        {/* Date & Location Bento Grid */}
        <motion.div custom={3} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          {/* Date & Time Box */}
          <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800/80 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <HiOutlineCalendar className="text-3xl text-cyan-400" />
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Date &amp; Schedule</p>
            </div>
            <p className="text-xl font-bold text-white mb-2">{formattedDate}</p>
            {displayTime && <p className="text-sm font-semibold text-cyan-400 mb-6">Commencing at {displayTime}</p>}
            <button 
              onClick={addToCalendar}
              className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800 hover:bg-slate-700 py-3 px-6 rounded-lg border border-slate-700 transition-all self-start"
            >
              Add to Calendar
            </button>
          </div>

          {/* Location Box */}
          <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800/80 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <HiOutlineMap className="text-3xl text-emerald-400" />
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Venue Location</p>
            </div>
            <p className="text-lg font-bold text-white mb-6 leading-relaxed">{event?.location}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.location || '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all self-start"
            >
              Get Directions
            </a>
          </div>
        </motion.div>

        {/* Map Embed Section */}
        {hasMap && (
          <motion.div custom={4} variants={fadeIn} className="my-12 rounded-xl overflow-hidden border border-slate-800 shadow-2xl h-96 w-full bg-slate-950">
            <iframe title="Venue Map" src={event?.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        )}

        {/* Photo Gallery Section */}
        {hasGallery && (
          <motion.div custom={5} variants={fadeIn} className="my-16 pt-12 border-t border-slate-800">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-1">Visual Overview</h3>
                <h2 className="text-2xl font-bold text-white">Event Highlights &amp; Venue</h2>
              </div>
              <p className="text-xs text-slate-500 italic">Click any image to expand</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.galleryImages.map((img, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-[16/10] rounded-lg overflow-hidden shadow-lg cursor-pointer border border-slate-800 bg-slate-950"
                  onClick={() => setSelectedImage(`${API_BASE}${img}`)}
                >
                  <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RSVP Section */}
        <motion.div custom={6} variants={fadeIn} className="my-12 bg-slate-950 p-10 md:p-12 rounded-2xl border border-slate-800 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500" />
          <HiOutlineCheckCircle className="text-5xl text-cyan-400 mx-auto mb-6 animate-pulse" />
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">Registration &amp; Attendance</h3>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">
            Kindly confirm attendance by {rsvpDeadline || "the earliest convenience"}
          </h2>
          {guestName && (
            <p className="text-sm text-slate-300 mb-8 font-medium">
              Pass allocated for <span className="font-bold text-cyan-400">{guestName}</span> {guestCount && `(& ${guestCount} guests)`}
            </p>
          )}
          <button 
            onClick={handleRSVP}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-widest shadow-xl hover:shadow-cyan-500/20 active:scale-95 transition-all duration-300"
          >
            Confirm Event Registration
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div custom={7} variants={fadeIn} className="pt-8 mt-12 border-t border-slate-800 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500">
            {organizer || "Corporate Event"} · Professional Excellence
          </p>
        </motion.div>
      </motion.div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 hover:rotate-90 transition-all duration-300 shadow-lg"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              <HiOutlineX className="text-2xl" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[85vh] rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900"
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

export default CorporateTemplate;
