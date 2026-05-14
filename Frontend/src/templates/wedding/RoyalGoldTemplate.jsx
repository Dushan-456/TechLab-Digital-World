import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineChevronDoubleDown } from "react-icons/hi";

const RoyalGoldTemplate = ({ data, guestName, guestCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardSlide, setCardSlide] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(data.event.date);
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      if (difference <= 0) {
        clearInterval(interval);
      } else {
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
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleOpen = () => {
    if (flapOpen || isOpen) return;

    // Stage 1: Open the flap (0.75s)
    setFlapOpen(true);

    // Stage 2: Slide the card up (after flap opens)
    setTimeout(() => {
      setCardSlide(true);
      // Try to play music
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 900);

    // Stage 3: Fade out envelope, show main content
    setTimeout(() => {
      setShowContent(true);
    }, 3200);

    setTimeout(() => {
      setIsOpen(true);
    }, 4000);
  };

  const formattedDate = (() => {
    const d = new Date(data.event.date);
    const day = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day} · ${month} · ${year}`;
  })();

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }} className="min-h-screen bg-[#fffdf7] text-[#4a3f35] overflow-x-hidden">
      {/* Background Music */}
      <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

      {/* ── ENVELOPE COVER ───────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: showContent ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fffdf7] overflow-hidden"
            onClick={handleOpen}
            style={{ cursor: "pointer" }}
          >
            {/* Title */}
            <p
              className="text-[11px] uppercase font-bold mb-14"
              style={{ letterSpacing: "0.55em", color: "#8a6520" }}
            >
              A Wedding Invitation Awaits
            </p>

            {/* ── THE ENVELOPE ─────────────────────────────────────── */}
            <div
              className="relative"
              style={{
                width: "min(420px, 88vw)",
                height: "min(280px, 59vw)",
                boxShadow: "0 8px 30px rgba(138, 101, 32, 0.12), 0 20px 60px rgba(0, 0, 0, 0.08)",
                borderRadius: "3px",
              }}
            >
              {/* Back panel of envelope */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{ background: "#f5ead0", zIndex: 1 }}
              />

              {/* Internal Card (visible through gap, slides up) */}
              <div
                className="absolute flex flex-col items-center justify-center text-center"
                style={{
                  top: "8px",
                  left: "8px",
                  right: "8px",
                  bottom: "8px",
                  paddingTop: "17%",
                  background: "#fffdf7",
                  border: "1px solid rgba(138, 101, 32, 0.15)",
                  zIndex: 3,
                  transition: cardSlide
                    ? "transform 2.8s cubic-bezier(0.4, 0, 0.2, 1)"
                    : "none",
                  transform: cardSlide ? "translateY(-120%)" : "translateY(0)",
                }}
              >
                <div className="px-15 pt-15 pb-13" style={{ background: "#fffdf7", boxShadow: "0 4px 20px rgba(138, 101, 32, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)", borderRadius: "4px", border: "1px solid rgba(138, 101, 32, 0.08)" }}>
                <h2
                  className="font-light italic"
                  style={{
                    fontSize: "min(2.2rem, 7vw)",
                    color: "#8a6520",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {data.couple.bride} & {data.couple.groom}
                </h2>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "rgba(138, 101, 32, 0.15)",
                    margin: "1px auto",
                  }}
                />
                <p
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.45em",
                    color: "rgba(138, 101, 32, 0.5)",
                    fontWeight: 500,
                  }}
                >
                  {formattedDate}
                </p>
                </div>
              </div>

              {/* Left crease (triangle from left edge) */}
              <div
                className="absolute top-0 left-0"
                style={{
                  width: 0,
                  height: 0,
                  borderBottom: "min(140px, 29.5vw) solid #f0e4ca",
                  borderRight: "min(210px, 44vw) solid transparent",
                  borderTop: "min(140px, 29.5vw) solid transparent",
                  zIndex: 5,
                }}
              />

              {/* Right crease (triangle from right edge) */}
              <div
                className="absolute top-0 right-0"
                style={{
                  width: 0,
                  height: 0,
                  borderBottom: "min(140px, 29.5vw) solid #eadbb8",
                  borderLeft: "min(210px, 44vw) solid transparent",
                  borderTop: "min(140px, 29.5vw) solid transparent",
                  zIndex: 5,
                }}
              />

              {/* Bottom fold (triangle from bottom center) */}
              <div
                className="absolute bottom-0 left-0 w-full"
                style={{
                  width: 0,
                  height: 0,
                  borderBottom: "min(70px, 21vw) solid #f5ebd1ff",
                  borderLeft: "min(210px, 44vw) solid transparent",
                  borderRight: "min(210px, 44vw) solid transparent",
                  zIndex: 5,
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                }}
              />

              {/* Top Flap (animates open) */}
              <div
                className="absolute top-0 left-0 w-full"
                style={{
                  height: "55%",
                  transformOrigin: "top center",
                  transform: flapOpen
                    ? "perspective(800px) rotateX(-180deg)"
                    : "perspective(800px) rotateX(0deg)",
                  transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s 0.45s",
                  zIndex: flapOpen ? 2 : 6,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "#f0e4ca",
                    boxShadow: "0 4px 12px rgba(138, 101, 32, 0.1)",
                  }}
                />
              </div>

              {/* Gold Wax Seal (centered at the meeting point of flaps) */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: "min(60px, 13vw)",
                  height: "min(60px, 13vw)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                  opacity: flapOpen ? 0 : 1,
                  transition: "opacity 0.3s ease",
                  filter: "drop-shadow(0 2px 8px rgba(138, 101, 32, 0.3))",
                }}
              >
                {/* Seal SVG */}
                <svg viewBox="0 0 60 60" className="w-full h-full">
                  {/* Outer ring */}
                  <circle cx="30" cy="30" r="28" fill="#c9a84c" />
                  {/* Inner ring border */}
                  <circle cx="30" cy="30" r="23" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  {/* Inner circle */}
                  <circle cx="30" cy="30" r="20" fill="#b8892e" />
                  {/* Inner ring */}
                  <circle cx="30" cy="30" r="17" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                  {/* Text */}
                  <text
                    x="50%"
                    y="52%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fdf8f0"
                    fontSize="11"
                    fontWeight="bold"
                    fontStyle="italic"
                    fontFamily="'Cormorant Garamond', Georgia, serif"
                  >
                    {data.couple.bride?.[0]}&{data.couple.groom?.[0]}
                  </text>
                </svg>
              </div>
            </div>

            {/* Open Button */}
            <div className="mt-16 text-center space-y-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                style={{
                  padding: "14px 56px",
                  border: "1px solid #8a6520",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  color: "#8a6520",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "all 0.5s ease",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#8a6520";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#8a6520";
                }}
              >
                Open Invitation
              </button>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: "rgba(138, 101, 32, 0.5)",
                  textTransform: "uppercase",
                }}
              >
                ✧&nbsp;&nbsp;Tap to reveal your invitation&nbsp;&nbsp;✧
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Floating Music Button */}
          <button
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            style={{ background: "#b1945f", color: "#fff" }}
          >
            {isPlaying ? (
              <HiOutlineVolumeUp className="text-xl" />
            ) : (
              <HiOutlineVolumeOff className="text-xl" />
            )}
          </button>

          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <p
                className="text-xs uppercase font-bold"
                style={{ letterSpacing: "0.5em", color: "#8a6520" }}
              >
                The Wedding Of
              </p>
              <div className="space-y-2">
                <h1 className="text-6xl md:text-8xl font-light tracking-tight">
                  {data.couple.bride}
                </h1>
                <p
                  className="text-3xl italic"
                  style={{ color: "#8a6520" }}
                >
                  &
                </p>
                <h1 className="text-6xl md:text-8xl font-light tracking-tight">
                  {data.couple.groom}
                </h1>
              </div>
              <div className="pt-8">
                <p className="text-lg" style={{ letterSpacing: "0.2em" }}>
                  {new Date(data.event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p
                  className="text-sm mt-2"
                  style={{
                    color: "#8a6520",
                    letterSpacing: "0.15em",
                  }}
                >
                  {data.event.location}
                </p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10"
            >
              <HiOutlineChevronDoubleDown
                className="text-2xl"
                style={{ color: "#8a6520" }}
              />
            </motion.div>
          </section>

          {/* Guest Personalization Section */}
          {guestName && (
            <section className="py-24 px-8 text-center bg-[#fdfcf9]">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="max-w-2xl mx-auto py-16"
                style={{ borderTop: "1px solid rgba(138,101,32,0.15)", borderBottom: "1px solid rgba(138,101,32,0.15)" }}
              >
                <p
                  className="text-sm uppercase mb-6"
                  style={{ letterSpacing: "0.3em" }}
                >
                  Honored Guest
                </p>
                <h2 className="text-4xl md:text-5xl font-light mb-8 italic">
                  Dear {guestName},
                </h2>
                <p className="text-lg leading-relaxed font-light" style={{ color: "#6b5e51" }}>
                  We are overjoyed to share this special day with you. Your
                  presence means the world to us as we begin our journey
                  together.
                </p>
              </motion.div>
            </section>
          )}

          {/* Countdown */}
          <section className="py-24 bg-white text-center">
            <h3
              className="text-xs uppercase font-bold mb-12"
              style={{ letterSpacing: "0.4em", color: "#8a6520" }}
            >
              Counting Down To Forever
            </h3>
            <div className="flex justify-center gap-4 md:gap-12">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-4xl md:text-6xl font-light mb-2">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[10px] uppercase font-bold"
                    style={{ letterSpacing: "0.2em", color: "#8a6520" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Venue & Details */}
          <section className="py-24 px-8 bg-[#fdfcf9]">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
              <div className="space-y-6 text-center md:text-left">
                <h3
                  className="text-2xl pb-4"
                  style={{ borderBottom: "1px solid rgba(138,101,32,0.2)" }}
                >
                  Ceremony
                </h3>
                <p
                  className="text-sm uppercase font-bold"
                  style={{ letterSpacing: "0.2em", color: "#8a6520" }}
                >
                  10:30 AM
                </p>
                <p className="text-lg">Poruwa Ceremony & Tradition</p>
                <p className="font-light leading-relaxed" style={{ color: "#8a8a8a" }}>
                  Monarch Imperial, Main Ballroom
                  <br />
                  Sri Jayawardenepura Kotte
                </p>
              </div>
              <div className="space-y-6 text-center md:text-left">
                <h3
                  className="text-2xl pb-4"
                  style={{ borderBottom: "1px solid rgba(138,101,32,0.2)" }}
                >
                  Reception
                </h3>
                <p
                  className="text-sm uppercase font-bold"
                  style={{ letterSpacing: "0.2em", color: "#8a6520" }}
                >
                  06:30 PM
                </p>
                <p className="text-lg">Evening Banquet & Dance</p>
                <p className="font-light leading-relaxed" style={{ color: "#8a8a8a" }}>
                  Monarch Imperial, Royal Ballroom
                  <br />
                  Grand Celebration
                </p>
              </div>
            </div>
          </section>

          {/* Map Embed */}
          <section className="h-96 w-full grayscale contrast-125 opacity-70">
            <iframe
              title="Venue Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0506371724395!2d79.91428387588!3d6.884525818868843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae251147a7b8e1f%3A0x6e3a73df0136e974!2sMonarch%20Imperial!5e0!3m2!1sen!2slk!4v1715712345678!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </section>

          {/* RSVP Section */}
          <section className="py-24 px-8 bg-white">
            <div className="max-w-xl mx-auto text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-light italic">RSVP</h2>
                <p
                  className="text-sm"
                  style={{ letterSpacing: "0.2em", color: "#8a8a8a" }}
                >
                  KINDLY RESPOND BY JUNE 1ST
                </p>
              </div>

              <form className="space-y-6 text-left">
                <div className="space-y-2">
                  <label
                    className="text-xs uppercase font-bold"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    Your Name
                  </label>
                  <input
                    defaultValue={guestName}
                    placeholder="Please enter your name"
                    className="w-full py-3 outline-none transition-all"
                    style={{
                      background: "#fdfcf9",
                      borderBottom: "1px solid rgba(138,101,32,0.2)",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs uppercase font-bold"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    defaultValue={guestCount}
                    placeholder="Number of persons"
                    className="w-full py-3 outline-none transition-all"
                    style={{
                      background: "#fdfcf9",
                      borderBottom: "1px solid rgba(138,101,32,0.2)",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  />
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <button
                    type="button"
                    className="flex-1 py-4 text-xs uppercase font-bold transition-all"
                    style={{
                      border: "1px solid #8a6520",
                      letterSpacing: "0.15em",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#8a6520";
                      e.target.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = "inherit";
                    }}
                  >
                    Will Attend
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-4 text-xs uppercase font-bold transition-all"
                    style={{
                      border: "1px solid #e0e0e0",
                      color: "#aaa",
                      letterSpacing: "0.15em",
                    }}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 text-center space-y-4" style={{ background: "#1a1a1a" }}>
            <p
              className="text-2xl italic"
              style={{ color: "#b1945f" }}
            >
              {data.couple.bride} & {data.couple.groom}
            </p>
            <p
              className="text-[10px] uppercase"
              style={{ letterSpacing: "0.5em", color: "rgba(255,255,255,0.3)" }}
            >
              Made with love by Digital World
            </p>
          </footer>
        </motion.div>
      )}
    </div>
  );
};

export default RoyalGoldTemplate;
