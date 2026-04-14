import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Home, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";
import vcwLogo from "@/assets/vcw-logo.png";
import iterationLoopImg from "@/assets/iteration-loop.jpg";

/* ─── slide data ─── */
const slides: { title: string; subtitle?: string; content: React.ReactNode; bg?: string }[] = [
  /* 0 — Title */
  {
    title: "",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
        <img src={vcwLogo} alt="Vibe Code Workshop" className="w-40 h-40 rounded-full" />
        <p className="uppercase tracking-[0.3em] text-white/70 text-xl font-medium">Edition 2 · 16 April 2026</p>
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
          { name: "Valentin Binnendijk", role: "Product Expert & Consultant", ambassador: true, image: valentinImg },
          { name: "Reto Lämmler", role: "Entrepreneur & UX Expert", ambassador: true, image: retoImg },
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
          { time: "10:00", label: "Workshop Session #1", desc: "Start working on your app with continuous coaching" },
          { time: "12:00", label: "🍕 Lunch Break", desc: "Refuel and chat with fellow participants" },
          { time: "13:00", label: "Next Level Vibe Coding", desc: "APIs, emails, payments, backend, login, security — adding complexity" },
          { time: "13:30", label: "Workshop Session #2", desc: "Continue building & polish your app" },
          { time: "15:30", label: "Presentations & Feedback", desc: "Present your app to the others and give feedback" },
          { time: "16:00", label: "Future of Vibe Coding & Q&A + 🍺 Beer", desc: "Focus is the key! Agentic engineering, wrap up & celebrate" },
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

  /* 3 — Who's in the Room */
  {
    title: "Who's in the Room",
    content: (
      <div className="flex flex-col items-center px-16 pt-12 gap-8">
        <p className="text-7xl">👥</p>
        <p className="text-2xl text-white/80 text-center max-w-2xl leading-relaxed">
          Quick round of intros — name, industry, the <strong className="text-white">one app</strong> you came to build.
        </p>
        <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 max-w-lg text-center">
          <p className="text-lg text-white/60 italic">
            Ground rule: one sentence per person — we're here to build, not present.
          </p>
        </div>
      </div>
    ),
  },

  /* 4 — What is Vibe Coding? */
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

  /* 5 — Why Management Needs to Vibe Code */
  {
    title: "Why Management Needs to Vibe Code",
    content: (
      <div className="flex flex-col px-16 pt-4 gap-6">
        <p className="text-lg text-white/50 italic">Vibe coding isn't a party trick. It's the new baseline for anyone shaping products.</p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: "📈", title: "The future of product management", desc: "PMs who can vibe code test their own ideas instead of waiting in a dev queue. You ship the right thing faster." },
            { icon: "🤝", title: "Deeper integration with your team", desc: "You speak the same language as engineering, design, and ops. No more \"throw it over the wall.\"" },
            { icon: "🤖", title: "The foundation for agentic engineering", desc: "Today you prompt apps into existence; tomorrow agents build and ship them. The skill that unlocks both: clear specification." },
          ].map((c) => (
            <div key={c.title} className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <p className="text-3xl">{c.icon}</p>
              <h3 className="text-xl font-bold text-white">{c.title}</h3>
              <p className="text-base text-white/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-lg text-white/40 italic text-center mt-2">
          If you can brief a colleague, you can lead an AI. If you can lead an AI, you can lead a team of agents.
        </p>
      </div>
    ),
  },

  /* 6 — Prompt Zero: Start Clean */
  {
    title: "Prompt Zero: Start Clean",
    content: (
      <div className="flex gap-12 px-16 pt-6">
        <div className="flex-1 space-y-6">
          <p className="text-lg text-white/60 italic">Prompt Zero = the very first message you send. It sets the tone for the whole project.</p>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">A good Prompt Zero contains:</h3>
            <ul className="space-y-3 text-lg text-white/70">
              <li>🎯 <strong className="text-white">Who</strong> — it's for (the user)</li>
              <li>🧩 <strong className="text-white">What problem</strong> — it solves (one sentence)</li>
              <li>✅ <strong className="text-white">What "done" looks like</strong> — for v1</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <div className="rounded-2xl bg-[hsl(174,72%,40%)]/10 border border-[hsl(174,72%,40%)]/30 p-6">
            <h3 className="text-xl font-semibold text-white mb-3">💡 Pro tip</h3>
            <p className="text-lg text-white/60 leading-relaxed">
              Let the AI interrogate you before it builds:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-black/30 font-mono text-base text-[hsl(174,72%,55%)]">
              "Before you build anything, ask me any questions you need to fully understand what I want."
            </div>
            <p className="text-base text-white/50 mt-3">You'll catch fuzzy thinking before it becomes fuzzy code.</p>
          </div>
        </div>
      </div>
    ),
  },

  /* 7 — Prompting = Clear Thinking */
  {
    title: "Prompting = Clear Thinking",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <p className="text-lg text-white/60">Prompt engineering is not technical. It's structured thinking made visible.</p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-base text-white/50 mb-1">🔹 Above the waterline (10%)</p>
              <p className="text-lg text-white/80">The code or output you want</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-base text-white/50 mb-1">🔸 Below the waterline (90%)</p>
              <p className="text-lg text-white/80">The context — who it's for, what matters, "done" state, constraints, examples</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[hsl(262,80%,55%)]/10 border border-[hsl(262,80%,55%)]/30">
            <p className="text-base text-white/60 font-semibold mb-2">Role + Action + Vibe</p>
            <p className="text-sm text-white/50"><strong className="text-white/80">Role:</strong> "You are a senior UI designer..."</p>
            <p className="text-sm text-white/50"><strong className="text-white/80">Action:</strong> "Build a pricing table..."</p>
            <p className="text-sm text-white/50"><strong className="text-white/80">Vibe:</strong> "...like a restaurant menu, serif fonts, paper textures."</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-sm text-red-400 uppercase tracking-wider mb-1 font-semibold">❌ Bad</p>
            <p className="text-base text-white/80">"Make a dashboard."</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
            <p className="text-sm text-emerald-400 uppercase tracking-wider mb-1 font-semibold">✅ Good</p>
            <p className="text-base text-white/80">"Create a dashboard for a PE operating team that shows weekly KPI status (green/yellow/red) for 5 portfolio companies."</p>
          </div>
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-sm text-red-400 uppercase tracking-wider mb-1 font-semibold">❌ Bad</p>
            <p className="text-base text-white/80">"Add reporting."</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
            <p className="text-sm text-emerald-400 uppercase tracking-wider mb-1 font-semibold">✅ Good</p>
            <p className="text-base text-white/80">"Add a simple reporting view that summarizes progress by project and highlights overdue milestones."</p>
          </div>
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-sm text-red-400 uppercase tracking-wider mb-1 font-semibold">❌ Bad</p>
            <p className="text-base text-white/80">"It's not quite right, improve it."</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
            <p className="text-sm text-emerald-400 uppercase tracking-wider mb-1 font-semibold">✅ Good</p>
            <p className="text-base text-white/80">"The overview screen feels cluttered. Simplify it so a user understands the status in under 10 seconds."</p>
          </div>
        </div>
      </div>
    ),
  },

  /* 8 — The First Plan */
  {
    title: "The First Plan",
    content: (
      <div className="flex gap-12 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <p className="text-lg text-white/60 italic">Before you write code, write the plan — a short spec, just enough to keep the AI on rails.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🎯", label: "Core user flow", desc: "3–5 steps a user takes" },
              { icon: "🗄️", label: "Data / resources", desc: "Entities & key properties" },
              { icon: "🚫", label: "Out of scope", desc: "The 80% you're NOT building" },
              { icon: "❓", label: "The \"whys\"", desc: "Why this, why now, why this user" },
            ].map((p) => (
              <div key={p.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl mb-2">{p.icon}</p>
                <h4 className="text-lg font-bold text-white">{p.label}</h4>
                <p className="text-sm text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-base text-white/80"><strong className="text-[hsl(174,72%,55%)]">1</strong> <strong>Agents can build anything — but they don't know what.</strong></p>
            <p className="text-sm text-white/50 mt-2">The plan is the guardrail. Without it, Lovable drifts toward whatever is most common in its training data.</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-base text-white/80"><strong className="text-[hsl(174,72%,55%)]">2</strong> <strong>Planning is how you install context.</strong></p>
            <p className="text-sm text-white/50 mt-2">Everything you know — the whys, constraints, non-goals — has to live in the project before a single line of code appears.</p>
          </div>
          <div className="p-5 rounded-xl bg-[hsl(174,72%,40%)]/10 border border-[hsl(174,72%,40%)]/30">
            <p className="text-base text-white/70">💡 Use <strong className="text-white">Lovable's built-in planning feature</strong> — iterate on the plan until it reads right, then let it build.</p>
          </div>
          <p className="text-base text-white/40 italic">If the plan is wrong, the code will be wrong. Fix it here — it's cheap.</p>
        </div>
      </div>
    ),
  },

  /* 9 — Prompt the UI First */
  {
    title: "Prompt the UI First",
    content: (
      <div className="flex gap-12 px-16 pt-6">
        <div className="flex-1 space-y-6">
          <p className="text-lg text-white/60 italic">Counter-intuitive but it works: design before data.</p>
          <div className="space-y-4">
            {[
              { step: "1", text: "Prompt the screens", desc: "What the user sees and clicks" },
              { step: "2", text: "Use placeholder data", desc: "Mock values, static lists" },
              { step: "3", text: "Wire up real logic last", desc: "Only after the UI feels right" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(174,72%,40%)] to-[hsl(262,80%,55%)] flex items-center justify-center text-white font-bold text-lg shrink-0">{s.step}</span>
                <div>
                  <p className="text-lg font-semibold text-white">{s.text}</p>
                  <p className="text-sm text-white/50">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-6">
            <h3 className="text-xl font-semibold text-white mb-3">⚠️ Watch the AI's tendency to fill in the gaps</h3>
            <p className="text-base text-white/60 leading-relaxed">
              Left alone, Lovable will make your app feature-rich — every button imaginable, every edge case covered. That's the opposite of what you want.
            </p>
          </div>
          <ul className="space-y-3 text-lg text-white/70">
            <li>🎯 Point hard at the <strong className="text-white">one core hook</strong></li>
            <li>🔽 Everything else is <strong className="text-white">secondary or non-existent</strong></li>
            <li>🧭 Say it: <em>"Don't add feature X, Y, or Z"</em></li>
          </ul>
          <p className="text-base text-white/40 italic mt-4">A good app has a clear purpose. A bad app has all the functionality.</p>
        </div>
      </div>
    ),
  },

  /* 10 — Integrations Last */
  {
    title: "Integrations Last",
    content: (
      <div className="flex flex-col items-center px-16 pt-8 gap-8">
        <p className="text-xl text-white/60 italic text-center">Everything external is a risk: APIs, auth, payments, databases.</p>
        <div className="space-y-5 w-full max-w-2xl">
          <div className="flex gap-4 items-start p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-2xl">✅</span>
            <div><h3 className="text-xl font-bold text-white">First</h3><p className="text-base text-white/60">Core flow works end-to-end with fake data</p></div>
          </div>
          <div className="flex gap-4 items-start p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="text-2xl">⚡</span>
            <div><h3 className="text-xl font-bold text-white">Then</h3><p className="text-base text-white/60">One integration at a time</p></div>
          </div>
          <div className="flex gap-4 items-start p-5 rounded-xl bg-red-500/10 border border-red-500/30">
            <span className="text-2xl">🚫</span>
            <div><h3 className="text-xl font-bold text-white">Never</h3><p className="text-base text-white/60">Stack 3 integrations before the first one is proven</p></div>
          </div>
        </div>
        <p className="text-lg text-white/40 italic">Rule of thumb: if adding an integration breaks the demo, back it out.</p>
      </div>
    ),
  },

  /* 11 — Focus Is the Whole Game */
  {
    title: "Focus Is the Whole Game",
    content: (
      <div className="flex flex-col items-center px-16 pt-10 gap-8">
        <p className="text-7xl">🎯</p>
        <p className="text-xl text-white/60 italic text-center max-w-2xl">
          The single biggest predictor of a successful vibe-coded app in one day: <strong className="text-white">what you cut.</strong>
        </p>
        <div className="space-y-4 w-full max-w-xl">
          <p className="text-xl text-white/80 text-center">Ask yourself every 30 minutes:</p>
          {[
            "Is this the feature, or just a feature?",
            "If I stopped here, would it still be useful?",
            "What would I demo at 15:30?",
          ].map((q, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-lg text-white/80 italic">{q}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* 12 — Keep It Simple (KISS) */
  {
    title: "Keep It Simple (KISS)",
    content: (
      <div className="flex flex-col items-center px-16 pt-6 gap-6">
        <p className="text-lg text-white/60 italic">When in doubt, strip it down.</p>
        <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
          {[
            { title: "One change per prompt", desc: "Don't stack five asks into one message" },
            { title: "Shortest possible flow", desc: "Every click, field, and page is a liability" },
            { title: "Boring tech beats clever", desc: "Pick the obvious path" },
            { title: "One-sentence test", desc: "If you can't explain it in one sentence, it's too complex" },
          ].map((c) => (
            <div key={c.title} className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
              <p className="text-base text-white/50">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-lg text-white/40 italic mt-4">Your future self — debugging this at 3pm — will thank you.</p>
      </div>
    ),
  },

  /* 13 — The Iteration Loop */
  {
    title: "The Iteration Loop",
    content: (
      <div className="flex flex-col items-center px-16 pt-6 gap-6">
        <p className="text-lg text-white/60 italic text-center max-w-2xl">
          Iteration isn't a fix-it phase — it's how knowledge enters the project.
        </p>
        <img src={iterationLoopImg} alt="The Iteration Loop: Specify, Generate, Review, Iterate" className="w-full max-w-3xl rounded-xl" />
        <p className="text-base text-white/60 text-center max-w-2xl">
          Each pass teaches the project something new. You're not just fixing bugs — you're <strong className="text-white/80">building context, loop after loop.</strong>
        </p>
        <p className="text-base text-white/40 italic">
          Rule of thumb: if you hit the same issue twice, fix it in the plan — not just the code.
        </p>
      </div>
    ),
  },

  /* 14 — Stuck? No Worries! */
  {
    title: "Stuck? No Worries!",
    content: (
      <div className="flex flex-col items-center px-16 pt-8 gap-8">
        <p className="text-2xl text-white/70 text-center max-w-2xl">
          Explain the issue again, like you would to a coworker.
        </p>
        <div className="space-y-4 w-full max-w-2xl">
          {[
            "Be specific: \"The button doesn't save the data\"",
            "Give context: \"I expected X but got Y\"",
            "Try a different approach — rephrase or simplify",
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

  /* 15 — Let's Get Started 🚀 */
  {
    title: "",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-8 px-12">
        <p className="text-7xl">🚀</p>
        <h2 className="text-6xl font-extrabold text-white font-display">
          Let's Get Started
        </h2>
        <p className="text-2xl text-white/70 max-w-xl">Build your first Lovable product.</p>
        <div className="space-y-4 text-left max-w-lg">
          {[
            "Log in to lovable.dev",
            "Start a new project in Chat mode",
            "Describe your idea — keep it simple at first",
            "Let the AI build a first version",
            "Iterate: improve step by step",
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-lg shrink-0">{i + 1}</span>
              <span className="text-xl text-white/80">{s}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-2xl bg-white/15 max-w-md">
          <p className="text-lg text-white/90">Remember: Start simple → Iterate → Improve</p>
        </div>
      </div>
    ),
  },

  /* ─── PART 2: NEXT-LEVEL VIBE CODING ─── */

  /* 16 — From MVP to Production */
  {
    title: "From MVP to Production",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <p className="text-lg text-white/60 italic">Vibe coding gets you to a working prototype. Production-ready is a different animal.</p>
          <div className="space-y-4">
            {[
              { icon: "🏢", text: "Integrate into an IT landscape", desc: "Existing tools, identity, data" },
              { icon: "🛠️", text: "Be maintained", desc: "Someone owns it next week, next quarter, next year" },
              { icon: "🧠", text: "Reflect real domain knowledge", desc: "The stuff that isn't on the internet" },
            ].map((c) => (
              <div key={c.text} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{c.text}</h3>
                  <p className="text-sm text-white/50">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-sm text-emerald-400 uppercase tracking-wider mb-2 font-semibold">✅ What the AI can help with</p>
            <p className="text-base text-white/70">Integrations, auth, database, emails, payments · Security hardening · Refactoring</p>
          </div>
          <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400 uppercase tracking-wider mb-2 font-semibold">🚫 What the AI cannot do for you</p>
            <ul className="text-base text-white/70 space-y-1">
              <li>• Product management — what to build, what to cut</li>
              <li>• Understanding your users better than you</li>
              <li>• Owning the roadmap when priorities change</li>
            </ul>
          </div>
          <p className="text-base text-white/40 italic">Vibe coding scales your building. It doesn't replace your judgement.</p>
        </div>
      </div>
    ),
  },

  /* 17 — When to Level Up */
  {
    title: "When to Level Up",
    content: (
      <div className="flex flex-col items-center px-16 pt-6 gap-6">
        <p className="text-lg text-white/60 italic">This section is only worth it if your MVP has earned it.</p>
        <div className="space-y-4 w-full max-w-2xl">
          <h3 className="text-xl font-semibold text-white">Signals you're ready:</h3>
          {[
            "Your MVP is usable and brings clear value",
            "You want to share it with other users or teams",
            "It will live in an environment that isn't fully private",
            "You need persistence — data that survives a refresh",
            "Others need to onboard onto it",
            "You want to integrate APIs to bring in real data",
          ].map((s, i) => (
            <div key={i} className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[hsl(174,72%,55%)]">✅</span>
              <p className="text-lg text-white/80">{s}</p>
            </div>
          ))}
        </div>
        <p className="text-base text-white/40 italic mt-2">If you're still fixing the main user flow — go back. Finish v1 first.</p>
      </div>
    ),
  },

  /* 18 — Complexity Is a Choice */
  {
    title: "Complexity Is a Choice",
    content: (
      <div className="flex gap-12 px-16 pt-6">
        <div className="flex-1 space-y-6">
          <p className="text-lg text-white/60 italic">AI has an inherent tendency to make things feature-rich, complete, and exhaustive. Simplicity is a choice — and a hard one.</p>
          <h3 className="text-xl font-semibold text-white">The hidden cost of every extra feature:</h3>
          <div className="space-y-3">
            {[
              { icon: "🧭", text: "Onboarding gets harder", desc: "Every new button needs explanation" },
              { icon: "📖", text: "Training needs grow", desc: "More questions, more docs, more support" },
              { icon: "🐛", text: "Maintenance doubles", desc: "More surface area, more edge cases" },
              { icon: "💡", text: "The real value gets buried", desc: "A 20-feature app tells nobody why it exists" },
            ].map((c) => (
              <div key={c.text} className="flex gap-3 items-start">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-base text-white/80 font-semibold">{c.text}</p>
                  <p className="text-sm text-white/50">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-white">Before adding X, ask:</h3>
          {[
            "Does the core demo still work without it?",
            "Can I explain it to a stranger in 10 seconds?",
            "Will I still understand this next week?",
          ].map((q, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-lg text-white/70 italic">{q}</p>
            </div>
          ))}
          <p className="text-base text-white/40 italic text-center mt-2">
            Information architecture can hide complexity — but it never removes it. Delete first, design second.
          </p>
        </div>
      </div>
    ),
  },

  /* 19 — Lovable Cloud: What It Gives You */
  {
    title: "Lovable Cloud: What It Gives You",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-4">
          <p className="text-base text-white/50">The boring-but-essential stuff, bundled:</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "🗄️", label: "Database", desc: "Persistent storage (Postgres)" },
              { icon: "🔐", label: "Authentication", desc: "Login, magic links, OAuth" },
              { icon: "⚡", label: "Edge Functions", desc: "Server-side logic & API calls" },
              { icon: "📦", label: "Storage", desc: "File uploads" },
              { icon: "🔒", label: "Row-Level Security", desc: "Per-user data isolation" },
            ].map((f) => (
              <div key={f.label} className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <span className="text-base font-semibold text-white">{f.label}</span>
                  <span className="text-sm text-white/50 ml-2">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-white">🧠 Make your app intelligent</h3>
          <p className="text-base text-white/60">LLMs in the backend — not just the chat:</p>
          <div className="space-y-3">
            {[
              { icon: "🔎", label: "Smart search", desc: "Users ask questions in plain language" },
              { icon: "📝", label: "Auto-summarisation", desc: "Digest long inputs" },
              { icon: "✍️", label: "Content generation", desc: "Drafts, replies, explanations" },
              { icon: "🏷️", label: "Structured extraction", desc: "Messy input → clean fields" },
              { icon: "🤖", label: "Background agents", desc: "Scheduled reasoning & tasks" },
            ].map((f) => (
              <div key={f.label} className="flex gap-3 items-center p-3 rounded-lg bg-[hsl(262,80%,55%)]/10 border border-[hsl(262,80%,55%)]/20">
                <span className="text-lg">{f.icon}</span>
                <div>
                  <span className="text-sm font-semibold text-white">{f.label}</span>
                  <span className="text-xs text-white/50 ml-2">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/40 italic">Not AI bolted on top — intelligence as part of the workflow.</p>
        </div>
      </div>
    ),
  },

  /* 20 — Integrating APIs */
  {
    title: "Integrating APIs",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <h3 className="text-xl font-semibold text-white">The basic pattern:</h3>
          <div className="space-y-3">
            {[
              "Pick one API you actually need",
              "Figure out its shape — REST? OAuth? API key? Rate limits?",
              "Test with one real call before building UI around it",
              "Handle the failure case (no internet, wrong key, empty response)",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="w-8 h-8 rounded-full bg-[hsl(174,72%,40%)] flex items-center justify-center text-white font-bold text-sm shrink-0">{i + 1}</span>
                <p className="text-base text-white/80">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-white">Where vibe-coded apps get hurt:</h3>
          <div className="space-y-3">
            {[
              { icon: "📈", text: "Inefficiency at scale — loops across 10,000 items blow up cost" },
              { icon: "💸", text: "Runaway cost — no caching, retry-forever on errors" },
              { icon: "🕳️", text: "No fallbacks — when the API is down, your app dies" },
            ].map((c) => (
              <div key={c.text} className="flex gap-3 items-start p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-lg">{c.icon}</span>
                <p className="text-sm text-white/70">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/50">
              Ask the AI: <em className="text-white/70">"Review how we call [API]. Where will we fail or blow up cost at 10× scale?"</em>
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 21 — Sending Emails */
  {
    title: "Sending Emails",
    subtitle: "Deliverability Is the Whole Game",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <p className="text-base text-white/60">Sending one email to your own inbox is trivial. Sending email that actually arrives is its own discipline.</p>
          <h3 className="text-xl font-semibold text-white">📧 Transactional email the real way:</h3>
          <div className="space-y-3">
            {[
              { label: "Use a pro provider", desc: "Resend / Postmark / SendGrid — not Gmail" },
              { label: "Configure DNS", desc: "SPF · DKIM · DMARC — or you land in spam" },
              { label: "Real sender domain", desc: "Not noreply@vibeapp.lovable.dev" },
              { label: "Warm up the domain", desc: "If volume is serious" },
            ].map((c) => (
              <div key={c.label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-base font-semibold text-white">{c.label}</p>
                <p className="text-sm text-white/50">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <h3 className="text-xl font-semibold text-white">🚫 Don't look like phishing:</h3>
          <ul className="space-y-2 text-base text-white/70">
            <li>• No misleading "from" addresses</li>
            <li>• No dangling "reply-to"</li>
            <li>• Clean HTML, properly signed</li>
            <li>• Don't spoof trusted brands</li>
          </ul>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mt-4">
            <p className="text-base text-white/70">
              ⚠️ If emails don't arrive, users assume your app is broken — even if every other part works.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 22 — Payments with Stripe */
  {
    title: "Payments with Stripe",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <p className="text-base text-white/60">Collecting money or running subscriptions? You need a real payment processor. Stripe is the default.</p>
          <h3 className="text-xl font-semibold text-white">Minimal setup:</h3>
          <div className="space-y-3">
            {[
              { step: "1", label: "Stripe test keys first", desc: "Never commit real ones!" },
              { step: "2", label: "Stripe Checkout", desc: "Hosted page, zero compliance burden" },
              { step: "3", label: "Webhook", desc: "Confirm payment before you unlock anything" },
            ].map((c) => (
              <div key={c.step} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="w-8 h-8 rounded-full bg-[hsl(262,80%,55%)] flex items-center justify-center text-white font-bold text-sm shrink-0">{c.step}</span>
                <div>
                  <p className="text-base font-semibold text-white">{c.label}</p>
                  <p className="text-sm text-white/50">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <h3 className="text-xl font-semibold text-white">Be pragmatic about what to offer:</h3>
          <ul className="space-y-3 text-base text-white/70">
            <li>• Low-volume? → cards only, one region</li>
            <li>• Subscriptions? → plan tiers + customer portal</li>
            <li>• Different geography? → SEPA, iDEAL, TWINT, Apple Pay…</li>
          </ul>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-base text-white/60 italic">Start with a single one-time product. Subscriptions add state — do them last.</p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-base text-white/70">⚠️ Never paste production API keys into a prompt.</p>
          </div>
        </div>
      </div>
    ),
  },

  /* 23 — Backend, Database & Auth */
  {
    title: "Backend, Database & Auth",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <p className="text-base text-white/60 italic">With Lovable Cloud, adding a real backend is a few prompts away — but three things have to be right.</p>
          <div className="space-y-4">
            {[
              { icon: "🧱", label: "Tables", desc: "Decide your 2–3 core entities first. Don't model everything upfront." },
              { icon: "🔐", label: "Data isolation", desc: "User A must not see user B's data. We'll cover how on the next slide." },
              { icon: "🔑", label: "Auth", desc: "Magic links easiest; Google/GitHub OAuth feels premium. Both in Lovable Cloud." },
            ].map((c) => (
              <div key={c.label} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{c.label}</h3>
                  <p className="text-sm text-white/50">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <h3 className="text-lg font-semibold text-white mb-2">⚠️ When Lovable Cloud isn't enough:</h3>
            <ul className="text-base text-white/70 space-y-1">
              <li>• Heavy analytics / data-warehouse queries</li>
              <li>• Millions of rows with aggressive performance requirements</li>
              <li>• Integration with a specific enterprise stack</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-[hsl(174,72%,40%)]/10 border border-[hsl(174,72%,40%)]/30">
            <p className="text-sm text-white/50 font-mono">
              "Add a Lovable Cloud backend. Store [entity] with these fields: [...]. Every user only sees their own records."
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 24 — Security: Before You Share It */
  {
    title: "Security: Before You Share It",
    content: (
      <div className="flex flex-col px-16 pt-3 gap-4">
        <p className="text-base text-white/60 italic">
          A 2026 audit found 63% of Lovable apps had critical/high-severity issues. Over half had databases anyone could read.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: "1", title: "Who can read the data?", desc: "Row-Level Security is your bouncer. It must ask \"are you the owner?\" — not just \"are you logged in?\" 80% of AI apps get this wrong." },
            { num: "2", title: "Where are your secrets?", desc: "API keys, passwords, tokens — never paste in chat or hardcode. Lovable has a Secrets feature. If you pasted a key, rotate it." },
            { num: "3", title: "Is the front door locked?", desc: "Attackers call your API directly, bypassing the UI. Every endpoint must check: is this user allowed?" },
            { num: "4", title: "Can someone run up your bill?", desc: "Without rate limits, one attacker can hit your AI endpoint 10,000 times overnight." },
          ].map((c) => (
            <div key={c.num} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">{c.num}</span>
                <h3 className="text-base font-bold text-white">{c.title}</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-[hsl(174,72%,40%)]/10 border border-[hsl(174,72%,40%)]/30">
          <p className="text-sm text-white/60">
            🛡️ <strong className="text-white/80">Use what Lovable gives you:</strong> built-in security scan checks RLS & database config. Run before every public release.
          </p>
        </div>
      </div>
    ),
  },

  /* 25 — Presentation Time 🏆 */
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

  /* ─── PART 3: FUTURE OF VIBE CODING ─── */

  /* 26 — The Future of Vibe Coding */
  {
    title: "The Future of Vibe Coding",
    content: (
      <div className="flex flex-col items-center px-16 pt-6 gap-6">
        <p className="text-lg text-white/50 italic">The shift that matters.</p>
        <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { icon: "🧭", title: "A management skill", desc: "Being able to talk credibly to engineers, designers, and ops." },
            { icon: "🎨", title: "Custom UIs everywhere", desc: "More software will be vibe-coded — tailored to teams, roles, workflows." },
            { icon: "🌐", title: "New way of thinking", desc: "In systems, in connections, in turning uncorrelated data into synthesis." },
          ].map((c) => (
            <div key={c.title} className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <p className="text-3xl">{c.icon}</p>
              <h3 className="text-xl font-bold text-white">{c.title}</h3>
              <p className="text-base text-white/60">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-lg text-white/40 italic text-center mt-4">
          The real upgrade isn't that you build faster. It's that you think differently.
        </p>
      </div>
    ),
  },

  /* 27 — Focus Is Still the Key */
  {
    title: "Focus Is Still the Key",
    content: (
      <div className="flex flex-col items-center px-16 pt-6 gap-6">
        <p className="text-lg text-white/50 italic text-center">More apps, more noise, more competition. The question stays the same.</p>
        <div className="space-y-4 w-full max-w-2xl">
          {[
            "What's the one hook? What adds value — what's just noise?",
            "Every vibe-coded app needs a purpose — a user, a surface, a reason to exist",
            "The surface can be anything: web, mobile, voice, CLI, even an MCP only agents talk to",
            "As tools multiply, the differentiator isn't code — it's a clear use case",
          ].map((s, i) => (
            <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[hsl(174,72%,55%)] shrink-0">•</span>
              <p className="text-lg text-white/80">{s}</p>
            </div>
          ))}
        </div>
        <p className="text-base text-white/40 italic text-center mt-2">
          The goal isn't to build 1,000 pilots. The goal is to connect things and add value.
        </p>
      </div>
    ),
  },

  /* 28 — From Vibe Coding to Agentic Engineering */
  {
    title: "From Vibe Coding to Agentic Engineering",
    content: (
      <div className="flex gap-12 px-16 pt-6">
        <div className="flex-1 space-y-6">
          <p className="text-lg text-white/60 italic">Software development stops being about writing code and becomes developing systems and solutions.</p>
          <div className="space-y-4">
            {[
              { icon: "👷", text: "Developers → orchestrators of agents, APIs, and models" },
              { icon: "📊", text: "The org chart compresses — fewer people, more leverage per person" },
              { icon: "🧩", text: "Vibe-coded apps are one input into larger agentic systems" },
              { icon: "🔌", text: "Everything else gets wired through REST, MCP, event streams" },
            ].map((c) => (
              <div key={c.text} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xl">{c.icon}</span>
                <p className="text-base text-white/80">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[hsl(262,80%,55%)]/20 to-[hsl(174,72%,40%)]/20 border border-white/10 text-center">
            <p className="text-2xl text-white/80 leading-relaxed">
              You're not building "the app".<br />
              <strong className="text-white">You're wiring a system</strong><br />
              in which your app is one node.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 29 — Agents & Agentic AI */
  {
    title: "Agents & Agentic AI",
    content: (
      <div className="flex gap-12 px-16 pt-6">
        <div className="flex-1 space-y-6">
          <p className="text-lg text-white/50 italic">The interface changes hands.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-2">Today</p>
              <p className="text-lg text-white/80">A user clicks buttons in an app.</p>
            </div>
            <div className="p-5 rounded-xl bg-[hsl(262,80%,55%)]/10 border border-[hsl(262,80%,55%)]/30 text-center">
              <p className="text-sm text-[hsl(262,80%,65%)] uppercase tracking-wider mb-2">Tomorrow</p>
              <p className="text-lg text-white/80">An agent does the clicking — for you, for your customer.</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-white">What that means for you:</h3>
          <ul className="space-y-4 text-base text-white/70">
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">→</span> Agents take on tasks in your niche, your domain</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">→</span> They make things efficient — freeing you for important work & relationships</li>
            <li className="flex gap-3"><span className="text-[hsl(174,72%,55%)]">→</span> Your app becomes a surface agents use — MCPs, tool-calling APIs, structured outputs</li>
          </ul>
          <p className="text-base text-white/40 italic mt-4">
            The question shifts from "what can my app do?" to "what can agents do <strong>with</strong> my app?"
          </p>
        </div>
      </div>
    ),
  },

  /* 30 — What to Learn Next */
  {
    title: "What to Learn Next",
    content: (
      <div className="flex gap-10 px-16 pt-4">
        <div className="flex-1 space-y-5">
          <p className="text-base text-white/50 italic">Your use case picks your tool — don't pick the tool first.</p>
          <h3 className="text-xl font-semibold text-white">🛠️ Code-forward tools</h3>
          <p className="text-sm text-white/40">More control, more power</p>
          <div className="space-y-3">
            {[
              { name: "Claude Code", desc: "The CLI for building more seriously" },
              { name: "Cursor", desc: "AI-native IDE for developers" },
              { name: "Antigravity", desc: "Google's free coding agent — worth a play" },
            ].map((t) => (
              <div key={t.name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-base font-semibold text-white">{t.name}</p>
                <p className="text-sm text-white/50">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <h3 className="text-xl font-semibold text-white mt-8">🎨 Other vibe-coding tools</h3>
          <p className="text-sm text-white/40">Pick by use case</p>
          <div className="space-y-3">
            {[
              { name: "Replit", desc: "Fast web prototypes, strong for learning" },
              { name: "Bolt", desc: "Another fast web builder" },
              { name: "Mobile-focused tools", desc: "If your app is mobile-first" },
              { name: "B2C-focused tools", desc: "When onboarding and ease are everything" },
            ].map((t) => (
              <div key={t.name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-base font-semibold text-white">{t.name}</p>
                <p className="text-sm text-white/50">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  /* 31 — Predicting the Future */
  {
    title: "Predicting the Future (is hard)",
    content: (
      <div className="flex flex-col items-center px-16 pt-6 gap-6">
        <blockquote className="text-2xl italic text-white/70 text-center max-w-2xl">
          "It's tough to make predictions, especially about the future."
          <span className="block text-base text-white/40 mt-2">— often attributed to Yogi Berra</span>
        </blockquote>
        <p className="text-lg text-white/50">But we can say this much:</p>
        <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
          {[
            { title: "Apps become more agentic", desc: "Less clicking, more talking" },
            { title: "Customers will expect smart tools", desc: "Think with them, answer them, solve problems without manuals" },
            { title: "\"We can't adapt\" becomes unacceptable", desc: "Standardised, one-size-fits-all loses" },
            { title: "Dynamic & context-aware wins", desc: "Beats static every time" },
          ].map((c) => (
            <div key={c.title} className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-1">{c.title}</h3>
              <p className="text-sm text-white/50">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-base text-white/40 italic mt-2">If your product isn't thinking with the user, something else will.</p>
      </div>
    ),
  },

  /* 32 — Wrap Up & Thank You */
  {
    title: "",
    bg: "gradient",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-12">
        <h2 className="text-5xl font-extrabold text-white font-display">Wrap Up & Thank You 🎉</h2>
        <div className="flex gap-10 mt-4">
          <div className="text-left space-y-3">
            <h3 className="text-xl font-semibold text-white">What you built today:</h3>
            <ul className="space-y-2 text-lg text-white/70">
              <li>✅ A real app — from plain English to working product</li>
              <li>✅ How to prompt, plan, and iterate</li>
              <li>✅ How to build from scratch — and what it takes to ship</li>
            </ul>
          </div>
          <div className="text-left space-y-3">
            <h3 className="text-xl font-semibold text-white">What stays with you:</h3>
            <ul className="space-y-2 text-lg text-white/70">
              <li>🎯 Focus — cut to the one thing that matters</li>
              <li>🧭 Accountability — you own the vision; the AI doesn't</li>
              <li>🔁 Rapid iteration — version 3 {">"} version 1</li>
            </ul>
          </div>
        </div>
        <p className="text-lg text-white/50 italic mt-4 max-w-2xl">
          A vibe-coded prototype that validates an idea in 2 hours beats a 6-month IT project that builds the wrong thing.
        </p>
        <p className="text-2xl text-white/80 font-medium mt-2">Keep experimenting, keep building, keep vibing.</p>
        <p className="text-base text-white/40 mt-4">vibecodeworkshop.ch · Now — Q&A + 🍺</p>
      </div>
    ),
  },
];

/* ─── Slides component ─── */
const SLIDE_W = 1920;
const SLIDE_H = 1080;

const Edition2Slides = () => {
  const [current, setCurrent] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
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

  const exportPDF = useCallback(async () => {
    setIsExporting(true);
    const savedCurrent = current;
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [SLIDE_W, SLIDE_H] });
      for (let i = 0; i < slides.length; i++) {
        setCurrent(i);
        await new Promise((r) => setTimeout(r, 200));
        const liveSlide = document.querySelector("[data-slide-content]") as HTMLElement;
        if (!liveSlide) continue;
        const originalTransform = liveSlide.style.transform;
        const originalPosition = liveSlide.style.position;
        liveSlide.style.transform = "none";
        liveSlide.style.position = "relative";
        const canvas = await html2canvas(liveSlide, {
          width: SLIDE_W, height: SLIDE_H, scale: 2, useCORS: true, backgroundColor: null,
          windowWidth: SLIDE_W, windowHeight: SLIDE_H,
        });
        liveSlide.style.transform = originalTransform;
        liveSlide.style.position = originalPosition;
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, SLIDE_W, SLIDE_H);
      }
      setCurrent(savedCurrent);
      pdf.save("VCW-Edition2-Slides.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      setCurrent(savedCurrent);
    } finally {
      setIsExporting(false);
    }
  }, [current]);

  const slide = slides[current];
  const isGradient = slide.bg === "gradient";

  return (
    <div className="h-screen w-screen bg-[#0c0c1d] flex flex-col overflow-hidden select-none">
      <div ref={containerRef} className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div
          data-slide-content
          style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${scale})`, transformOrigin: "center center" }}
          className={`absolute flex flex-col shrink-0 ${
            isGradient
              ? "bg-gradient-to-br from-[hsl(220,30%,10%)] via-[hsl(262,50%,20%)] to-[hsl(174,50%,15%)]"
              : "bg-[#12122a]"
          }`}
        >
          {!isGradient && slide.title && (
            <div className="px-16 pt-10 pb-2">
              <h2 className="text-4xl font-bold text-white font-display">{slide.title}</h2>
              {slide.subtitle && <p className="text-lg text-white/50 mt-1">{slide.subtitle}</p>}
              <div className="w-20 h-1 bg-gradient-to-r from-[hsl(174,72%,40%)] to-[hsl(262,80%,55%)] rounded-full mt-3" />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            {slide.content}
          </div>
        </div>
      </div>

      <div className="h-10 bg-[#0a0a1a]/80 border-t border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/40 font-mono">{current + 1} / {total}</span>
          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-50"
            title="Download as PDF"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </button>
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

export default Edition2Slides;
