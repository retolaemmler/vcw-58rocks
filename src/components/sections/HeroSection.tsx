import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, MapPin, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 pt-20 pb-16">
      {/* Background blobs */}
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-blue/8 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
          <Users className="w-3.5 h-3.5 mr-1.5" />
          Limited to 25 participants
        </Badge>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Vibe Coding Workshop
          <span className="block gradient-text mt-2">Build a Real App in One Day</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          A full-day hands-on bootcamp where you'll go from idea to working app using Lovable.dev — the platform that turns natural language into functional code. No coding experience required.
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
            Switzerland
          </span>
        </div>

        <Button
          size="lg"
          className="gradient-bg text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Secure Your Spot
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
