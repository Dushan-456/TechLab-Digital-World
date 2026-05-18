import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineChevronDoubleDown, HiOutlineArrowNarrowDown, HiOutlineMap, HiOutlineCalendar, HiOutlineX, HiOutlineHeart } from "react-icons/hi";
import confetti from "canvas-confetti";
import ringImg from "../../assets/images/ring.png";
import coverImg from "../../assets/images/wedding.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

// Fallback labels in case card settings haven't loaded
const CEREMONY_FALLBACK = "Wedding Ceremony";
const DRESS_FALLBACK = { title: "Formal", desc: "Evening Wear" };
const RECEPTION_FALLBACK = { title: "Evening Banquet", desc: "Dinner & Celebration" };

const DecorativeDivider = () => {
  const { scrollYProgress } = useScroll();
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.4 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center gap-4 my-12"
    >
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#8a6520] origin-right"
      ></motion.div>
      <div className="w-2.5 h-2.5 rotate-45 border border-[#8a6520] relative">
        <div className="absolute inset-0.5 bg-[#8a6520]/20 rotate-45"></div>
      </div>
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#8a6520] origin-left"
      ></motion.div>
    </motion.div>
  );
};

const GoldParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full shadow-[0_0_10px_rgba(201,168,76,0.3)]"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            backgroundColor: i % 3 === 0 ? "#8a6520" : i % 2 === 0 ? "#c9a84c" : "#b8892e",
          }}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 
          }}
          animate={{
            y: [null, Math.random() * -300, Math.random() * 300],
            x: [null, Math.random() * -150, Math.random() * 150],
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 1.8, 1]
          }}
          transition={{
            duration: 20 + Math.random() * 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const RoyalGoldTemplate = ({ data, guestName, guestCount, cardSettings = {} }) => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardSlide, setCardSlide] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showWelcomeNote, setShowWelcomeNote] = useState(false);
  const audioRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 800], [0, 250]);

  useEffect(() => {
    // Simulate preloading for the custom loader
    const timer = setTimeout(() => setIsPreloading(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const target = new Date(data.event.date);
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      if (difference <= 0) { clearInterval(interval); } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data.event.date]);

  const toggleMusic = () => {
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setIsPlaying(!isPlaying);
  };

  const handleOpen = () => {
    if (flapOpen || isOpen) return;
    setFlapOpen(true);
    setTimeout(() => { setCardSlide(true); if (audioRef.current) { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); } }, 900);
    setTimeout(() => { setShowContent(true); }, 3200);
    setTimeout(() => { setIsOpen(true); setShowWelcomeNote(true); setTimeout(() => setShowWelcomeNote(false), 5000); }, 4000);
  };

  const handleRSVP = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8a6520", "#c9a84c", "#fdf8f0"]
    });
    // Add submission logic here
  };

  const addToCalendar = () => {
    const eventDate = new Date(data.event.date);
    const start = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = `${data.couple.bride} & ${data.couple.groom}'s Wedding`;
    const details = `Join us for the wedding of ${data.couple.bride} and ${data.couple.groom} at ${data.event.location}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(data.event.location)}`;
    window.open(url, "_blank");
  };

  const formattedDate = (() => {
    const d = new Date(data.event.date);
    return `${d.getDate()} · ${d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} · ${d.getFullYear()}`;
  })();

  const hasCoverImage = !!data.coverImage;
  const coverUrl = hasCoverImage ? `${API_BASE}${data.coverImage}` : coverImg;
  const hasParents = data.parents?.brideParents || data.parents?.groomParents;
  const hasGallery = data.galleryImages?.length > 0;
  const hasMap = !!data.event?.mapEmbedUrl;

  // Resolve ceremony label from dynamic card settings
  const ceremonyEntry = (cardSettings.ceremonyTypes || []).find(c => Number(c.value) === Number(data.ceremonyType));
  const ceremonyLabel = ceremonyEntry ? ceremonyEntry.label : CEREMONY_FALLBACK;

  // Resolve dress code from dynamic card settings
  const dressEntry = (cardSettings.dressCodes || []).find(d => Number(d.value) === Number(data.dressCode));
  const dressInfo = dressEntry
    ? { title: dressEntry.label, desc: dressEntry.description || "" }
    : DRESS_FALLBACK;

  // Resolve reception type from dynamic card settings
  const receptionEntry = (cardSettings.receptionTypes || []).find(r => Number(r.value) === Number(data.receptionType));
  const receptionInfo = receptionEntry
    ? { title: receptionEntry.label, desc: receptionEntry.description || "" }
    : RECEPTION_FALLBACK;

  const eventTime = data.event?.time || "";

  // Format time for display (convert 24h "14:30" to "02:30 PM")
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

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }} className="min-h-screen bg-[#fdf8f0] text-[#4a3f35] overflow-x-hidden relative">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .signature-font { font-family: 'Great Vibes', cursive; }
          .paper-texture {
            background-image: url("https://www.transparenttextures.com/patterns/cream-paper.png");
            background-repeat: repeat;
          }
        `}
      </style>

      {/* ── CUSTOM LOADER ────────────────────────────────────── */}
      <AnimatePresence>
        {isPreloading && (
          <motion.div 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-[#fdf8f0] flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-24 h-24 flex items-center justify-center relative"
            >
              <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-xl">
                <circle cx="30" cy="30" r="28" fill="#c9a84c" />
                <circle cx="30" cy="30" r="20" fill="#b8892e" />
                <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill="#fdf8f0" fontSize="11" fontWeight="bold" fontStyle="italic">
                  RG
                </text>
              </svg>
              <motion.div 
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full border-2 border-[#8a6520]/20 animate-ping"></div>
              </motion.div>
            </motion.div>
            <p className="mt-8 text-xs uppercase font-bold tracking-[0.5em] text-[#8a6520]">Preparing Your Invitation</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 paper-texture opacity-30 pointer-events-none z-0" />
      <GoldParticles />

      {data.backgroundMusic && (
        <audio ref={audioRef} loop src={`${API_BASE}${data.backgroundMusic}`} />
      )}

      {/* ── WELCOME NOTE ──────────────────────────────────────── */}
      <AnimatePresence>
        {showWelcomeNote && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-white/80 backdrop-blur-md border border-[#8a6520]/20 px-8 py-3 rounded-full shadow-lg"
          >
            <p className="text-sm signature-font text-[#8a6520] whitespace-nowrap">
              So glad you could join us, {guestName || "dear guest"}!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ENVELOPE COVER ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: showContent ? 0 : 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fdf8f0] overflow-hidden"
            onClick={handleOpen} style={{ cursor: "pointer" }}>
            <p className="text-[11px] uppercase font-bold mb-14" style={{ letterSpacing: "0.55em", color: "#8a6520" }}>
              A Wedding Invitation Awaits
            </p>

            {/* THE ENVELOPE */}
            <div className="relative" style={{ width: "min(420px, 88vw)", height: "min(280px, 59vw)", boxShadow: "0 8px 30px rgba(138, 101, 32, 0.12), 0 20px 60px rgba(0, 0, 0, 0.08)", borderRadius: "3px" }}>
              <div className="absolute inset-0 rounded-sm" style={{ background: "#eee0beff", zIndex: 1 }} />

              {/* Internal Card */}
              <div className="absolute flex flex-col items-center justify-center text-center"
                style={{ top: "8px", left: "8px", right: "8px", bottom: "8px", paddingTop: "17%", background: "#fdf8f0", border: "1px solid rgba(138, 101, 32, 0.15)", zIndex: 3,
                  transition: cardSlide ? "transform 2.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                  transform: cardSlide ? "translateY(-120%)" : "translateY(0)" }}>
                <div className="px-15 pt-15 pb-13" style={{ background: "#fdf8f0", boxShadow: "0 4px 20px rgba(138, 101, 32, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)", borderRadius: "4px", border: "1px solid rgba(138, 101, 32, 0.08)" }}>
                  <h2 className="text-bold italic" style={{ fontSize: "min(2.2rem, 7vw)", color: "#8a6520", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                    {data.couple.bride} & {data.couple.groom}
                  </h2>
                  <div style={{ width: "40px", height: "1px", background: "rgba(138, 101, 32, 0.15)", margin: "1px auto" }} />
                  <p style={{ fontSize: "12px", letterSpacing: "0.45em", color: "rgba(138, 101, 32, 0.5)" }}>{formattedDate}</p>
                </div>
              </div>

              {/* Left crease */}
              <div className="absolute top-0 left-0" style={{ width: 0, height: 0, borderBottom: "min(140px, 29.5vw) solid #f0e4ca", borderRight: "min(210px, 44vw) solid transparent", borderTop: "min(140px, 29.5vw) solid transparent", zIndex: 5 }} />
              {/* Right crease */}
              <div className="absolute top-0 right-0" style={{ width: 0, height: 0, borderBottom: "min(140px, 29.5vw) solid #eadbb8", borderLeft: "min(210px, 44vw) solid transparent", borderTop: "min(140px, 29.5vw) solid transparent", zIndex: 5 }} />
              {/* Bottom fold */}
              <div className="absolute bottom-0 left-0 w-full" style={{ width: 0, height: 0, borderBottom: "min(70px, 21vw) solid #f5ebd1ff", borderLeft: "min(210px, 44vw) solid transparent", borderRight: "min(210px, 44vw) solid transparent", zIndex: 5, marginLeft: "auto", marginRight: "auto", left: 0, right: 0 }} />

              {/* Top Flap */}
              <div className="absolute top-0 left-0 w-full"
                style={{ height: "55%", transformOrigin: "top center",
                  transform: flapOpen ? "perspective(800px) rotateX(-180deg)" : "perspective(800px) rotateX(0deg)",
                  transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s 0.45s", zIndex: flapOpen ? 2 : 6 }}>
                <div style={{ width: "100%", height: "100%", clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "#f0e4ca", boxShadow: "0 4px 12px rgba(138, 101, 32, 0.1)" }} />
              </div>

              {/* Wax Seal */}
              <div className="absolute flex items-center justify-center"
                style={{ width: "min(60px, 13vw)", height: "min(60px, 13vw)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10,
                  opacity: flapOpen ? 0 : 1, transition: "opacity 0.3s ease", filter: "drop-shadow(0 2px 8px rgba(138, 101, 32, 0.3))" }}>
                <svg viewBox="0 0 60 60" className="w-full h-full">
                  <circle cx="30" cy="30" r="28" fill="#c9a84c" />
                  <circle cx="30" cy="30" r="23" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  <circle cx="30" cy="30" r="20" fill="#b8892e" />
                  <circle cx="30" cy="30" r="17" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                  <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill="#fdf8f0" fontSize="11" fontWeight="bold" fontStyle="italic" fontFamily="'Cormorant Garamond', Georgia, serif">
                    {data.couple.bride?.[0]}&{data.couple.groom?.[0]}
                  </text>
                </svg>
              </div>
            </div>

            {/* Open Button */}
            <div className="mt-16 text-center space-y-8">
              <button onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                style={{ padding: "14px 56px", border: "1px solid #8a6520", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5em", textTransform: "uppercase", color: "#8a6520", background: "transparent", cursor: "pointer", transition: "all 0.5s ease", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                onMouseEnter={(e) => { e.target.style.background = "#8a6520"; e.target.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#8a6520"; }}>
                Open Invitation
              </button>
              <p style={{ fontSize: "12px", letterSpacing: "0.2em", color: "rgba(138, 101, 32, 0.5)", textTransform: "uppercase" }}>
                ✧&nbsp;&nbsp;Tap to reveal your invitation&nbsp;&nbsp;✧
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative">
          {/* Floating Music Button */}
          {data.backgroundMusic && (
            <button 
              onClick={toggleMusic} 
              className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(138,101,32,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 bg-[#8a6520] text-[#fdf8f0]"
            >
              {isPlaying ? <HiOutlineVolumeUp className="text-2xl" /> : <HiOutlineVolumeOff className="text-2xl" />}
            </button>
          )}

          {/* ── HERO SECTION ─────────────────────────────────── */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center relative px-4 overflow-hidden pb-20">
            
            {coverUrl && (
              <div className="absolute top-0 left-0 w-full h-[70vh] overflow-hidden z-0">
                <motion.div 
                  initial={{ scale: 1.15, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ 
                    backgroundImage: `url(${coverUrl})`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center",
                    y: heroParallax,
                    height: "130%",
                    top: "-15%"
                  }}
                  transition={{ duration: 8, ease: "easeOut" }}
                  className="absolute inset-0 w-full" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdf8f0]/99 via-[#fdf8f0]/60 to-[#fdf8f0]" />
              </div>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 2 }}
              className="relative z-10 w-full max-w-4xl pt-20 pb-12 flex flex-col items-center"
            >
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-[13px] md:text-sm uppercase font-bold tracking-[0.6em] text-[#8a6520] mb-8"
              >
                The Wedding Celebration of
              </motion.p>
              
              {/* Flipping Ring (Continuous Mirror) */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 50 }}
              >
                <motion.div 
                  animate={{ scaleX: [1, -1, 1], rotate: [0, 5, 0, -5, 0] }} 
                  transition={{ 
                    scaleX: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                  }}
                  className="mx-auto w-24 h-24 md:w-36 md:h-36 mb-12"
                >
                  <img src={ringImg} alt="Ring" className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(138,101,32,0.2)]" />
                </motion.div>
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
                  className="text-7xl md:text-[140px] uppercase tracking-tighter text-[#8a6520] leading-none" 
                  style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 20px 40px rgba(138,101,32,0.25)" }}
                >
                  {data.couple.bride}
                </motion.h1>
                <motion.p 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="text-5xl md:text-[90px] uppercase italic text-[#8a6520]/60" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >&</motion.p>
                <motion.h1 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
                  className="text-7xl md:text-[140px] uppercase tracking-tighter text-[#8a6520] leading-none" 
                  style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 20px 40px rgba(138,101,32,0.25)" }}
                >
                  {data.couple.groom}
                </motion.h1>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="pt-16 flex flex-col items-center gap-6"
              >
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#8a6520] to-transparent"></div>
                <div className="space-y-3">
                  <p className="text-xl md:text-2xl font-light italic tracking-[0.1em] text-[#4a3f35]">
                    Save the Date
                  </p>
                  <p className="text-[18px] md:text-2xl font-bold uppercase tracking-[0.3em] text-[#8a6520]">
                    {formattedDate}
                  </p>
                  <p className="text-[14px] md:text-lg font-medium uppercase tracking-[0.2em] text-[#8a6520]/70">
                    {data.event.location}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="absolute bottom-12 z-10 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div 
                animate={{ y: [0, 12, 0] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-[1px] h-12  bg-gradient-to-b from-transparent to-[#8a6520]"></div>
                <HiOutlineArrowNarrowDown className="text-[#8a6520] text-xl -mt-1" />
              </motion.div>
              <span className="text-[8px] uppercase font-bold tracking-[0.5em] text-[#8a6520]/40 mt-4">Scroll</span>
            </motion.div>
          </section>

          {/* ── PARENTS SECTION ──────────────────────────────── */}
          {hasParents && (
            <section className="py-20 px-8 text-center bg-[#fdf8f0]">
              <motion.div 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 1.2 }} 
                className="max-w-4xl mx-auto"
              >
                <div className="flex flex-col items-center gap-12">
                  <div className="space-y-4">
                    <p className="text-[11px] uppercase font-bold tracking-[0.5em] text-[#8a6520]/50 mb-6">Honoring Our Heritage</p>
                    {data.parents.brideParents && (
                      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-3xl md:text-4xl font-light italic text-[#4a3f35]">{data.parents.brideParents}</motion.p>
                    )}
                  </div>

                  <div className="relative w-full flex items-center justify-center">
                    <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8a6520]/20 to-transparent"></div>
                    <div className="relative bg-[#fdf8f0] px-8">
                      <h3 className="text-xs md:text-sm uppercase font-bold tracking-[0.6em] text-[#8a6520]">Together With</h3>
                    </div>
                  </div>

                  {data.parents.groomParents && (
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-3xl md:text-4xl font-light italic text-[#4a3f35]">{data.parents.groomParents}</motion.p>
                  )}
                </div>
              </motion.div>
            </section>
          )}

          <DecorativeDivider />

          {/* ── GUEST PERSONALIZATION ────────────────────────── */}
          <section className=" px-8 text-center bg-[#fdf8f0]">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} className="max-w-2xl mx-auto py-16"
              style={{  borderBottom: "1px solid rgba(138,101,32,0.15)" }}>
              <p className="text-sm uppercase mb-6" style={{ letterSpacing: "0.3em" }}>Warmly invite to</p>
              <h2 className="text-4xl md:text-5xl font-light mb-8 italic">{guestName || "YOU"}</h2>
              <p className="text-lg leading-relaxed font-light" style={{ color: "#6b5e51" }}>
                  To celebrate the joyous union of their children.              </p>
                  <br />
              <p className="text-lg leading-relaxed font-light" style={{ color: "#6b5e51" }}>
                We are overjoyed to share this special day with you. Your presence means the world to us as we begin our journey together.
              </p>
            </motion.div>
          </section>

          {/* ── COUNTDOWN ────────────────────────────────────── */}
          <section className="py-20 bg-[#fdf8f0] text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.2] pointer-events-none flex items-center justify-center">
              <img src={coverUrl} alt="" className="absolute top-0 left-0 w-full h-full object-cover  z-0 scale-110" />
            </div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative z-10">
              <h3 className="text-xs md:text-sm uppercase font-bold mb-16 tracking-[0.6em] text-[#8a6520]">Counting Down To Forever</h3>
              <div className="flex justify-center flex-wrap gap-6 md:gap-10 px-4">
                {[{ label: "Days", value: timeLeft.days }, { label: "Hours", value: timeLeft.hours }, { label: "Mins", value: timeLeft.minutes }, { label: "Secs", value: timeLeft.seconds }].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center w-28 h-32 md:w-40 md:h-48 border border-[#8a6520]/10 rounded-3xl bg-white/40 backdrop-blur-xl shadow-[0_15px_40px_rgba(138,101,32,0.06)] hover:border-[#8a6520]/30 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <span className="text-4xl md:text-6xl font-light mb-2 text-[#4a3f35] group-hover:scale-110 transition-transform duration-700 ease-out">{String(item.value).padStart(2, "0")}</span>
                    <span className="text-[10px] md:text-[12px] uppercase font-bold tracking-[0.3em] text-[#8a6520]/60">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          <DecorativeDivider />

          {/* ── CEREMONY, DRESS CODE & DETAILS ───────────────── */}
          <section className="py-24 px-8 bg-[#fdf8f0]">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
              {/* Ceremony */}
              <div className="space-y-6 text-center group">
                <h3 className="text-2xl pb-4 border-b border-[#8a6520]/20 group-hover:border-[#8a6520]/60 transition-colors">Ceremony</h3>
                {displayTime && (
                  <p className="text-lg uppercase font-bold tracking-[0.2em] text-[#8a6520]">{displayTime}</p>
                )}
                <p className="text-lg">{ceremonyLabel}</p>
                <p className="font-light leading-relaxed text-[#8a8a8a]">{data.event.location}</p>
                <button 
                  onClick={addToCalendar}
                  className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#8a6520] hover:scale-105 transition-transform"
                >
                  <HiOutlineCalendar className="text-lg" />
                  Add to Calendar
                </button>
              </div>

              {/* Dress Code */}
              <div className="space-y-6 text-center">
                <h3 className="text-2xl pb-4" style={{ borderBottom: "1px solid rgba(138,101,32,0.2)" }}>Dress Code</h3>
                <p className="text-sm uppercase font-bold" style={{ letterSpacing: "0.2em", color: "#8a6520" }}>{dressInfo.title}</p>
                <p className="text-lg">{dressInfo.desc}</p>
                <p className="font-light leading-relaxed" style={{ color: "#8a8a8a" }}> But your presence is what matters most!</p>
              </div>

              {/* Reception */}
              <div className="space-y-6 text-center">
                <h3 className="text-2xl pb-4" style={{ borderBottom: "1px solid rgba(138,101,32,0.2)" }}>Reception</h3>
                <p className="text-sm uppercase font-bold" style={{ letterSpacing: "0.2em", color: "#8a6520" }}>{receptionInfo.title}</p>
                <p className="text-lg">{receptionInfo.desc}</p>
                <p className="font-light leading-relaxed" style={{ color: "#8a8a8a" }}>{data.event.location}</p>
              </div>
            </div>
          </section>

          {hasGallery && (
            <section className="py-24 px-8 bg-[#fdf8f0]">
              <h3 className="text-xs uppercase font-bold mb-12 text-center tracking-[0.4em] text-[#8a6520]">Our Moments</h3>
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
                {data.galleryImages.map((img, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.05, y: -5 }} 
                    transition={{ duration: 0.4 }}
                    className="aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] cursor-zoom-in"
                    onClick={() => setSelectedImage(`${API_BASE}${img}`)}
                  >
                    <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── PHOTO LIGHTBOX ───────────────────────────────── */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] bg-[#fdf8f0]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                onClick={() => setSelectedImage(null)}
              >
                <motion.button 
                  className="absolute top-8 right-8 text-[#8a6520] text-3xl z-20"
                  onClick={() => setSelectedImage(null)}
                >
                  <HiOutlineX />
                </motion.button>
                <motion.img 
                  layoutId={selectedImage}
                  src={selectedImage} 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── MAP EMBED ────────────────────────────────────── */}
          {hasMap && (
            <section className="bg-[#fdf8f0]">
              <div className="h-96 w-full grayscale contrast-125 opacity-70 border-y border-[#8a6520]/10">
                <iframe title="Venue Map" src={data.event.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div className="py-16 text-center">
                  <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 border border-[#8a6520]/60 text-[#8a6520] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#8a6520] hover:text-[#fdf8f0] transition-all duration-500 shadow-sm"
                  >
                    <HiOutlineMap className="text-base" />
                  Get Directions
                  </a>
                </div>
            </section>
          )}

          {/* ── RSVP ─────────────────────────────────────────── */}
          <section className="py-24 px-8 bg-[#fdf8f0]">
            <div className="max-w-xl mx-auto text-center space-y-16">
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-bold tracking-[0.5em] text-[#8a6520]">RSVP</h3>
                <h2 className="text-4xl md:text-5xl font-light italic text-[#4a3f35] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Kindly respond by {rsvpDeadline || "the earliest convenience"}
                </h2>
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#8a6520]/70">Your presence is the greatest gift</p>
              </div>

              <form onSubmit={handleRSVP} className="space-y-12 text-left pt-8">
                {/* Name Field */}
                <div className="relative group">
                  <input 
                    defaultValue={guestName} 
                    placeholder=" " 
                    className="w-full py-4 bg-transparent border-b border-[#8a6520]/30 outline-none transition-all focus:border-[#8a6520] text-lg font-light peer"
                  />
                  <label className="absolute top-4 left-0 text-[#8a6520]/50 text-xs uppercase font-bold tracking-[0.2em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#8a6520] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                    Your Name
                  </label>
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <input 
                    type="email"
                    placeholder=" " 
                    className="w-full py-4 bg-transparent border-b border-[#8a6520]/30 outline-none transition-all focus:border-[#8a6520] text-lg font-light peer"
                  />
                  <label className="absolute top-4 left-0 text-[#8a6520]/50 text-xs uppercase font-bold tracking-[0.2em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#8a6520] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                    Email Address
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Attending Selection */}
                  <div className="relative group">
                    <select className="w-full py-4 bg-transparent border-b border-[#8a6520]/30 outline-none transition-all focus:border-[#8a6520] text-lg font-light appearance-none cursor-pointer peer">
                      <option value="yes">Yes, I'll be there!</option>
                      <option value="no">Regretfully decline</option>
                    </select>
                    <label className="absolute -top-4 left-0 text-[#8a6520] text-[10px] uppercase font-bold tracking-[0.2em]">
                      Attending?
                    </label>
                  </div>

                  {/* Guests Field */}
                  <div className="relative group">
                    <input 
                      type="number"
                      defaultValue={guestCount || 1}
                      placeholder=" " 
                      className="w-full py-4 bg-transparent border-b border-[#8a6520]/30 outline-none transition-all focus:border-[#8a6520] text-lg font-light peer"
                    />
                    <label className="absolute top-4 left-0 text-[#8a6520]/50 text-xs uppercase font-bold tracking-[0.2em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#8a6520] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                      Number of Guests
                    </label>
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative group">
                  <textarea 
                    rows={1}
                    placeholder=" " 
                    className="w-full py-4 bg-transparent border-b border-[#8a6520]/30 outline-none transition-all focus:border-[#8a6520] text-lg font-light peer resize-none"
                  />
                  <label className="absolute top-4 left-0 text-[#8a6520]/50 text-xs uppercase font-bold tracking-[0.2em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#8a6520] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                    A message for the couple (Optional)
                  </label>
                </div>

                <div className="pt-10">
                  <button 
                    type="submit" 
                    className="w-full py-6 border border-[#8a6520] text-[#8a6520] text-xs font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-[#8a6520] hover:text-[#fdf8f0] active:scale-95 shadow-lg flex items-center justify-center gap-3"
                  >
                    <HiOutlineHeart className="text-lg" />
                    Confirm Attendance
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ── FOOTER ───────────────────────────────────────── */}
          <footer className="py-24 text-center space-y-8 bg-[#fdf8f0] border-t border-[#8a6520]/10">
            <p className="text-4xl md:text-5xl italic text-[#8a6520]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {data.couple.bride} & {data.couple.groom}
            </p>
            <div className="space-y-4">
              <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.4em] text-[#8a6520]/70">
                Together with their families — {data.event.date ? new Date(data.event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase() : ""}
              </p>
              <p className="text-[10px] uppercase font-medium tracking-[0.2em] text-[#8a6520]/40">
                @theblasterdesign
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
};

export default RoyalGoldTemplate;
