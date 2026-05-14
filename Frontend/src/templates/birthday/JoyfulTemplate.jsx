import { motion } from "framer-motion";

const JoyfulTemplate = ({ data }) => {
  const { celebrantName, age, event, content } = data;

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border-4 border-pink-200"
      >
        <h2 className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4">
          You're Invited!
        </h2>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {celebrantName}'s
        </h1>
        {age && <h1 className="text-3xl font-bold text-pink-600 mb-6">{age}th Birthday</h1>}
        <p className="text-gray-600 mb-8 italic">
          {content?.welcomeText || "Join us for a wonderful celebration!"}
        </p>
        <div className="bg-pink-100 p-4 rounded-xl text-gray-700">
          <p className="font-semibold mb-1">
            {new Date(event?.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm">{event?.location}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default JoyfulTemplate;
