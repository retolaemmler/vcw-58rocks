import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users, ArrowRight, Check, Sparkles } from "lucide-react";

const TwoWaysSection = () => {
  const navigate = useNavigate();
  const { lang = "en" } = useParams();

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Two ways to vibe code —{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              which one's yours?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pick the path that fits how you want to learn and ship.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-stretch">
          {/* LEFT — Dedicated Team Workshop (dark, premium) */}
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-40 blur-lg group-hover:opacity-90 group-hover:blur-xl transition-all duration-500 animate-pulse" />
            <button
              onClick={() => navigate(`/${lang}/v2/company`)}
              className="relative h-full w-full text-left rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(250 50% 18%) 60%, hsl(280 60% 22%) 100%)",
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/40 transition-all duration-500" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white/80 text-xs font-medium uppercase tracking-wider border border-white/10">
                  <Building2 className="w-3.5 h-3.5" />
                  For your team
                </div>
                <h3 className="font-display text-3xl font-bold mb-3 text-white">
                  Dedicated Team Workshop
                </h3>
                <p className="text-white/70 mb-6">
                  A private company workshop for your team (6–20 people) — every team member builds their own app.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Tailored to your industry & use cases",
                    "On-site or remote, on your dates",
                    "Each team member ships a real app",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-white/90">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold rounded-xl shadow-lg group-hover:gap-3 transition-all">
                  Request a custom quote
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </button>
          </div>

          {/* OR divider */}
          <div className="flex md:flex-col items-center justify-center gap-3 py-2 md:py-0">
            <div className="hidden md:block w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="md:hidden h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="font-display text-2xl md:text-3xl font-black text-muted-foreground/60 italic px-2">
              or
            </div>
            <div className="hidden md:block w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="md:hidden h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* RIGHT — Masterclass (light, teal accent) */}
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary via-teal-400 to-cyan-400 opacity-30 blur-lg group-hover:opacity-80 group-hover:blur-xl transition-all duration-500" />
            <button
              onClick={() => navigate(`/${lang}/v2/classic`)}
              className="relative h-full w-full text-left bg-card rounded-2xl p-8 md:p-10 border-2 border-primary/30 shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-5 gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5" />
                    Individuals
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-teal-500 text-white text-xs font-bold shadow-md">
                    <Sparkles className="w-3 h-3" />
                    Next date: June 30
                  </div>
                </div>
                <h3 className="font-display text-3xl font-bold mb-3">
                  Vibe Code Masterclass
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join as an individual one of our upcoming workshops.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Mixed group (max 12p, 2 coaches)",
                    "Fixed public dates, apply for a spot",
                    "Perfect for individuals & small teams",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl shadow-lg group-hover:gap-3 transition-all">
                  Get your ticket
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoWaysSection;