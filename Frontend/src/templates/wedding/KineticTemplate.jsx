import { motion } from "framer-motion";

const letterAnimation = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { delay: 0.6 + i * 0.04, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] } }),
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

const KineticTemplate = ({ data }) => {
  const { couple, event, content } = data;
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A1628 0%, #0F1D32 40%, #162A46 70%, #1B3254 100%)" }}>
      {/* Subtle animated orbs */}
      <motion.div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#0ea5e9" }} animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: "#06b6d4" }} animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div initial="hidden" animate="visible" className="relative w-full max-w-lg text-center py-16">
        {/* Welcome */}
        <motion.p custom={0} variants={fadeIn} className="text-xs tracking-[0.3em] uppercase mb-14" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(148,197,233,0.5)" }}>
          {content?.welcomeText || "Together with their families"}
        </motion.p>

        {/* Kinetic Names */}
        <div>
          <KineticName name={couple.bride} className="text-5xl md:text-7xl font-light text-white" />
        </div>

        <motion.div custom={0} variants={fadeIn} className="flex items-center justify-center gap-6 my-6">
          <motion.div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4))" }} animate={{ scaleX: [0, 1] }} transition={{ delay: 1.5, duration: 0.8 }} />
          <span className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(14,165,233,0.6)" }}>&amp;</span>
          <motion.div className="h-[1px] w-16" style={{ background: "linear-gradient(90deg, rgba(14,165,233,0.4), transparent)" }} animate={{ scaleX: [0, 1] }} transition={{ delay: 1.5, duration: 0.8 }} />
        </motion.div>

        <div>
          <KineticName name={couple.groom} className="text-5xl md:text-7xl font-light text-white" />
        </div>

        {/* Date */}
        <motion.div custom={4} variants={fadeIn} className="mt-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)" }}>
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(148,197,233,0.7)" }}>{formattedDate}</p>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div custom={5} variants={fadeIn} className="mt-6">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(148,197,233,0.35)" }}>Venue</p>
          <p className="text-base font-light" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.7)" }}>{event.location}</p>
        </motion.div>

        {/* Bottom accent */}
        <motion.div custom={6} variants={fadeIn} className="mt-16">
          <motion.div className="w-1 h-1 mx-auto rounded-full" style={{ background: "rgba(14,165,233,0.5)" }} animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default KineticTemplate;
