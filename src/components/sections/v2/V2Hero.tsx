import { Sparkles } from "lucide-react";
import lovableLogo from "@/assets/lovable-logo.png";

const V2Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background px-4 pt-28 pb-12">
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Vibe Code Workshop
          <span className="block gradient-text mt-2">Build a Real Web App in One Day</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-tight">
          A full-day hands-on workshop where you'll go from idea to working web app using{" "}
          <a href="https://www.lovable.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center align-middle">
            <img src={lovableLogo} alt="Lovable.dev" className="h-3 sm:h-4 inline-block" />
          </a>
          {" "}— the platform that turns natural language into functional code. No coding experience required.
        </p>
      </div>
    </section>
  );
};

export default V2Hero;