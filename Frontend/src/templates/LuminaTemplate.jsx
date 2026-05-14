import { motion } from "framer-motion";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] } }) };

const LuminaTemplate = ({ data }) => {
  const { couple, event, content } = data;
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString("en-US", { month: "long" });
  const year = eventDate.getFullYear();
  const weekday = eventDate.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1025 0%, #2d1b4e 30%, #1e1233 60%, #0f0d1a 100%)" }}>
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />

      <motion.div initial="hidden" animate="visible" className="relative w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          {/* Welcome */}
          <motion.p custom={0} variants={fadeIn} className="text-xs tracking-[0.25em] uppercase mb-8" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}>
            {content?.welcomeText || "Together with their families"}
          </motion.p>

          {/* Names */}
          <motion.div custom={1} variants={fadeIn}>
            <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontWeight: 300 }}>{couple.bride}</h1>
            <div className="flex items-center justify-center gap-4 my-4">
              <div className="h-[1px] w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))" }} />
              <span className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(167,139,250,0.8)" }}>&amp;</span>
              <div className="h-[1px] w-12" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)" }} />
            </div>
            <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontWeight: 300 }}>{couple.groom}</h1>
          </motion.div>

          {/* Date bento grid */}
          <motion.div custom={2} variants={fadeIn} className="mt-10 grid grid-cols-3 gap-3">
            <div className="rounded-2xl py-4 px-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-2xl font-light text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{day}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Day</p>
            </div>
            <div className="rounded-2xl py-4 px-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-2xl font-light text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{month.slice(0, 3)}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Month</p>
            </div>
            <div className="rounded-2xl py-4 px-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-2xl font-light text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{year}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Year</p>
            </div>
          </motion.div>

          {/* Weekday */}
          <motion.p custom={3} variants={fadeIn} className="text-xs tracking-[0.2em] uppercase mt-4" style={{ color: "rgba(167,139,250,0.6)" }}>{weekday}</motion.p>

          {/* Location */}
          <motion.div custom={4} variants={fadeIn} className="mt-8 rounded-2xl py-4 px-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Venue</p>
            <p className="text-sm text-white/80" style={{ fontFamily: "'Inter', sans-serif" }}>{event.location}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LuminaTemplate;
