import { Button } from "@/components/ui/button";
import { Video, Calendar } from "lucide-react";

const WebinarSection = () => {
  return (
    <section className="py-20 px-4 bg-section-alt">
      <div className="max-w-3xl mx-auto">
        <div className="gradient-bg rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Video className="w-4 h-4" />
              Free Webinar
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Get a 30-Min Intro to Vibe Coding
            </h2>
            <p className="text-white/80 mb-2 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              March 26, 2026 — with Marc Gasser, Valentin Binnendijk and Reto Lämmler
            </p>
            <p className="text-white/70 mb-8 text-sm">
              A free teaser session before the workshop. See what's possible with Lovable.dev.
            </p>
            <Button
              size="lg"
              className="bg-white text-foreground font-semibold hover:bg-white/90 rounded-xl px-8 py-5">
              
              Register for Free
            </Button>
          </div>
        </div>
      </div>
    </section>);

};

export default WebinarSection;