import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Settings,
  Zap,
  Shield,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Brain,
  Database,
  LineChart,
  Menu,
  X,
} from "lucide-react";

// ─── Scroll restoration ─────────────────────────────────────────────────────
function useScrollRestoration(key = "scroll_pos") {
  useEffect(() => {
    // Restore saved position after mount (use a tiny delay so layout is ready)
    const saved = sessionStorage.getItem(key);
    if (saved !== null) {
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
    }

    // Save on every scroll
    const save = () => sessionStorage.setItem(key, String(window.scrollY));
    window.addEventListener("scroll", save, { passive: true });

    // Also save right before the tab/window closes or navigates away
    window.addEventListener("beforeunload", save);

    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("beforeunload", save);
    };
  }, [key]);
}

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCounter(end, duration = 1800, start = 0) {
  const [value, setValue] = useState(start);
  const frameRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(start + (end - start) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, start]);

  return value;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavBar({ isSignedIn }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
            <div className="w-4 h-4 bg-white rotate-45 rounded-sm" />
          </div>
          <span className="font-bold text-base tracking-tight text-gray-950">
            DASHNOVA
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {["Features", "Analytics", "Reports", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {isSignedIn ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-150"
            >
              Dashboard <ChevronRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 px-2 py-1"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-150 shadow-sm"
              >
                Get Started <ArrowRight size={13} />
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-black rounded-md focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3 shadow-lg animate-fade-in">
          {["Features", "Analytics", "Reports", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 hover:text-black py-1.5 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection({ isSignedIn }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #6366f1 0%, #8b5cf6 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #0ea5e9 0%, #06b6d4 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 backdrop-blur-sm">
        <Sparkles size={12} className="text-indigo-500" />
        <span className="text-xs font-semibold text-indigo-700 tracking-wide">
          AI-Powered Business Analytics
        </span>
      </div>

      <h1 className="relative text-center text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-950 leading-[1.05] max-w-4xl">
        Turn your data into{" "}
        <span
          className="relative inline-block"
          style={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #0ea5e9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          decisions
        </span>
      </h1>

      <p className="relative mt-6 text-center text-lg text-gray-500 max-w-xl leading-relaxed font-medium">
        Upload your business ledgers, get instant AI insights — revenue trends,
        forecasting, and actionable reports in seconds.
      </p>

      <div className="relative mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to={isSignedIn ? "/dashboard" : "/signup"}
          id="hero-get-started"
          className="group flex items-center gap-2 px-7 py-3.5 bg-black text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all duration-200 hover:-translate-y-0.5"
        >
          {isSignedIn ? "Go to Dashboard" : "Get Started — Free"}
          <ArrowRight
            size={15}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </Link>
        <a
          href="#features"
          className="flex items-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          See features
        </a>
      </div>

      <p className="relative mt-8 text-xs text-gray-400 font-medium">
        No credit card required · Free forever plan available
      </p>

      <div className="relative mt-16 w-full max-w-5xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
            <div className="ml-3 flex-1 max-w-xs">
              <div className="h-4 rounded-full bg-gray-200/80 text-[10px] font-mono text-gray-400 flex items-center justify-center">
                app.dashnova.io/dashboard
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Total Revenue",
                  value: "Rs 284,392",
                  trend: "+14.2%",
                },
                {
                  label: "Sales Volume",
                  value: "12,847",
                  trend: "+8.5%",
                },
                {
                  label: "Avg Order Value",
                  value: "Rs 22.14",
                  trend: "+5.1%",
                },
                {
                  label: "Active Customers",
                  value: "4,201",
                  trend: "+12.3%",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-4 rounded-xl border border-gray-100 bg-gray-50/60"
                >
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {kpi.label}
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    {kpi.value}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {kpi.trend}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/40">
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 10
                            ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                            : i % 2 === 0
                            ? "#e5e7eb"
                            : "#d1d5db",
                      }}
                    />
                  )
                )}
              </div>
              <div className="flex justify-between mt-2">
                {[
                  "Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec",
                ].map((m) => (
                  <span
                    key={m}
                    className="text-[8px] font-mono text-gray-400"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9))",
          }}
        />
      </div>
    </section>
  );
}

function StatsSection() {
  const rev = useCounter(284392, 2000);
  const customers = useCounter(4200, 1600);
  const files = useCounter(98, 1400);

  return (
    <section className="py-16 border-y border-gray-100 bg-gray-50/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: `Rs ${rev.toLocaleString()}+`, label: "Revenue tracked" },
            { value: `${customers.toLocaleString()}+`, label: "Active users" },
            { value: `${files}%`, label: "Forecast accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-4xl font-black text-gray-950 tracking-tight">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-medium text-gray-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      color: "bg-indigo-50 text-indigo-600",
      title: "Analytics",
      desc: "Deep-dive into revenue trends, customer cohorts, and product performance — all from your uploaded ledger data.",
    },
    {
      icon: TrendingUp,
      color: "bg-violet-50 text-violet-600",
      title: "Forecasting",
      desc: "AI-driven predictions for future revenue, demand patterns, and growth trajectories for smarter planning.",
    },
    {
      icon: FileText,
      color: "bg-sky-50 text-sky-600",
      title: "Reports",
      desc: "Auto-generated PDF and CSV reports summarising performance metrics, ready to share with your team.",
    },
    {
      icon: Brain,
      color: "bg-emerald-50 text-emerald-600",
      title: "AI Assistant",
      desc: "Ask questions in plain English. Get answers, charts, and recommendations from your data instantly.",
    },
    {
      icon: Database,
      color: "bg-orange-50 text-orange-600",
      title: "Data Upload",
      desc: "Drag-and-drop CSV, QuickBooks, or Excel files. Automatic parsing and normalisation in seconds.",
    },
    {
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
      title: "Settings",
      desc: "Manage your organisation, team members, data sources, and notification preferences from one place.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
            <Zap size={12} className="text-indigo-500" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Full Suite
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Everything your business needs
          </h2>
          <p className="mt-3 text-gray-500 text-base max-w-lg mx-auto font-medium">
            From raw spreadsheets to boardroom-ready insights — DashNova handles
            the entire analytics pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 70% 0%, rgba(99,102,241,0.04) 0%, transparent 60%)",
                }}
              />

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
              >
                <Icon size={18} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>

              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-indigo-500 transition-colors duration-200">
                Learn more{" "}
                <ChevronRight
                  size={12}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Upload your data",
      desc: "Drag and drop CSV, Excel, or QuickBooks exports. DashNova parses and normalises everything automatically.",
      icon: Database,
      color: "from-indigo-500 to-violet-500",
    },
    {
      num: "02",
      title: "AI analyses it",
      desc: "Our AI engine scans your ledger, identifies patterns, computes KPIs, and prepares forecasts — all in seconds.",
      icon: Brain,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      num: "03",
      title: "Make decisions",
      desc: "Explore rich dashboards, ask questions in plain English, and export boardroom-ready reports with one click.",
      icon: LineChart,
      color: "from-sky-500 to-cyan-500",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-950 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
            <Sparkles size={12} className="text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
              How it works
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            From upload to insight in minutes
          </h2>
          <p className="mt-3 text-gray-400 text-base max-w-md mx-auto font-medium">
            No technical setup. No data science team required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, title, desc, icon: Icon, color }) => (
            <div
              key={num}
              className="relative flex flex-col items-start p-7 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${color} shadow-lg`}
              >
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-5xl font-black text-white/10 absolute top-5 right-6 leading-none">
                {num}
              </span>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ isSignedIn }) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative">
        <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mx-auto mb-7 shadow-xl">
          <div className="w-7 h-7 bg-white rotate-45 rounded-sm" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-4">
          Ready to unlock your data's potential?
        </h2>
        <p className="text-gray-500 text-base font-medium max-w-lg mx-auto mb-10 leading-relaxed">
          Join thousands of businesses using DashNova to drive growth with
          AI-powered analytics. Get started free — no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={isSignedIn ? "/dashboard" : "/signup"}
            id="cta-get-started"
            className="group flex items-center gap-2 px-8 py-4 bg-black text-white font-bold text-sm rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-900 transition-all duration-200 hover:-translate-y-0.5"
          >
            {isSignedIn ? "Open Dashboard" : "Start for free"}
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </Link>
          {!isSignedIn && (
            <Link
              to="/signin"
              className="flex items-center gap-2 px-6 py-4 bg-white text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              Sign in instead
            </Link>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Shield, text: "Enterprise-grade security" },
            { icon: Zap, text: "99.9% uptime SLA" },
            { icon: Database, text: "SOC 2 compliant" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-xs font-medium text-gray-400"
            >
              <Icon size={13} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
            <div className="w-3 h-3 bg-white rotate-45 rounded-sm" />
          </div>
          <span className="font-bold text-sm tracking-tight text-gray-900">
            DASHNOVA
          </span>
        </div>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} DashNova. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { isSignedIn } = useAuth();
  useScrollRestoration("landing_scroll");

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <NavBar isSignedIn={isSignedIn} />
      <HeroSection isSignedIn={isSignedIn} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection isSignedIn={isSignedIn} />
      <Footer />
    </div>
  );
}