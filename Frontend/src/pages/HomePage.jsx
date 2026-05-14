import { Link } from "react-router-dom";
import { HiOutlineHeart, HiOutlineSparkles, HiOutlinePencilAlt, HiOutlineShare } from "react-icons/hi";

const features = [
  { icon: HiOutlinePencilAlt, title: "Design", desc: "Choose from curated templates crafted for elegance." },
  { icon: HiOutlineSparkles, title: "Personalize", desc: "Add your details, photos, and custom welcome message." },
  { icon: HiOutlineShare, title: "Share", desc: "Send a unique link to all your guests instantly." },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }} />
          <div className="absolute bottom-32 right-1/4 w-60 h-60 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} />
        </div>
        <div className="relative text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-xs font-medium mb-6">
            <HiOutlineHeart className="text-sm" /> Crafted with love
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-[var(--color-text)] font-[var(--font-serif)] leading-tight">
            Beautiful Digital<br />
            <span className="font-semibold italic">Wedding Invitations</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] mt-6 font-light leading-relaxed max-w-lg mx-auto">
            Create stunning, personalized wedding invitations that capture the essence of your love story.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link to="/login" className="h-12 px-8 inline-flex items-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-semibold rounded-full hover:shadow-xl hover:shadow-[var(--color-primary)]/20 transition-all duration-300">
              Get Started
            </Link>
            <a href="#features" className="h-12 px-8 inline-flex items-center border border-[var(--color-border)] text-[var(--color-text)] text-sm font-medium rounded-full hover:bg-[var(--color-surface-100)] transition-all duration-300">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-light text-[var(--color-text)] font-[var(--font-serif)]">
            Three simple <span className="font-semibold italic">steps</span>
          </h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
                <f.icon className="text-2xl text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] font-[var(--font-display)]">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 text-center">
        <p className="text-xs text-[var(--color-text-light)]">© 2026 Digital Wedding. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
