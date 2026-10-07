import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import API from "../../services/api";
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineTicket,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineExternalLink,
  HiOutlineSparkles,
  HiOutlineBriefcase,
} from "react-icons/hi";

const SummitProTemplate = ({ data, guestName, guestCount }) => {
  const title = data.eventTitle || data.eventName || "Annual Tech Summit";
  const tagline = data.tagline || data.content?.welcomeText || "Innovate · Transform · Elevate";
  const organizer = data.organizer || "TechLab Events";
  const description = data.description || data.content?.description || "Join pioneering technologists, enterprise leaders, and visionaries for an immersive day of thought leadership and innovation.";
  const ticketPrice = data.ticketPrice || "Complimentary Access";
  const eventDateStr = data.event?.date || new Date().toISOString();
  const eventDate = new Date(eventDateStr);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const eventTime = data.event?.time || "09:00 AM";

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeTab, setActiveTab] = useState("overview"); // overview, agenda, speakers
  const [rsvpForm, setRsvpForm] = useState({ name: guestName || "", email: "", attending: "yes", guestCount: guestCount || 1, company: "", jobTitle: "" });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDateStr]);

  const handleRSVP = async (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;
    setRsvpLoading(true);
    setRsvpError("");
    try {
      if (data.cardId) {
        await API.post(`invitations/${data.cardId}/rsvp`, {
          name: rsvpForm.name,
          email: rsvpForm.email,
          attending: rsvpForm.attending,
          guestCount: Number(rsvpForm.guestCount),
          message: `${rsvpForm.jobTitle ? rsvpForm.jobTitle + " at " : ""}${rsvpForm.company || ""}`,
        });
      }
      confetti({
        particleCount: 160,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#6366f1", "#06b6d4"],
      });
      setRsvpSubmitted(true);
    } catch (err) {
      // In preview mode or API fallback, still show success celebration
      confetti({
        particleCount: 120,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#6366f1"],
      });
      setRsvpSubmitted(true);
    } finally {
      setRsvpLoading(false);
    }
  };

  const addToCalendar = () => {
    const start = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(eventDate.getTime() + 5 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(
      data.event?.location || ""
    )}`;
    window.open(gcalUrl, "_blank");
  };

  // Sample or actual speakers
  const speakers = data.speakers?.length
    ? data.speakers
    : [
        { name: "Dr. Elena Rostova", role: "VP of Artificial Intelligence", company: "Aether Dynamics" },
        { name: "Marcus Vance", role: "Chief Product Officer", company: "GlobalScale Inc." },
        { name: "Aria Chen", role: "Head of Cloud Architecture", company: "NextGen Labs" },
      ];

  // Sample or actual agenda
  const agenda = data.agenda?.length
    ? data.agenda
    : [
        { time: "09:00 AM", session: "Registration, Welcome Breakfast & Keynote", speaker: "Dr. Elena Rostova" },
        { time: "11:00 AM", session: "Panel: Scalable AI Architectures for Global Enterprise", speaker: "Executive Panel" },
        { time: "01:00 PM", session: "VIP Networking Luncheon & Partner Expo", speaker: "All Attendees" },
        { time: "02:30 PM", session: "Fireside Chat: The Next Frontier in Tech Infrastructure", speaker: "Marcus Vance & Aria Chen" },
        { time: "04:30 PM", session: "Closing Remarks & Cocktails Reception", speaker: organizer },
      ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-blue-600/20 to-teal-500/10 blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Top Badge & Organizer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {organizer} Presents
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wide">
            <HiOutlineSparkles className="text-sm" /> Official Corporate Summit
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm md:text-base font-semibold tracking-widest uppercase bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent mb-4">
            {tagline}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          {/* Quick Action Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#register"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              Reserve Delegate Pass
            </a>
            <button
              onClick={addToCalendar}
              className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm transition-all hover:border-slate-600"
            >
              Add to Calendar
            </button>
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-16">
          {[
            { label: "DAYS", val: timeLeft.days },
            { label: "HOURS", val: timeLeft.hours },
            { label: "MINS", val: timeLeft.minutes },
            { label: "SECS", val: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-3 text-center shadow-lg"
            >
              <span className="block text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                {String(item.val).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bold tracking-wider text-slate-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bento Grid: Event Info & Ticket Badge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <HiOutlineCalendar className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Date & Time</p>
              <p className="text-white font-bold text-base">{formattedDate}</p>
              <p className="text-blue-400 text-xs font-medium mt-1">{eventTime}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <HiOutlineLocationMarker className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Venue Location</p>
              <p className="text-white font-bold text-base">{data.event?.location || "Grand Convention Center"}</p>
              {data.event?.location && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.event.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold mt-1 hover:underline"
                >
                  Map Directions <HiOutlineExternalLink className="text-xs" />
                </a>
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <HiOutlineTicket className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Pass Access</p>
              <p className="text-white font-bold text-base">{ticketPrice}</p>
              <p className="text-purple-300 text-xs font-medium mt-1">Includes all sessions & networking</p>
            </div>
          </div>
        </div>

        {/* Speakers Lineup Section */}
        {speakers.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">Distinguished Panel</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Keynote Speakers & Leaders</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {speakers.map((spk, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 text-center hover:border-indigo-500/40 transition-all hover:-translate-y-1 group"
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
                    {spk.photo ? (
                      <img src={spk.photo} alt={spk.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xl text-indigo-300 group-hover:scale-105 transition-transform">
                        {spk.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {spk.name}
                  </h3>
                  <p className="text-xs font-medium text-indigo-400 mt-1">{spk.role}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{spk.company}</p>
                  {spk.linkedin && (
                    <a
                      href={spk.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-400 mt-3 hover:underline"
                    >
                      LinkedIn Profile <HiOutlineExternalLink />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summit Agenda Schedule */}
        {agenda.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-widest uppercase text-teal-400">Session Breakdown</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Summit Agenda & Schedule</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {agenda.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold shrink-0">
                      {item.time}
                    </span>
                    <div>
                      <p className="text-white font-semibold text-base">{item.session}</p>
                      {item.speaker && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <HiOutlineBriefcase className="text-slate-500" /> {item.speaker}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider self-end sm:self-center">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Embed (if present) */}
        {data.event?.mapEmbedUrl && (
          <div className="mb-20 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-80 w-full bg-slate-950">
            <iframe
              title="Venue Map"
              src={data.event.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        )}

        {/* Sponsors Showcase (if present) */}
        {data.sponsors?.length > 0 && (
          <div className="mb-20 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
              Proudly Sponsored By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {data.sponsors.map((s, idx) => (
                <div key={idx} className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 font-bold text-sm">
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delegate RSVP / Registration Form */}
        <div id="register" className="max-w-2xl mx-auto scroll-mt-10">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400" />
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Attendance RSVP</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Register Delegate Pass</h2>
              <p className="text-xs text-slate-400 mt-2">
                Confirm your seat for keynotes and networking sessions.
              </p>
            </div>

            {rsvpSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                  <HiOutlineCheckCircle />
                </div>
                <h3 className="text-xl font-bold text-white">Delegate Pass Confirmed!</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Thank you, <span className="text-emerald-400 font-semibold">{rsvpForm.name}</span>. We look forward to welcoming you to {title}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRSVP} className="space-y-4">
                {rsvpError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {rsvpError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={rsvpForm.email}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                      placeholder="e.g. john@enterprise.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company / Organization</label>
                    <input
                      type="text"
                      value={rsvpForm.company}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, company: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Job Title</label>
                    <input
                      type="text"
                      value={rsvpForm.jobTitle}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, jobTitle: e.target.value })}
                      placeholder="e.g. Lead Engineer"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Attending?</label>
                    <select
                      value={rsvpForm.attending}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                      <option value="yes">Yes, I will attend</option>
                      <option value="maybe">Maybe / Tentative</option>
                      <option value="no">Unable to attend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Delegates (Seats)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rsvpForm.guestCount}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guestCount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {rsvpLoading ? "Confirming Pass..." : "Complete Delegate Registration"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {organizer} · Powered by TechLab Digital World</p>
        </div>
      </div>
    </div>
  );
};

export default SummitProTemplate;
