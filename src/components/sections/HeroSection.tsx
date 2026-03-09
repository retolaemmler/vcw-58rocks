import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, MapPin, Users } from "lucide-react";
import lovableLogo from "@/assets/lovable-logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 pt-20 pb-16">
      {/* Background blobs */}
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-blue/8 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Vibe Code Workshop
          <span className="block gradient-text mt-2">Build an App in One Day</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-tight">
          A full-day hands-on workshop where you'll go from idea to working app using <a href="https://www.lovable.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center align-middle"><img src={lovableLogo} alt="Lovable.dev" className="h-5 sm:h-6 inline-block -my-0.5" /></a> — the platform that turns natural language into functional code. No coding experience required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            Thursday, 16 April 2026
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span>9:00 – 17:00</span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            Zurich, Switzerland (exact location TBA)
          </span>
        </div>

        <div className="items-center gap-6 flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              size="lg"
              className="gradient-bg text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              asChild>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <Sparkles className="w-5 h-5 mr-2" />
                Secure Your Spot
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-semibold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
              asChild>
              <a href="mailto:hello@vibecodeworkshop.ch">
                Get in Touch
              </a>
            </Button>
          </div>

        </div>
      </div>
    </section>);

};

export default HeroSection;