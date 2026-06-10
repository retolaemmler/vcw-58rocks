import { Sparkles } from "lucide-react";

const V2Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background px-4 pt-28 pb-12">
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Vibe Code Workshop
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Build a working app
          <span className="block gradient-text mt-2">in a single day.</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-tight">
          A hands-on workshop where non-developers ship real software using AI.
          Pick the format that fits you below.
        </p>
      </div>
    </section>
  );
};

export default V2Hero;