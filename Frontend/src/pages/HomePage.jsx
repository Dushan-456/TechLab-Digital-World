import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineHeart,
  HiOutlineGift,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineExternalLink,
  HiOutlineCreditCard,
  HiOutlineUpload,
  HiOutlineClipboardCopy,
  HiOutlineCheck,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineDeviceMobile,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from "react-icons/hi";

const categories = [
  {
    id: "wedding",
    name: "Wedding Invitations",
    tagline: "Romantic, timeless & luxury envelope reveals",
    icon: HiOutlineHeart,
    color: "#d4af37",
    bgGradient: "from-amber-500/20 via-rose-500/10 to-transparent",
    demoUrl: "/v/supun-imesha",
    price: "Rs. 4,500",
    features: [
      "Royal gold animated wax-seal envelope reveal",
      "Couple story, timeline & photo gallery",
      "Background romantic music player",
      "Google Maps venue directions & Calendar sync",
      "Real-time guest RSVP tracking dashboard",
    ],
    sampleNames: "Supun & Imesha's Royal Wedding",
    venue: "Monarch Imperial Ballroom",
  },
  {
    id: "birthday",
    name: "Birthday Celebrations",
    tagline: "Energetic neon bash & cheerful confetti party themes",
    icon: HiOutlineGift,
    color: "#ec4899",
    bgGradient: "from-fuchsia-500/20 via-pink-500/10 to-transparent",
    demoUrl: "/v/alex-bash-25",
    price: "Rs. 3,500",
    features: [
      "Neon glow cyberpunk & vibrant party aesthetics",
      "Live countdown timer to party kickoff",
      "Interactive RSVP attendance form with party confetti",
      "Map directions, venue dress code & host contacts",
      "100% mobile-friendly for WhatsApp & Instagram sharing",
    ],
    sampleNames: "Alex's 25th Neon Rooftop Bash",
    venue: "Club SkyLine Rooftop Lounge",
  },
  {
    id: "business-event",
    name: "Business Conferences & Summits",
    tagline: "High-level keynote schedules, speaker lineups & delegate passes",
    icon: HiOutlineCalendar,
    color: "#6366f1",
    bgGradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
    demoUrl: "/v/techlab-summit-2026",
    price: "Rs. 5,000",
    features: [
      "Executive keynote speaker cards with LinkedIn integration",
      "Structured agenda breakdown & session schedules",
      "Delegate seat reservation & attendance tracking",
      "Corporate sponsors & partner brand showcase",
      "One-click Google Calendar delegate sync",
    ],
    sampleNames: "TechLab Digital Innovation Summit 2026",
    venue: "Shangri-La Ballroom Colombo",
  },
  {
    id: "event",
    name: "Social Galas & Reunions",
    tagline: "Formal corporate dinners, charity galas & anniversary meetups",
    icon: HiOutlineCalendar,
    color: "#0ea5e9",
    bgGradient: "from-sky-500/20 via-teal-500/10 to-transparent",
    demoUrl: "/v/annual-gala-2026",
    price: "Rs. 3,500",
    features: [
      "Classy editorial typography & host highlights",
      "Dress code guidance & formal banquet program",
      "Google Maps embed for effortless guest arrival",
      "Guest RSVP confirmation & table allocations",
      "Instant multi-guest attendance management",
    ],
    sampleNames: "Annual Founders Charity Gala & Ball",
    venue: "Cinnamon Grand Colombo",
  },
  {
    id: "business-card",
    name: "Digital Business Cards",
    tagline: "NFC & QR ready executive networking cards",
    icon: HiOutlineIdentification,
    color: "#3b82f6",
    bgGradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    demoUrl: "/b/dushan-senarath",
    price: "Rs. 2,500",
    features: [
      "One-tap Call, Email, WhatsApp & Save to Contacts (vCard)",
      "LinkedIn, GitHub, Portfolio & Social links",
      "High-resolution scannable QR Code ready for NFC",
      "No app download required for anyone who scans",
      "Instant profile updates anytime without reprinting",
    ],
    sampleNames: "Dushan Senarath — Founder & CTO",
    venue: "TechLab Digital World",
  },
];

const faqs = [
  {
    q: "How does the direct bank transfer payment work?",
    a: "After you design your invitation or card in our online wizard, the card is created in 'Pending Payment' status. You make a local bank transfer to TechLab Digital World's Commercial Bank account and upload your deposit receipt or mobile banking screenshot directly from your Customer Profile. Our admin team verifies it and activates your card immediately.",
  },
  {
    q: "What happens when someone visits my link before payment approval?",
    a: "Before payment approval, the card URL displays an elegant pending activation holding screen informing visitors that the invitation is being activated by the administrator. Once approved, the full interactive invitation or card instantly goes live.",
  },
  {
    q: "Do my guests need to download an application?",
    a: "Not at all! All TechLab invitations and business cards open directly in any mobile or desktop web browser (Safari, Chrome, etc.) with lightning-fast load times. Simply send the link on WhatsApp, SMS, or scan the QR code.",
  },
  {
    q: "How do I see who is attending my event?",
    a: "Log in to your Customer Profile at any time to access your live RSVP dashboard. You can see total guests attending, dietary requests, well wishes, and export guest lists whenever you need.",
  },
  {
    q: "Can I customize the colors, photos, and music?",
    a: "Yes! During the visual 3-step order wizard, you can upload cover photos, gallery images, custom welcome messages, and choose from diverse audio tracks or template styles without writing a single line of code.",
  },
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedCatId, setSelectedCatId] = useState("wedding");
  const [copiedBank, setCopiedBank] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const copyBankDetails = () => {
    navigator.clipboard.writeText("8004567890");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-x-hidden">
      {/* ── Ambient Background Lighting ─────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-rose-500/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-600/10 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute top-[1800px] left-0 w-[500px] h-[500px] bg-gradient-to-r from-amber-600/10 to-transparent blur-[130px] pointer-events-none" />

      {/* ── Top Navigation Bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <HiOutlineSparkles className="text-xl text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-tight">
                TechLab <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">Digital</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-medium">
                Digital World &amp; SaaS
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#showcase" className="hover:text-amber-400 transition-colors">Showcase</a>
            <a href="#categories" className="hover:text-amber-400 transition-colors">Categories</a>
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="#bank-transfer" className="hover:text-amber-400 transition-colors">Bank Transfer</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-amber-400 transition-colors">FAQs</a>
          </nav>

          {/* User Auth CTAs */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  My Profile ({user?.firstName})
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold hover:bg-indigo-600/50 transition-all"
                  >
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/10 mb-8 animate-fade-in">
            <HiOutlineSparkles className="text-amber-400" />
            Next-Gen Digital Invitations &amp; Smart Business Cards
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Turn Every Event &amp; Brand Into a{" "}
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
              Digital Experience
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 font-light max-w-2xl mx-auto mt-6 leading-relaxed">
            Create luxurious wedding invitations, electrifying birthday bashes, corporate conference agendas, and NFC business cards in minutes. No coding required.
          </p>

          {/* Dual CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/order/create"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              Start Creating Now <HiOutlineArrowRight className="text-base" />
            </Link>
            <a
              href="#showcase"
              className="px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm tracking-wide transition-all hover:border-slate-600 flex items-center gap-2"
            >
              Explore Live Demos
            </a>
          </div>

          {/* Key Selling Points / Trust Pillars */}
          <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <HiOutlineHeart className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">5 Categories</p>
                <p className="text-xs text-slate-400">Weddings, Birthdays, Cards &amp; more</p>
              </div>
            </div>

            <div className="text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
                <HiOutlineUserGroup className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Live RSVP Tracker</p>
                <p className="text-xs text-slate-400">Manage guest headcount in real time</p>
              </div>
            </div>

            <div className="text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <HiOutlineDeviceMobile className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Zero App Downloads</p>
                <p className="text-xs text-slate-400">Opens instantly in any mobile browser</p>
              </div>
            </div>

            <div className="text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <HiOutlineShieldCheck className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Direct Bank Transfer</p>
                <p className="text-xs text-slate-400">Safe, verified local bank checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Category Showcase Section ───────────────── */}
      <section id="showcase" className="py-20 px-4 sm:px-6 bg-slate-950/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Hand-Crafted Template Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Explore Our Signature Collection
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4">
              Click any category below to inspect its features, preview sample cards, and experience a live interactive demo.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <Icon className="text-lg" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Active Category Showcase Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${activeCategory.bgGradient}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Details & Checklist */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span
                    className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest"
                    style={{ backgroundColor: `${activeCategory.color}20`, color: activeCategory.color }}
                  >
                    {activeCategory.price} Full Package
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Ready in minutes</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {activeCategory.name}
                </h3>
                <p className="text-base text-slate-300 leading-relaxed font-light">
                  {activeCategory.tagline}
                </p>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  {activeCategory.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs">
                        <HiOutlineCheck />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={activeCategory.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <HiOutlineExternalLink className="text-base text-amber-400" />
                    Open Live Interactive Demo
                  </a>
                  <Link
                    to={`/order/create?category=${activeCategory.id}`}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    Order This Category Now <HiOutlineArrowRight />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Preview Mockup */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-sm rounded-3xl bg-slate-950 border-2 border-slate-800 p-6 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-rose-400" />

                  {/* Mock card preview header */}
                  <div className="text-center py-4 border-b border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Live Sample Preview
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">
                      {activeCategory.sampleNames}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{activeCategory.venue}</p>
                  </div>

                  {/* Mock card details */}
                  <div className="py-6 space-y-4 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-br from-amber-500 to-rose-500 p-[2px] shadow-lg">
                      <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-300 text-2xl font-bold">
                        ✦
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic px-4">
                      "Experience the elegance, seamless calendar syncing, and one-tap RSVP confirmation on any device."
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                      <HiOutlineCheckCircle /> Ready to share on WhatsApp
                    </div>
                  </div>

                  {/* Direct button inside mockup */}
                  <div className="pt-2">
                    <a
                      href={activeCategory.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      Click to Test Experience <HiOutlineExternalLink />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 Categories Grid Overview ──────────────────────────── */}
      <section id="categories" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">All Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Tailored for Every Life Milestone &amp; Event
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between hover:-translate-y-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        <Icon />
                      </div>
                      <span className="text-xs font-extrabold text-white px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                        {cat.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {cat.tagline}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                      {cat.features.slice(0, 3).map((f, i) => (
                        <p key={i} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="text-emerald-400">✓</span> {f}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <a
                      href={cat.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      Demo <HiOutlineExternalLink />
                    </a>
                    <Link
                      to={`/order/create?category=${cat.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works (4 Steps) ──────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-slate-950/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Frictionless Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How Ordering Works in 4 Simple Steps
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              No technical expertise needed. You enter details, we prepare everything, and you verify payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Register & Select Design",
                desc: "Create an account in 30 seconds and pick a template from our signature library.",
                icon: HiOutlineSparkles,
              },
              {
                step: "02",
                title: "Provide Event Info",
                desc: "Fill in names, dates, venue location, photos, music preference, and RSVP deadlines.",
                icon: HiOutlineCalendar,
              },
              {
                step: "03",
                title: "Bank Transfer & Slip Upload",
                desc: "Transfer to our verified bank account and upload your deposit slip in your Profile.",
                icon: HiOutlineUpload,
              },
              {
                step: "04",
                title: "Admin Approval & Live Link",
                desc: "Our team reviews your receipt and approves the card. Your link & QR are live instantly!",
                icon: HiOutlineCheckCircle,
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-amber-500/20 font-mono">{s.step}</span>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                      <s.icon className="text-xl" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Official Bank Transfer Details Section ───────────────── */}
      <section id="bank-transfer" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <HiOutlineCreditCard className="text-base" /> Direct Bank Transfer
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Official Payment Details
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please deposit the exact card amount to the official TechLab account below.
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
                Verified Business Account
              </div>
            </div>

            {/* Bank Card Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/90 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bank Name</p>
                <p className="text-lg font-bold text-white">Commercial Bank of Ceylon</p>

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-2">Branch</p>
                <p className="text-base font-semibold text-slate-200">Colombo Fort Branch</p>

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-2">Account Name</p>
                <p className="text-base font-semibold text-slate-200">TechLab Digital World (Pvt) Ltd</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/90 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Account Number</p>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-wider mt-1">
                    8004567890
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Use your Name or Card ID as the payment reference or remarks.
                  </p>
                </div>

                <button
                  onClick={copyBankDetails}
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  {copiedBank ? (
                    <>
                      <HiOutlineCheck className="text-base text-emerald-400" /> Account Number Copied!
                    </>
                  ) : (
                    <>
                      <HiOutlineClipboardCopy className="text-base text-amber-400" /> Copy Account Number
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Next Steps Reminder */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-200">
              <HiOutlineCheckCircle className="text-lg text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">After transferring funds:</p>
                <p className="text-slate-300 mt-0.5">
                  Go to your <Link to="/profile" className="text-emerald-400 underline font-semibold">My Profile Dashboard</Link>, click <strong>"Upload Payment Slip"</strong> on your newly created card, and submit your receipt screenshot. We will verify and activate your invitation immediately!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Pricing Section ─────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Simple One-Time Payments
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              No hidden fees, no subscriptions. Pay once, share forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Digital Business Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Networking</span>
                <h3 className="text-2xl font-bold text-white mt-1">Digital Business Card</h3>
                <p className="text-3xl font-black text-white mt-4">Rs. 2,500</p>
                <p className="text-xs text-slate-400">One-time payment per card</p>

                <div className="mt-6 space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300">
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Instant Tap-to-Call, Email &amp; WhatsApp</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> vCard Contact Download</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Social Media &amp; Portfolio Links</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Scannable QR Code</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Lifetime Online Hosting</p>
                </div>
              </div>

              <Link
                to="/order/create?category=business-card"
                className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all"
              >
                Order Business Card
              </Link>
            </div>

            {/* Card 2: Wedding Invitation (Featured) */}
            <div className="bg-gradient-to-b from-amber-500/10 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10 scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Fairytale Milestone</span>
                <h3 className="text-2xl font-bold text-white mt-1">Wedding Invitation</h3>
                <p className="text-3xl font-black text-amber-400 mt-4">Rs. 4,500</p>
                <p className="text-xs text-slate-400">One-time payment per wedding</p>

                <div className="mt-6 space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300">
                  <p className="flex items-center gap-2"><span className="text-amber-400">✦</span> Royal Wax Seal Envelope Reveal</p>
                  <p className="flex items-center gap-2"><span className="text-amber-400">✦</span> Romantic Background Music Player</p>
                  <p className="flex items-center gap-2"><span className="text-amber-400">✦</span> Full Photo Gallery &amp; Couple Story</p>
                  <p className="flex items-center gap-2"><span className="text-amber-400">✦</span> Live Guest RSVP Response Tracker</p>
                  <p className="flex items-center gap-2"><span className="text-amber-400">✦</span> Google Maps Venue Navigation</p>
                  <p className="flex items-center gap-2"><span className="text-amber-400">✦</span> Google Calendar Guest Sync</p>
                </div>
              </div>

              <Link
                to="/order/create?category=wedding"
                className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider text-center block shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Order Wedding Suite
              </Link>
            </div>

            {/* Card 3: Birthdays & Business Summits */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Events &amp; Summits</span>
                <h3 className="text-2xl font-bold text-white mt-1">Events &amp; Conferences</h3>
                <p className="text-3xl font-black text-white mt-4">Rs. 3,500 – 5,000</p>
                <p className="text-xs text-slate-400">Birthday Rs. 3,500 · Summit Rs. 5,000</p>

                <div className="mt-6 space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300">
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Neon Bash or Corporate Theme</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Keynote Speakers &amp; Agenda Timeline</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Live Countdown Clock</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Delegate Registration &amp; RSVP Forms</p>
                  <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Sponsor &amp; Partner Branding</p>
                </div>
              </div>

              <Link
                to="/order/create?category=birthday"
                className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all"
              >
                Order Event Card
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────── */}
      <section id="faqs" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Have Questions?</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-400 transition-colors"
                  >
                    <span>{f.q}</span>
                    {isOpen ? <HiOutlineChevronUp className="text-lg shrink-0" /> : <HiOutlineChevronDown className="text-lg shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom Call To Action Banner ────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Impress Your Guests &amp; Clients?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Join hundreds of hosts who trust TechLab Digital World for their invitations and networking cards. Create yours today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/order/create"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              Start Creating Now
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
            >
              Register Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-amber-400 font-bold">
                ✦
              </div>
            </div>
            <div>
              <p className="font-bold text-white text-sm">TechLab Digital World</p>
              <p className="text-[11px] text-slate-400">Next-Gen Digital Event &amp; Business Solutions</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
            <Link to="/order/create" className="hover:text-white transition-colors">Create Order</Link>
            <Link to="/profile" className="hover:text-white transition-colors">Customer Profile</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <a href="#bank-transfer" className="hover:text-white transition-colors">Bank Details</a>
            <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
              WhatsApp Support
            </a>
          </div>

          <p>© {new Date().getFullYear()} TechLab Digital World. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
