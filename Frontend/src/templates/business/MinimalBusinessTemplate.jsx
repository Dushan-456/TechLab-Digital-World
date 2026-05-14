import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone, HiOutlineGlobeAlt, HiOutlineLocationMarker } from "react-icons/hi";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

const MinimalBusinessTemplate = ({ data }) => {
  const { personalInfo, contactInfo, socialLinks } = data;
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '');
  const profilePicUrl = personalInfo?.profilePic ? `${baseUrl}${personalInfo.profilePic}` : null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-3xl p-10 border border-slate-100"
      >
        <div className="flex flex-col items-center">
           {profilePicUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 mb-6">
                 <img src={profilePicUrl} alt={personalInfo?.fullName} className="w-full h-full object-cover" />
              </div>
           ) : (
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold mb-6">
                 {personalInfo?.fullName?.charAt(0)}
              </div>
           )}

           <h1 className="text-3xl font-light text-slate-900 tracking-tight text-center">{personalInfo?.fullName}</h1>
           <p className="text-slate-500 font-medium text-sm mt-2">{personalInfo?.jobTitle}</p>
           <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">{personalInfo?.company}</p>

           <div className="w-12 h-0.5 bg-slate-900 mt-8 mb-8" />

           {personalInfo?.bio && (
             <p className="text-slate-600 text-sm text-center leading-relaxed mb-8 font-light italic px-4">
                {personalInfo.bio}
             </p>
           )}

           <div className="w-full space-y-4">
              {contactInfo?.email && (
                 <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 text-slate-700 hover:text-black transition-colors group">
                    <HiOutlineMail className="text-lg text-slate-300 group-hover:text-black" />
                    <span className="text-sm border-b border-transparent group-hover:border-black transition-all">{contactInfo.email}</span>
                 </a>
              )}
              {contactInfo?.phone && (
                 <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-4 text-slate-700 hover:text-black transition-colors group">
                    <HiOutlinePhone className="text-lg text-slate-300 group-hover:text-black" />
                    <span className="text-sm border-b border-transparent group-hover:border-black transition-all">{contactInfo.phone}</span>
                 </a>
              )}
              {contactInfo?.website && (
                 <a href={contactInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-700 hover:text-black transition-colors group">
                    <HiOutlineGlobeAlt className="text-lg text-slate-300 group-hover:text-black" />
                    <span className="text-sm border-b border-transparent group-hover:border-black transition-all truncate">{contactInfo.website.replace(/^https?:\/\//, "")}</span>
                 </a>
              )}
           </div>

           <div className="flex gap-6 mt-12 text-xl text-slate-300">
              {socialLinks?.linkedin && <a href={socialLinks.linkedin} className="hover:text-slate-900 transition-colors"><FaLinkedin /></a>}
              {socialLinks?.github && <a href={socialLinks.github} className="hover:text-slate-900 transition-colors"><FaGithub /></a>}
              {socialLinks?.twitter && <a href={socialLinks.twitter} className="hover:text-slate-900 transition-colors"><FaTwitter /></a>}
              {socialLinks?.instagram && <a href={socialLinks.instagram} className="hover:text-slate-900 transition-colors"><FaInstagram /></a>}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MinimalBusinessTemplate;
