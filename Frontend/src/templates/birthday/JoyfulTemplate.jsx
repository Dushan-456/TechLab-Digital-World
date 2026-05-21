import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineMap, HiOutlineCalendar, HiOutlineX, HiOutlineHeart } from "react-icons/hi";
import confetti from "canvas-confetti";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const fadeIn = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8, ease: [0.4, 0, 0.2, 1] } }) 
};

const JoyfulTemplate = ({ data, guestName, guestCount }) => {
  const { celebrantName, age, event, content } = data;
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
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#f472b6", "#c084fc", "#60a5fa", "#facc15", "#38bdf8"]
    });
  };

  const addToCalendar = () => {
    const start = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = `${celebrantName}'s ${age ? age + 'th ' : ''}Birthday Party!`;
    const details = `Join us for ${celebrantName}'s birthday celebration at ${event?.location}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event?.location || '')}`;
    window.open(url, "_blank");
  };

  const hasCoverImage = !!data.coverImage;
  const coverUrl = hasCoverImage ? `${API_BASE}${data.coverImage}` : null;
  const hasGallery = data.galleryImages?.length > 0;
  const hasMap = !!event?.mapEmbedUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 text-gray-800 flex flex-col items-center py-16 px-4 relative overflow-x-hidden font-sans">
      {/* Decorative floating balloons/shapes */}
      <motion.div className="absolute top-12 left-10 w-24 h-32 rounded-full bg-pink-300 opacity-30 blur-xl pointer-events-none" animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute top-1/3 right-10 w-32 h-32 rounded-full bg-purple-300 opacity-30 blur-xl pointer-events-none" animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-yellow-200 opacity-30 blur-xl pointer-events-none" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }} />

      {/* Background Music Player */}
      {data.backgroundMusic && (
        <>
          <audio ref={audioRef} src={`${API_BASE}${data.backgroundMusic}`} loop />
          <button 
            onClick={toggleMusic} 
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            aria-label="Toggle background music"
          >
            {isPlaying ? <HiOutlineVolumeUp className="text-3xl" /> : <HiOutlineVolumeOff className="text-3xl" />}
          </button>
        </>
      )}

      {/* Hero Cover Image Banner */}
      {coverUrl && (
        <div className="relative w-full max-w-4xl h-[45vh] md:h-[60vh] rounded-3xl overflow-hidden mb-12 shadow-2xl border-4 border-white">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      {/* Main Invitation Card */}
      <motion.div initial="hidden" animate="visible" className="max-w-3xl w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-14 text-center border-4 border-pink-200 relative overflow-hidden my-8">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400" />

        <motion.h2 custom={0} variants={fadeIn} className="text-pink-500 font-extrabold tracking-widest uppercase text-sm md:text-base mb-4 bg-pink-100 py-2 px-6 rounded-full inline-block shadow-sm">
          🎉 You're Invited!
        </motion.h2>

        <motion.h1 custom={1} variants={fadeIn} className="text-5xl md:text-7xl font-black text-gray-800 my-4 tracking-tight">
          {celebrantName}'s
        </motion.h1>

        {age && (
          <motion.div custom={2} variants={fadeIn} className="my-6">
            <span className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 drop-shadow-sm">
              {age}th Birthday Party!
            </span>
          </motion.div>
        )}

        <motion.p custom={3} variants={fadeIn} className="text-lg md:text-xl text-gray-600 my-8 italic font-medium px-4 leading-relaxed">
          "{content?.welcomeText || 'Join us for a wonderful celebration full of fun, laughter, and cake!'}"
        </motion.p>

        {/* Date & Time Bento */}
        <motion.div custom={4} variants={fadeIn} className="bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-pink-100 shadow-inner my-8 flex flex-col items-center justify-center">
          <HiOutlineCalendar className="text-5xl text-pink-500 mb-4" />
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{formattedDate}</p>
          {displayTime && <p className="text-lg font-bold text-purple-600 bg-white py-1 px-6 rounded-full shadow-sm mt-2">⏰ {displayTime}</p>}
          
          <button onClick={addToCalendar} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 underline underline-offset-4 transition-all">
            Add to Google Calendar
          </button>
        </motion.div>

        {/* Venue Section */}
        <motion.div custom={5} variants={fadeIn} className="bg-white p-8 rounded-2xl border-2 border-purple-100 shadow-md my-8 flex flex-col items-center justify-center">
          <HiOutlineMap className="text-5xl text-purple-500 mb-4" />
          <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-2">Party Venue</p>
          <p className="text-xl font-bold text-gray-800 mb-6 px-4">{event?.location}</p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.location || '')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600 text-white shadow-lg hover:bg-purple-700 active:scale-95 transition-all duration-300"
          >
            📍 Get Directions
          </a>
        </motion.div>

        {/* Map Embed Section */}
        {hasMap && (
          <motion.div custom={6} variants={fadeIn} className="my-8 overflow-hidden rounded-2xl border-4 border-pink-100 shadow-lg h-80 w-full">
            <iframe title="Venue Map" src={event?.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        )}

        {/* Photo Gallery Section */}
        {hasGallery && (
          <motion.div custom={7} variants={fadeIn} className="my-12">
            <h3 className="text-xs font-extrabold tracking-widest uppercase text-pink-500 mb-2">Memory Lane</h3>
            <h2 className="text-3xl font-black text-gray-800 mb-8">Celebrant Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.galleryImages.map((img, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  whileTap={{ scale: 0.97 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer border-4 border-white bg-pink-50"
                  onClick={() => setSelectedImage(`${API_BASE}${img}`)}
                >
                  <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RSVP Section */}
        <motion.div custom={8} variants={fadeIn} className="my-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white p-10 md:p-12 rounded-3xl shadow-xl text-center relative overflow-hidden">
          <HiOutlineHeart className="text-6xl text-white mx-auto mb-6 animate-bounce" />
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-pink-200 mb-2">RSVP</h3>
          <h2 className="text-3xl font-black mb-6">
            Kindly respond by {rsvpDeadline || "the earliest convenience"}
          </h2>
          {guestName && (
            <p className="text-base text-pink-100 mb-8 font-medium">
              Reserved for <span className="font-extrabold text-white">{guestName}</span> {guestCount && `(& ${guestCount} guests)`}
            </p>
          )}
          <button 
            onClick={handleRSVP}
            className="px-10 py-5 bg-white text-pink-600 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl hover:bg-yellow-300 hover:text-gray-900 active:scale-95 transition-all duration-300"
          >
            🎈 Confirm Attendance
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p custom={9} variants={fadeIn} className="text-xs font-bold tracking-widest uppercase text-gray-400 mt-12">
          We can't wait to celebrate with you!
        </motion.p>
      </motion.div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white p-3 bg-pink-500 rounded-full hover:rotate-90 transition-transform duration-300 shadow-lg"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              <HiOutlineX className="text-2xl" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
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

export default JoyfulTemplate;
