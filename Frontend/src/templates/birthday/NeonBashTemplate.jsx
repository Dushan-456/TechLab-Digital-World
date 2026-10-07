import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import API from "../../services/api";
import {
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineCheckCircle,
} from "react-icons/hi";

const NeonBashTemplate = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpForm, setRsvpForm] = useState({ name: "", email: "", attending: "yes", guestCount: 1, message: "" });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const eventDate = new Date(data.event.date);

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
  }, [data.event.date]);

  const handleRSVP = async (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;
    setRsvpLoading(true);
    setRsvpError("");
    try {
      await API.post(`invitations/${data.cardId}/rsvp`, rsvpForm);
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
      });
      setRsvpSubmitted(true);
    } catch (err) {
      setRsvpError("Failed to record RSVP. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-fuchsia-500 selection:text-white relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-xl mx-auto px-6 py-16 space-y-12 text-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-fuchsia-500/10">
          <HiOutlineSparkles className="text-base text-fuchsia-400" /> It's Party Time!
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Join Us For The Birthday Of</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-400 drop-shadow-[0_10px_20px_rgba(236,72,153,0.3)]">
            {data.celebrantName}
          </h1>
          {data.age && (
            <div className="inline-block mt-3 px-5 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-2xl font-black tracking-wider text-white shadow-xl shadow-fuchsia-600/30">
              TURNING {data.age}
            </div>
          )}
        </div>

        {/* Welcome Text */}
        {data.content?.welcomeText && (
          <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto italic border-l-2 border-fuchsia-500 pl-4 py-1">
            "{data.content.welcomeText}"
          </p>
        )}

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="p-2">
            <span className="block text-3xl font-black text-cyan-400">{timeLeft.days}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Days</span>
          </div>
          <div className="p-2">
            <span className="block text-3xl font-black text-fuchsia-400">{timeLeft.hours}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hours</span>
          </div>
          <div className="p-2">
            <span className="block text-3xl font-black text-pink-400">{timeLeft.minutes}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mins</span>
          </div>
          <div className="p-2">
            <span className="block text-3xl font-black text-purple-400">{timeLeft.seconds}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secs</span>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md text-left space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <HiOutlineCalendar className="text-xl" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Date</p>
              <p className="text-base font-bold text-white">
                {eventDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {data.event.time && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0">
                <HiOutlineClock className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Time</p>
                <p className="text-base font-bold text-white">{data.event.time}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <HiOutlineLocationMarker className="text-xl" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Venue</p>
              <p className="text-base font-bold text-white">{data.event.location}</p>
            </div>
          </div>
        </div>

        {/* RSVP Section */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              RSVP For The Party
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Let us know if you can join the celebration!
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="py-8 space-y-3">
              <HiOutlineCheckCircle className="text-5xl text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">You're On The Guestlist!</h4>
              <p className="text-xs text-slate-400">Thank you for confirming. See you on the dancefloor!</p>
            </div>
          ) : (
            <form onSubmit={handleRSVP} className="space-y-4 text-left">
              {rsvpError && <p className="text-xs text-red-400">{rsvpError}</p>}

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Hunter"
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Attending? *</label>
                  <select
                    value={rsvpForm.attending}
                    onChange={(e) => setRsvpForm((prev) => ({ ...prev, attending: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 cursor-pointer"
                  >
                    <option value="yes">Hell Yeah! 🎉</option>
                    <option value="no">Can't Make It 😢</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Total Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rsvpForm.guestCount}
                    onChange={(e) => setRsvpForm((prev) => ({ ...prev, guestCount: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Birthday Wishes</label>
                <textarea
                  rows={2}
                  placeholder="Leave a sweet message for the birthday hero..."
                  value={rsvpForm.message}
                  onChange={(e) => setRsvpForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={rsvpLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {rsvpLoading ? "Confirming..." : "Confirm My Attendance"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeonBashTemplate;
