import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineHeart,
  HiOutlineGift,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineUpload,
  HiOutlineInformationCircle,
} from "react-icons/hi";

const categories = [
  { id: "wedding", label: "Wedding Invitation", icon: HiOutlineHeart, color: "#d4af37", price: "Rs. 4,500" },
  { id: "birthday", label: "Birthday Invitation", icon: HiOutlineGift, color: "#ec4899", price: "Rs. 3,500" },
  { id: "event", label: "Social & Party Event", icon: HiOutlineCalendar, color: "#8b5cf6", price: "Rs. 3,500" },
  { id: "business-event", label: "Business Conference & Summit", icon: HiOutlineCalendar, color: "#0ea5e9", price: "Rs. 5,000" },
  { id: "business-card", label: "Digital Business Card", icon: HiOutlineIdentification, color: "#3b82f6", price: "Rs. 2,500" },
];

const templateOptions = {
  wedding: [
    { id: "royalgold", name: "Royal Gold", desc: "Luxury envelope reveal with seal opening and romantic music.", color: "#d4af37" },
    { id: "ethereal", name: "Ethereal", desc: "Ultra-minimalist editorial layout with serif typography.", color: "#b8a080" },
    { id: "lumina", name: "Lumina", desc: "Frosted glassmorphism with delicate pastel gradients.", color: "#a78bfa" },
    { id: "kinetic", name: "Kinetic", desc: "Modern, dynamic fluid motion with bold contrast.", color: "#0ea5e9" },
  ],
  birthday: [
    { id: "joyful", name: "Joyful Celebration", desc: "Vibrant animations, confetti bursts, and cheerful party vibe.", color: "#ec4899" },
    { id: "neon-bash", name: "Neon Glow", desc: "Electrifying dark-mode party theme with glowing accents.", color: "#a855f7" },
  ],
  event: [
    { id: "corporate", name: "Classic Elegance", desc: "Timeless celebration layout suitable for galas and reunions.", color: "#1e293b" },
  ],
  "business-event": [
    { id: "summit-pro", name: "Summit Pro", desc: "Executive conference theme with speaker showcase & agenda schedule.", color: "#0284c7" },
    { id: "corporate", name: "Corporate Event", desc: "Clean, professional seminar & workshop layout.", color: "#1e293b" },
  ],
  "business-card": [
    { id: "modern", name: "Modern Executive", desc: "Sleek card with quick tap-to-call, email, and social buttons.", color: "#3b82f6" },
    { id: "minimal", name: "Minimal Studio", desc: "Clean typography focused on essential details & portfolio.", color: "#10b981" },
    { id: "classic", name: "Classic Heritage", desc: "Traditional layout with distinguished profile presentation.", color: "#6366f1" },
  ],
};

const inputCls =
  "w-full h-11 px-4 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";
const labelCls = "block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5";

const OrderWizardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Design, 2: Details, 3: Confirmation

  const [category, setCategory] = useState("wedding");
  const [templateId, setTemplateId] = useState("royalgold");

  // Form Fields
  const [cardId, setCardId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");

  // Wedding fields
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [brideParents, setBrideParents] = useState("");
  const [groomParents, setGroomParents] = useState("");

  // Birthday fields
  const [celebrantName, setCelebrantName] = useState("");
  const [age, setAge] = useState("");

  // Event & Business Event fields
  const [eventName, setEventName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [tagline, setTagline] = useState("");

  // Business Card fields
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Media
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    const availableTemplates = templateOptions[catId] || [];
    if (availableTemplates.length > 0) {
      setTemplateId(availableTemplates[0].id);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmitOrder = async () => {
    setError("");
    if (!cardId.trim()) {
      setError("Please choose a custom link slug for your card.");
      return;
    }

    setSubmitting(true);

    try {
      if (category === "business-card") {
        // Business card payload
        const payload = {
          cardId: cardId.toLowerCase().trim(),
          templateId,
          personalInfo: {
            fullName: fullName.trim() || user?.firstName + " " + user?.lastName,
            jobTitle: jobTitle.trim(),
            company: company.trim(),
            bio: bio.trim(),
          },
          contactInfo: {
            email: email.trim() || user?.email,
            phone: phone.trim(),
            website: website.trim(),
          },
          socialLinks: {
            linkedin: linkedin.trim(),
          },
          status: "PENDING_PAYMENT",
        };

        await API.post("business-cards", payload);
      } else {
        // Invitation payload
        const formData = new FormData();
        formData.append("invitationType", category);
        formData.append("cardId", cardId.toLowerCase().trim());
        formData.append("templateId", templateId);
        formData.append("eventDate", eventDate || new Date().toISOString());
        if (eventTime) formData.append("eventTime", eventTime);
        formData.append("eventLocation", eventLocation.trim() || "Venue Location");
        if (welcomeText) formData.append("welcomeText", welcomeText.trim());
        if (rsvpDeadline) formData.append("rsvpDeadline", rsvpDeadline);

        if (category === "wedding") {
          formData.append("brideName", brideName.trim());
          formData.append("groomName", groomName.trim());
          if (brideParents) formData.append("brideParents", brideParents.trim());
          if (groomParents) formData.append("groomParents", groomParents.trim());
        } else if (category === "birthday") {
          formData.append("celebrantName", celebrantName.trim());
          if (age) formData.append("age", age);
        } else if (category === "business-event") {
          formData.append("eventTitle", eventName.trim());
          if (tagline) formData.append("tagline", tagline.trim());
          if (organizer) formData.append("organizer", organizer.trim());
        } else {
          formData.append("eventName", eventName.trim());
          if (organizer) formData.append("organizer", organizer.trim());
        }

        if (coverFile) {
          formData.append("coverImage", coverFile);
        }

        await API.post("invitations", formData);
      }

      // Success -> navigate to profile
      navigate("/profile");
    } catch (err) {
      console.error("Order creation error:", err);
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data?.error?.[0]?.message ||
        err.response?.data?.error ||
        "Failed to submit order. Make sure your link slug is unique.";
      setError(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => c.id === category);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-800 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <HiOutlineSparkles />
            </div>
            TechLab Digital
          </Link>

          <Link
            to="/profile"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <HiOutlineArrowLeft /> Back to Profile
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {/* Wizard Step Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              1
            </span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">Select Design</span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 2 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              2
            </span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">Fill Details</span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 3 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              3
            </span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">Review & Order</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: CHOOSE CATEGORY & TEMPLATE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Step 1: Choose Your Category</h2>
                <p className="text-xs text-slate-500 mt-1">Select the invitation or card type you want to create</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 shadow-sm"
                        style={{ background: cat.color }}
                      >
                        <Icon className="text-xl" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{cat.label}</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1">{cat.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Select Design Style</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pick the template theme that fits your celebration</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(templateOptions[category] || []).map((tpl) => {
                  const isSelected = templateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 items-start ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: tpl.color }}
                      >
                        {tpl.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-800">{tpl.name}</h4>
                          {isSelected && <HiOutlineCheckCircle className="text-indigo-600 text-lg" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Continue to Details <HiOutlineArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FILL DETAILS */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 2: Enter Invitation Details</h2>
              <p className="text-xs text-slate-500 mt-1">Provide your event information. No coding required!</p>
            </div>

            {/* Custom Link Slug */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Custom Web Link Slug *
              </label>
              <div className="flex items-center">
                <span className="text-xs font-mono text-slate-500 bg-white border border-r-0 border-slate-200 px-3 py-2.5 rounded-l-lg">
                  {window.location.host}/{category === "business-card" ? "b" : "v"}/
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. dushan-and-nisha"
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-r-lg text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <p className="text-[11px] text-slate-500">Only lowercase letters, numbers, and hyphens (e.g. kasun-birthday-2026)</p>
            </div>

            {/* Category-Specific Fields */}
            {category === "wedding" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Bride's Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nisha Fernando"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Groom's Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dushan Perera"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Bride's Parents (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. & Mrs. Fernando"
                      value={brideParents}
                      onChange={(e) => setBrideParents(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Groom's Parents (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. & Mrs. Perera"
                      value={groomParents}
                      onChange={(e) => setGroomParents(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {category === "birthday" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Celebrant's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Smith"
                    value={celebrantName}
                    onChange={(e) => setCelebrantName(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Age Milestone (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 21"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {(category === "event" || category === "business-event") && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tech Horizons Annual Summit"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Organizer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. TechLab Innovations"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
                {category === "business-event" && (
                  <div>
                    <label className={labelCls}>Event Tagline / Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Shaping the Next Decade of Enterprise AI"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                )}
              </div>
            )}

            {category === "business-card" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dushan Perera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Architect"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Company</label>
                    <input
                      type="text"
                      placeholder="e.g. TechLab Digital"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      type="text"
                      placeholder="+94 77 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Work Email</label>
                    <input
                      type="email"
                      placeholder="dushan@techlab.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Common Date, Venue & Message fields for invitations */}
            {category !== "business-card" && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Event Date *</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Event Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 5:00 PM onwards"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>RSVP Deadline</label>
                    <input
                      type="date"
                      value={rsvpDeadline}
                      onChange={(e) => setRsvpDeadline(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Event Venue & Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shangri-La Grand Ballroom, Colombo"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Welcome Message to Guests</label>
                  <textarea
                    rows={2}
                    placeholder="A heartfelt message welcoming your friends and family..."
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className={labelCls}>Cover Photo Upload (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {coverPreview && (
                    <img src={coverPreview} alt="Cover" className="h-28 rounded-lg mt-2 object-cover border" />
                  )}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-200 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <HiOutlineArrowLeft /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!cardId) {
                    setError("Please specify a custom link slug.");
                    return;
                  }
                  setError("");
                  setStep(3);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                Review Order <HiOutlineArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & BANK INSTRUCTIONS */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 3: Review & Place Order</h2>
              <p className="text-xs text-slate-500 mt-1">Review your summary before submitting</p>
            </div>

            {/* Order Summary Card */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Service Category</span>
                <span className="font-bold text-slate-900 capitalize">{selectedCategoryObj?.label}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Selected Template Style</span>
                <span className="font-semibold text-indigo-700 capitalize">{templateId}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Public Link Slug</span>
                <span className="font-mono font-bold text-slate-800">/{cardId}</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-base">
                <span className="font-bold text-slate-900">Total Amount Due</span>
                <span className="font-bold text-indigo-600 text-lg">{selectedCategoryObj?.price}</span>
              </div>
            </div>

            {/* Bank Transfer Information Notice */}
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs text-amber-950">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                <HiOutlineInformationCircle className="text-lg" />
                Payment & Activation Workflow:
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                <li>Once you submit this order, your card will be created in <strong>Pending Payment</strong> state.</li>
                <li>Transfer <strong>{selectedCategoryObj?.price}</strong> to our bank account (Commercial Bank: <code>8002 9182 3401</code>).</li>
                <li>Go to your <strong>Profile Dashboard</strong> and upload a photo of your bank transfer slip.</li>
                <li>Our team will verify your receipt and <strong>activate your live link</strong> immediately!</li>
              </ol>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <HiOutlineArrowLeft /> Back to Edit
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitOrder}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <HiOutlineCheckCircle className="text-lg" />
                {submitting ? "Placing Order..." : "Confirm & Place Order"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderWizardPage;
