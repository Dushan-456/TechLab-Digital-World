import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone, HiOutlineGlobeAlt, HiOutlineLocationMarker } from "react-icons/hi";

const ClassicBusinessTemplate = ({ data }) => {
  const { personalInfo, contactInfo, socialLinks } = data;
  const baseUrl = import.meta.env.VITE_API_BASE_URL.split('/api/v1')[0];
  const profilePicUrl = personalInfo?.profilePic ? `${baseUrl}${personalInfo.profilePic}` : null;

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 font-serif">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-2xl p-1 relative border-2 border-[#d4af37]"
      >
        <div className="border border-[#d4af37] p-8 h-full bg-white flex flex-col items-center">
           {profilePicUrl && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37] mb-6 grayscale hover:grayscale-0 transition-all">
                 <img src={profilePicUrl} alt={personalInfo?.fullName} className="w-full h-full object-cover" />
              </div>
           )}

           <h1 className="text-3xl font-bold text-[#1a1a1a] uppercase tracking-tighter text-center">{personalInfo?.fullName}</h1>
           <div className="h-0.5 w-16 bg-[#d4af37] my-4" />
           <p className="text-[#1a1a1a] font-medium text-xs uppercase tracking-widest text-center mb-1">{personalInfo?.jobTitle}</p>
           <p className="text-[#d4af37] text-[10px] uppercase font-bold text-center">{personalInfo?.company}</p>

           <div className="mt-8 w-full space-y-3 text-[#1a1a1a]">
              {contactInfo?.email && (
                 <div className="flex items-center gap-3 text-xs border-b border-gray-100 pb-2">
                    <HiOutlineMail className="text-[#d4af37]" />
                    <span>{contactInfo.email}</span>
                 </div>
              )}
              {contactInfo?.phone && (
                 <div className="flex items-center gap-3 text-xs border-b border-gray-100 pb-2">
                    <HiOutlinePhone className="text-[#d4af37]" />
                    <span>{contactInfo.phone}</span>
                 </div>
              )}
              {contactInfo?.address && (
                 <div className="flex items-center gap-3 text-xs border-b border-gray-100 pb-2">
                    <HiOutlineLocationMarker className="text-[#d4af37]" />
                    <span>{contactInfo.address}</span>
                 </div>
              )}
           </div>

           <div className="mt-10 text-[9px] text-gray-400 uppercase tracking-[0.4em] font-bold">
              EST. 2026
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClassicBusinessTemplate;
