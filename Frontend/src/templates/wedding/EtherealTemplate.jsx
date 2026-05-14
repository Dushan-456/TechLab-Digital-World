import { motion } from "framer-motion";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] } }) };

const EtherealTemplate = ({ data }) => {
  const { couple, event, content } = data;
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "linear-gradient(180deg, #FAF7F2 0%, #F0EBE3 50%, #E8E0D5 100%)" }}>
      <motion.div initial="hidden" animate="visible" className="w-full max-w-lg text-center py-20 px-8">
        {/* Ornamental line */}
        <motion.div custom={0} variants={fadeIn} className="w-16 h-[1px] mx-auto mb-12" style={{ background: "linear-gradient(90deg, transparent, #B8A080, transparent)" }} />

        {/* Welcome text */}
        <motion.p custom={1} variants={fadeIn} className="text-sm tracking-[0.3em] uppercase mb-12" style={{ fontFamily: "'Inter', sans-serif", color: "#9E8E7E", letterSpacing: "0.3em" }}>
          {content?.welcomeText || "Together with their families, request the pleasure of your company"}
        </motion.p>

        {/* Names */}
        <motion.div custom={2} variants={fadeIn}>
          <h1 className="text-5xl md:text-6xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4A3F35", fontWeight: 300 }}>
            {couple.bride}
          </h1>
          <p className="text-2xl my-4 italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#B8A080" }}>&amp;</p>
          <h1 className="text-5xl md:text-6xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4A3F35", fontWeight: 300 }}>
            {couple.groom}
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div custom={3} variants={fadeIn} className="w-24 h-[1px] mx-auto my-12" style={{ background: "linear-gradient(90deg, transparent, #B8A080, transparent)" }} />

        {/* Date */}
        <motion.div custom={4} variants={fadeIn}>
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "'Inter', sans-serif", color: "#B8A080" }}>
            The Celebration
          </p>
          <p className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4A3F35", fontWeight: 500 }}>
            {formattedDate}
          </p>
        </motion.div>

        {/* Location */}
        <motion.div custom={5} variants={fadeIn} className="mt-8">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "'Inter', sans-serif", color: "#B8A080" }}>
            Venue
          </p>
          <p className="text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4A3F35" }}>
            {event.location}
          </p>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div custom={6} variants={fadeIn} className="w-16 h-[1px] mx-auto mt-16" style={{ background: "linear-gradient(90deg, transparent, #B8A080, transparent)" }} />
      </motion.div>
    </div>
  );
};

export default EtherealTemplate;
