import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineChevronDoubleDown, HiOutlineArrowNarrowDown, HiOutlineMap } from "react-icons/hi";
import ringImg from "../../assets/images/ring.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "";

const CEREMONY_LABELS = {
  1: "Poruwa Ceremony & Tradition",
  2: "Church Wedding Ceremony",
  3: "Registry Wedding",
  4: "Hindu Wedding Ceremony",
  5: "Muslim Nikah Ceremony",
};

const DRESS_LABELS = {
  1: { title: "Formal", desc: "Black Tie / Evening Wear" },
  2: { title: "Semi-Formal", desc: "Cocktail Attire" },
  3: { title: "Casual", desc: "Relaxed & Comfortable" },
};

const RoyalGoldTemplate = ({ data, guestName, guestCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardSlide, setCardSlide] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    setTimeout(() => {
      setCardSlide(true);
      if (audioRef.current) { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
    }, 900);
    setTimeout(() => { setShowContent(true); }, 3200);
    setTimeout(() => { setIsOpen(true); }, 4000);
  };

  const formattedDate = (() => {
    const d = new Date(data.event.date);
    return `${d.getDate()} · ${d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} · ${d.getFullYear()}`;
  })();

  const hasCoverImage = !!data.coverImage;
  const coverUrl = hasCoverImage ? `${API_BASE}${data.coverImage}` : null;
  const hasParents = data.parents?.brideParents || data.parents?.groomParents;
  const hasGallery = data.galleryImages?.length > 0;
  const hasMap = !!data.event?.mapEmbedUrl;
  const ceremonyLabel = CEREMONY_LABELS[data.ceremonyType] || CEREMONY_LABELS[1];
  const dressInfo = DRESS_LABELS[data.dressCode] || DRESS_LABELS[1];
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
    <div style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }} className="min-h-screen bg-[#fdf8f0] text-[#4a3f35] overflow-x-hidden">
      {data.backgroundMusic && (
        <audio ref={audioRef} loop src={`${API_BASE}${data.backgroundMusic}`} />
      )}

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
              className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(138,101,32,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 bg-[#8a6520] text-[#fdf8f0]"
            >
              {isPlaying ? <HiOutlineVolumeUp className="text-2xl" /> : <HiOutlineVolumeOff className="text-2xl" />}
            </button>
          )}

          {/* ── HERO SECTION ─────────────────────────────────── */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center relative px-4 pt-8">
            
            {hasCoverImage && (
              <div className="absolute top-0 left-0 w-full h-[70vh]" style={{ backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdf8f0]/95 via-[#fdf8f0]/65 to-[#fdf8f0]" />
              </div>
            )}
            
            <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className="relative z-10 w-full max-w-2xl pt-24 pb-12">
              
              <p className="text-[11px] md:text-xs uppercase font-bold tracking-[0.4em] text-[#8a6520]">
                You are cordially invited
              </p>
              
              {/* Flipping Ring (Continuous Mirror) */}
              <motion.div 
                animate={{ scaleX: [1, -1, 1] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="mx-auto w-24 h-24 md:w-32 md:h-32 my-10"
              >
                <img src={ringImg} alt="Ring" className="w-full h-full object-contain" />
              </motion.div>
              
              <div className="space-y-1">
                <h1 className="text-6xl md:text-8xl tracking-tight text-[#8a6520]" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 10px rgba(255,255,255,0.3)" }}>
                  {data.couple.bride}
                </h1>
                <p className="text-4xl md:text-5xl italic text-[#8a6520]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>&</p>
                <h1 className="text-6xl md:text-8xl tracking-tight text-[#8a6520]" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 10px rgba(255,255,255,0.3)" }}>
                  {data.couple.groom}
                </h1>
              </div>
              <div className="pt-10 flex flex-col items-center gap-3">
                <div className="w-16 h-[1px] bg-[#8a6520]/40 mb-2"></div>
                <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#8a6520]">
                  {formattedDate}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6520]">
                  {data.event.location}
                </p>
              </div>
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
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#8a6520]"></div>
                <HiOutlineArrowNarrowDown className="text-[#8a6520] text-xl -mt-1" />
              </motion.div>
              <span className="text-[8px] uppercase font-bold tracking-[0.5em] text-[#8a6520]/40 mt-4">Scroll</span>
            </motion.div>
          </section>

          {/* ── PARENTS SECTION ──────────────────────────────── */}
          {hasParents && (
            <section className="pt-10 px-8 text-center bg-[#fdf8f0]">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-3xl mx-auto">
                <div className="flex flex-col  gap-10">
                  {data.parents.brideParents && (
                    <div>
                      <p className="text-2xl font-light italic">{data.parents.brideParents}</p>
                    </div>
                  )}
                  <div>

                  <h3 className="text-xs uppercase font-bold " style={{ letterSpacing: "0.4em", color: "#8a6520" }}>Together With</h3>
                  </div>

                  {data.parents.groomParents && (
                    <div>
                      <p className="text-2xl font-light italic">{data.parents.groomParents}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </section>
          )}

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
          <section className="py-24 bg-[#fdf8f0] text-center">
            <h3 className="text-xs uppercase font-bold mb-12" style={{ letterSpacing: "0.4em", color: "#8a6520" }}>Counting Down To Forever</h3>
            <div className="flex justify-center gap-4 md:gap-12">
              {[{ label: "Days", value: timeLeft.days }, { label: "Hours", value: timeLeft.hours }, { label: "Mins", value: timeLeft.minutes }, { label: "Secs", value: timeLeft.seconds }].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center w-20 h-24 md:w-32 md:h-36 border border-[#8a6520]/20 rounded-md bg-white/30 backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
                  <span className="text-3xl md:text-5xl font-light mb-1" style={{ color: "#4a3f35" }}>{String(item.value).padStart(2, "0")}</span>
                  <span className="text-[9px] md:text-[10px] uppercase font-bold" style={{ letterSpacing: "0.2em", color: "#8a6520" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── CEREMONY, DRESS CODE & DETAILS ───────────────── */}
          <section className="py-24 px-8 bg-[#fdf8f0]">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
              {/* Ceremony */}
              <div className="space-y-6 text-center">
                <h3 className="text-2xl pb-4" style={{ borderBottom: "1px solid rgba(138,101,32,0.2)" }}>Ceremony</h3>
                {displayTime && (
                  <p className="text-sm uppercase font-bold" style={{ letterSpacing: "0.2em", color: "#8a6520" }}>{displayTime}</p>
                )}
                {formattedDate && (
                  <p className="text-sm uppercase font-bold" style={{ letterSpacing: "0.2em", color: "#8a6520" }}>{formattedDate}</p>
                )}
                <p className="text-lg">{ceremonyLabel}</p>
                <p className="font-light leading-relaxed" style={{ color: "#8a8a8a" }}>{data.event.location}</p>
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
                <p className="text-sm uppercase font-bold" style={{ letterSpacing: "0.2em", color: "#8a6520" }}>Evening Banquet</p>
                <p className="text-lg">Dinner & Celebration</p>
                <p className="font-light leading-relaxed" style={{ color: "#8a8a8a" }}>{data.event.location}</p>
              </div>
            </div>
          </section>

          {/* ── GALLERY ──────────────────────────────────────── */}
          {hasGallery && (
            <section className="py-24 px-8 bg-[#fdf8f0]">
              <h3 className="text-xs uppercase font-bold mb-12 text-center" style={{ letterSpacing: "0.4em", color: "#8a6520" }}>Our Moments</h3>
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.galleryImages.map((img, idx) => (
                  <motion.div key={idx} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}
                    className="aspect-square rounded-lg overflow-hidden shadow-lg">
                    <img src={`${API_BASE}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

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

              <form className="space-y-12 text-left pt-8">
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
                    type="button" 
                    className="w-full py-6 border border-[#8a6520] text-[#8a6520] text-xs font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-[#8a6520] hover:text-[#fdf8f0] active:scale-95"
                  >
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
