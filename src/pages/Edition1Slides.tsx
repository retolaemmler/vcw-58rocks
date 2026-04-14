import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Home, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";
import vcwLogo from "@/assets/vcw-logo.png";

/* ─── slide data ─── */
const slides: { title: string; subtitle?: string; content: React.ReactNode; bg?: string }[] = [
  /* 0 — Title */
  {
    title: "",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
        <img src={vcwLogo} alt="Vibe Code Workshop" className="w-40 h-40 rounded-full" />
        <p className="uppercase tracking-[0.3em] text-white/70 text-xl font-medium">Edition 1 · 16 April 2026</p>
        <h1 className="text-7xl sm:text-8xl font-extrabold text-white leading-tight font-display">
          Vibe Code<br />Workshop
        </h1>
        <p className="text-2xl text-white/80 max-w-2xl leading-relaxed">
          Build decision-support tools, workflows, and internal products — using AI and natural language.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="px-4 py-2 rounded-full bg-white/15 text-white text-base">memox @ Novu Campus · Zürich</span>
          <span className="px-4 py-2 rounded-full bg-white/15 text-white text-base">09:00 – 17:00</span>
        </div>
      </div>
    ),
  },

  /* 1 — Your Coaches */
  {
    title: "Your Coaches",
    content: (
      <div className="grid grid-cols-2 gap-10 px-16 pt-8 max-w-3xl mx-auto">
        {[
          { name: "Valentin Binnendijk", role: "Product Expert & Consultant", initials: "VB", ambassador: true, image: valentinImg },
          { name: "Reto Lämmler", role: "Entrepreneur & UX Expert", initials: "RL", ambassador: true, image: retoImg },
        ].map((c) => (
          <div key={c.name} className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10">
            <img src={c.image} alt={c.name} className="w-24 h-24 rounded-full object-cover ring-2 ring-white/20" />
            <h3 className="text-2xl font-bold text-white">{c.name}</h3>
            <p className="text-lg text-white/60">{c.role}</p>
            {c.ambassador && (
              <span className="text-sm bg-[hsl(174,72%,40%)]/20 text-[hsl(174,72%,55%)] px-3 py-1 rounded-full">
                🩷 Lovable Ambassador
              </span>
            )}
          </div>
        ))}
      </div>
    ),
  },

  /* 2 — Today's Schedule */
  {
    title: "Today's Schedule",
    content: (
      <div className="grid grid-cols-2 gap-4 px-16 pt-2">
        {[
          { time: "09:00", label: "Welcome & Intro", desc: "Introductions, intro to vibe coding, Lovable setup & tips for structuring your project" },
          { time: "10:00", label: "Workshop Session #1", desc: "Start working on your app with continuous coaching support" },
          { time: "12:00", label: "🍕 Lunch Break", desc: "Refuel and chat with fellow participants" },
          { time: "13:00", label: "Next Level Vibe Coding", desc: "APIs, emails, payments, backend, login, security — adding complexity" },
          { time: "13:30", label: "Workshop Session #2", desc: "Continue building & polish your app" },
          { time: "15:30", label: "Presentations & Feedback", desc: "Present your app to the others and give feedback" },
          { time: "16:15", label: "Future of Vibe Coding", desc: "Focus is the key! Agentic engineering & what's next" },
          { time: "16:30", label: "Q&A + 🍺 Beer", desc: "Wrap up, questions, and celebrate together" },
        ].map((s) => (
          <div key={s.time} className="flex gap-5 items-start p-5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-2xl font-mono font-bold text-[hsl(174,72%,55%)] shrink-0 w-16">{s.time}</span>
            <div>
              <h3 className="text-xl font-semibold text-white">{s.label}</h3>
              <p className="text-base text-white/50 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },

  /* 3 — What is Vibe Coding? */
  {
    title: "What is Vibe Coding?",
    content: (
      <div className="flex gap-12 px-16 pt-8 items-start">
        <div className="flex-1 space-y-6">
          <blockquote className="text-2xl italic text-white/80 border-l-4 border-[hsl(174,72%,40%)] pl-6">
            "You describe a problem in plain language — AI builds a working app."
          </blockquote>
          <ul className="space-y-4 text-xl text-white/70">
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">→</span> No syntax. No setup. No waiting for developers.</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">→</span> Describe the problem and context</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">→</span> AI generates a real, usable application</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">→</span> You improve it by talking to the system</li>
          </ul>
          <p className="text-lg text-white/50 mt-8">
            Think of it as: <strong className="text-white/80">Product thinking + conversation + fast feedback loops</strong>
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {["IDEA → describe your vision", "PROCESS → AI structures it", "BUILD → code is generated", "REFINE → iterate with prompts"].map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(174,72%,40%)] to-[hsl(262,80%,55%)] flex items-center justify-center text-white font-bold">
                {i + 1}
              </span>
              <span className="text-lg text-white/80">{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* 4 — Prompting = Clear Thinking */
  {
    title: "Prompting = Clear Thinking",
    content: (
      <div className="flex gap-12 px-16 pt-6">
        <div className="flex-1 space-y-6">
          <p className="text-xl text-white/70 leading-relaxed">
            Prompt engineering is not technical.<br />
            It's about <strong className="text-white">explaining what you want clearly.</strong>
          </p>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Good prompts include:</h3>
            <ul className="space-y-3 text-lg text-white/70">
              <li>🎯 <strong className="text-white">Context</strong> — who is this for?</li>
              <li>📐 <strong className="text-white">Constraints</strong> — what matters / what doesn't</li>
              <li>✅ <strong className="text-white">Desired outcome</strong> — what "good" looks like</li>
            </ul>
          </div>
          <p className="text-lg text-white/50 italic mt-6">
            If you can explain a problem to a colleague, you can prompt an AI.
          </p>
        </div>
        <div className="flex-1 space-y-4">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-5">
            <p className="text-sm text-red-400 uppercase tracking-wider mb-2 font-semibold">❌ Bad Prompt</p>
            <p className="text-lg text-white/80">"Make a dashboard."</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5">
            <p className="text-sm text-emerald-400 uppercase tracking-wider mb-2 font-semibold">✅ Good Prompt</p>
            <p className="text-lg text-white/80">"Create a dashboard for an operations team that shows weekly KPI status (green/yellow/red) for 5 portfolio companies."</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-5 mt-2">
            <p className="text-sm text-white/40 uppercase tracking-wider mb-2 font-semibold">Why it works</p>
            <p className="text-base text-white/60">Specifies <strong className="text-white/80">who</strong>, <strong className="text-white/80">what</strong>, and <strong className="text-white/80">how success is measured</strong>.</p>
          </div>
        </div>
      </div>
    ),
  },

  /* 5 — Getting Started with Lovable */
  {
    title: "Getting Started with Lovable",
    content: (
      <div className="flex gap-12 px-16 pt-6 items-start">
        <div className="flex-1 space-y-8">
          <div className="space-y-5">
            {[
              { step: "1", text: "Log in to lovable.dev" },
              { step: "2", text: "Start a new project in Chat mode" },
              { step: "3", text: "Describe your idea — keep it simple at first" },
              { step: "4", text: "Let the AI build a first version" },
              { step: "5", text: "Iterate: improve step by step" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(174,72%,40%)] to-[hsl(262,80%,55%)] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {s.step}
                </span>
                <span className="text-xl text-white/80">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-xl font-semibold text-white mb-3">💡 Pro Tip</h3>
            <p className="text-lg text-white/60 leading-relaxed">
              Use ChatGPT to draft your initial specs first, then paste them into Lovable with:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-black/30 font-mono text-base text-[hsl(174,72%,55%)]">
              "Ask me any questions you need to fully understand what I want."
            </div>
          </div>
          <div className="rounded-2xl bg-[hsl(174,72%,40%)]/10 border border-[hsl(174,72%,40%)]/30 p-6">
            <p className="text-lg text-white/80 font-medium">Start simple. Improve fast.</p>
            <p className="text-base text-white/50 mt-2">Version 3 is usually much better than version 1.</p>
          </div>
        </div>
      </div>
    ),
  },

  /* 6 — The Iteration Loop */
  {
    title: "The Iteration Loop",
    content: (
      <div className="flex flex-col items-center px-16 pt-8 gap-10">
        <p className="text-xl text-white/60 text-center max-w-2xl">
          Vibe coding is not "one-shot". You'll repeat this loop all day:
        </p>
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {[
            { icon: "📝", label: "Specify", desc: "Clarify what you want" },
            { icon: "⚡", label: "Generate", desc: "AI builds it" },
            { icon: "🔍", label: "Review", desc: "Test it like a user" },
            { icon: "🔄", label: "Iterate", desc: "Refine with better instructions" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-5 p-6 rounded-xl bg-white/5 border border-white/10">
              <span className="text-4xl">{s.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-white">{s.label}</h3>
                <p className="text-base text-white/50">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-lg text-white/40 italic">
          Rule of thumb: Version 3 is usually much better than version 1.
        </p>
      </div>
    ),
  },

  /* 7 — Stuck? No worries */
  {
    title: "Stuck? No Worries!",
    content: (
      <div className="flex flex-col items-center px-16 pt-8 gap-8">
        <p className="text-2xl text-white/70 text-center max-w-2xl">
          Explain the issue again, like you would to a coworker.
        </p>
        <div className="space-y-4 w-full max-w-2xl">
          {[
            "Be specific about what's wrong: \"The button doesn't save the data\"",
            "Give context: \"I expected X but got Y\"",
            "Try a different approach: rephrase or simplify",
            "Or just start fresh — sometimes that's fastest!",
          ].map((tip, i) => (
            <div key={i} className="flex gap-4 items-start p-5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[hsl(174,72%,55%)] text-xl font-bold shrink-0">•</span>
              <p className="text-lg text-white/80">{tip}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-6 rounded-2xl bg-[hsl(262,80%,55%)]/10 border border-[hsl(262,80%,55%)]/30 max-w-xl text-center">
          <p className="text-lg text-white/70">
            Your coaches are here to help — <strong className="text-white">just raise your hand!</strong> 🙋
          </p>
        </div>
      </div>
    ),
  },

  /* 8 — Team Building */
  {
    title: "Team Building Time!",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
        <p className="text-6xl">🤝</p>
        <h2 className="text-5xl font-extrabold text-white font-display">
          Form Your Teams
        </h2>
        <p className="text-2xl text-white/70 max-w-2xl leading-relaxed">
          Teams of 1–4 people. Find others with complementary ideas, or team up on one big vision.
        </p>
        <div className="flex gap-6 mt-4">
          <span className="px-5 py-3 rounded-xl bg-white/15 text-white text-lg">💡 Share your idea</span>
          <span className="px-5 py-3 rounded-xl bg-white/15 text-white text-lg">🎯 Choose your project</span>
          <span className="px-5 py-3 rounded-xl bg-white/15 text-white text-lg">🚀 Start building</span>
        </div>
      </div>
    ),
  },

  /* 9 — Let's Build! */
  {
    title: "",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
        <p className="text-7xl">🚀</p>
        <h2 className="text-6xl font-extrabold text-white font-display">
          Let's Build!
        </h2>
        <p className="text-2xl text-white/70 max-w-2xl leading-relaxed">
          Open <strong className="text-white">lovable.dev</strong> and start creating your app.<br />
          Your coaches are circulating to help.
        </p>
        <div className="mt-4 p-6 rounded-2xl bg-white/15 max-w-lg">
          <p className="text-lg text-white/90 font-medium">
            Remember: Start simple → Iterate → Improve
          </p>
        </div>
      </div>
    ),
  },

  /* 10 — Presentations */
  {
    title: "",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
        <p className="text-7xl">🏆</p>
        <h2 className="text-6xl font-extrabold text-white font-display">
          Presentation Time
        </h2>
        <p className="text-2xl text-white/70 max-w-xl leading-relaxed">
          Show what you built! Each team gets a few minutes to demo their app and share what they learned.
        </p>
      </div>
    ),
  },

  /* 11 — Wrap Up */
  {
    title: "Wrap Up",
    content: (
      <div className="flex gap-12 px-16 pt-6 items-start">
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl font-semibold text-white">What you learned today</h3>
          <ul className="space-y-4 text-xl text-white/70">
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">✓</span> How to think in specs, not code</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">✓</span> How to prompt AI effectively</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">✓</span> How to build a real app from scratch</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">✓</span> The power of rapid iteration</li>
          </ul>
        </div>
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl font-semibold text-white">What's next?</h3>
          <ul className="space-y-4 text-xl text-white/70">
            <li className="flex gap-3"><span className="text-[hsl(262,80%,65%)]">→</span> Keep building on your project</li>
            <li className="flex gap-3"><span className="text-[hsl(262,80%,65%)]">→</span> Connect a database for persistence</li>
            <li className="flex gap-3"><span className="text-[hsl(262,80%,65%)]">→</span> Share your app with colleagues</li>
            <li className="flex gap-3"><span className="text-[hsl(262,80%,65%)]">→</span> Explore advanced features</li>
          </ul>
          <div className="mt-4 p-5 rounded-xl bg-[hsl(174,72%,40%)]/10 border border-[hsl(174,72%,40%)]/30">
            <p className="text-base text-white/60">
              A vibe-coded prototype that validates an idea in 2 hours is worth more than a 6-month IT project that builds the wrong thing.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 12 — Thank You */
  {
    title: "",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
        <h2 className="text-7xl font-extrabold text-white font-display">
          Thank You!
        </h2>
        <p className="text-2xl text-white/70 max-w-xl leading-relaxed">
          Keep experimenting, keep building, keep vibing. 🎉
        </p>
        <p className="text-lg text-white/40 mt-4">vibecodeworkshop.ch</p>
      </div>
    ),
  },
];

/* ─── Slides component ─── */
const SLIDE_W = 1920;
const SLIDE_H = 1080;

const Edition1Slides = () => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      setScale(Math.min(width / SLIDE_W, height / SLIDE_H));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);
  const navigate = useNavigate();
  const total = slides.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && isFullscreen) document.exitFullscreen?.();
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, isFullscreen]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Swipe support
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev]);

  const slide = slides[current];
  const isGradient = slide.bg === "gradient";

  return (
    <div className="h-screen w-screen bg-[#0c0c1d] flex flex-col overflow-hidden select-none">
      {/* Slide area */}
      <div ref={containerRef} className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div
          style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${scale})`, transformOrigin: "center center" }}
          className={`absolute flex flex-col shrink-0 ${
            isGradient
              ? "bg-gradient-to-br from-[hsl(220,30%,10%)] via-[hsl(262,50%,20%)] to-[hsl(174,50%,15%)]"
              : "bg-[#12122a]"
          }`}
        >
          {/* Title bar for non-gradient slides */}
          {!isGradient && slide.title && (
            <div className="px-16 pt-10 pb-2">
              <h2 className="text-4xl font-bold text-white font-display">{slide.title}</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[hsl(174,72%,40%)] to-[hsl(262,80%,55%)] rounded-full mt-3" />
            </div>
          )}
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {slide.content}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-14 bg-[#0a0a1a] border-t border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/40 font-mono">{current + 1} / {total}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {/* Progress dots */}
          <div className="flex gap-1 mx-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-[hsl(174,72%,50%)] w-5" : "bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
          <button onClick={next} disabled={current === total - 1} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.();
          }}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default Edition1Slides;
