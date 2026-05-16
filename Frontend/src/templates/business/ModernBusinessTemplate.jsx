import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone, HiOutlineGlobeAlt, HiOutlineLocationMarker } from "react-icons/hi";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

const ModernBusinessTemplate = ({ data }) => {
  const { personalInfo, contactInfo, socialLinks } = data;
  const baseUrl = import.meta.env.VITE_API_BASE_URL.split('/api/v1')[0];
  const profilePicUrl = personalInfo?.profilePic ? `${baseUrl}${personalInfo.profilePic}` : null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800 relative"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
           <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        {/* Banner */}
        <div className="h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 relative">
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <div className="w-28 h-28 rounded-3xl bg-slate-900 p-1.5 shadow-2xl">
              <div className="w-full h-full rounded-[1.25rem] bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                {profilePicUrl ? (
                   <img src={profilePicUrl} alt={personalInfo?.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-500 text-4xl font-bold uppercase">{personalInfo?.fullName?.charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-16 pb-10 px-8 relative z-10 text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{personalInfo?.fullName}</h1>
          <p className="text-blue-400 font-semibold text-sm mt-1">{personalInfo?.jobTitle}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
             <span className="h-px w-4 bg-slate-700" />
             <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">{personalInfo?.company}</p>
             <span className="h-px w-4 bg-slate-700" />
          </div>
          
          {personalInfo?.bio && (
            <p className="mt-6 text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto italic">
              "{personalInfo?.bio}"
            </p>
          )}

          {/* Contacts */}
          <div className="mt-8 space-y-2.5">
            {contactInfo?.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 px-5 py-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-all text-slate-200 group">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <HiOutlineMail className="text-lg" />
                </div>
                <span className="text-sm font-medium truncate">{contactInfo.email}</span>
              </a>
            )}
            {contactInfo?.phone && (
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 px-5 py-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-all text-slate-200 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                   <HiOutlinePhone className="text-lg" />
                </div>
                <span className="text-sm font-medium">{contactInfo.phone}</span>
              </a>
            )}
            {contactInfo?.website && (
              <a href={contactInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-all text-slate-200 group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                   <HiOutlineGlobeAlt className="text-lg" />
                </div>
                <span className="text-sm font-medium truncate">{contactInfo.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {contactInfo?.address && (
              <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                   <HiOutlineLocationMarker className="text-lg" />
                </div>
                <span className="text-sm font-medium">{contactInfo.address}</span>
              </div>
            )}
          </div>

          {/* Socials */}
          <div className="mt-10 flex justify-center gap-5">
            {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all border border-slate-700"><FaLinkedin className="text-xl" /></a>}
            {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-slate-700"><FaGithub className="text-xl" /></a>}
            {socialLinks?.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-all border border-slate-700"><FaTwitter className="text-xl" /></a>}
            {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all border border-slate-700"><FaInstagram className="text-xl" /></a>}
          </div>
        </div>

        {/* Footer Branding */}
        <div className="bg-slate-950/50 py-5 text-center border-t border-slate-800/50">
           <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black">Powered by Digital World</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ModernBusinessTemplate;
