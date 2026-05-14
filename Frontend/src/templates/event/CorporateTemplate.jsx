import { motion } from "framer-motion";

const CorporateTemplate = ({ data }) => {
  const { eventName, organizer, description, event } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-lg w-full bg-slate-800 rounded-lg shadow-2xl p-10 border border-slate-700"
      >
        <p className="text-cyan-400 font-semibold tracking-wider text-xs uppercase mb-2">
          {organizer || "Special Event"}
        </p>
        <h1 className="text-3xl font-bold text-white mb-6">
          {eventName}
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          {description || "Join us for an exclusive gathering of minds."}
        </p>
        
        <div className="border-t border-slate-700 pt-6 mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-slate-500 text-xs uppercase font-bold mb-1">Date</p>
            <p className="text-slate-200 text-sm">
              {new Date(event?.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase font-bold mb-1">Location</p>
            <p className="text-slate-200 text-sm">{event?.location}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CorporateTemplate;
