import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AgendaSection from "@/components/sections/AgendaSection";
import AudienceSection from "@/components/sections/AudienceSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import RequirementsSection from "@/components/sections/RequirementsSection";
import HostsSection from "@/components/sections/HostsSection";
import FooterSection from "@/components/sections/FooterSection";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, Calendar, MapPin } from "lucide-react";

const upcomingDates = [
  { date: "TBA", location: "Zürich", status: "Coming soon" },
  { date: "TBA", location: "Zürich", status: "Coming soon" },
];

const WorkshopClassic = () => {
  const { lang = "en" } = useParams();
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden bg-background px-4 pt-28 pb-16">
        <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to={`/${lang}/v2`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground mb-6">
            <Users className="w-3.5 h-3.5 text-primary" />
            Classic Workshop
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Apply for one of
            <span className="block gradient-text mt-2">our upcoming dates.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join a curated group of professionals for one full day of building. Limited spots
            per cohort — we review every application to keep the mix great.
          </p>
          <Button
            size="lg"
            onClick={() => document.getElementById("dates")?.scrollIntoView({ behavior: "smooth" })}
            className="gradient-bg text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Calendar className="w-5 h-5 mr-2" />
            See upcoming dates
          </Button>
        </div>
      </section>

      <section id="dates" className="py-20 px-4 bg-section-alt">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-10">
            Upcoming <span className="gradient-text">dates</span>
          </h2>
          <div className="space-y-4">
            {upcomingDates.map((d, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-lg">{d.date}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {d.location}
                    </div>
                  </div>
                </div>
                <Button variant="outline" disabled>{d.status}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AgendaSection />
      <AudienceSection />
      <TestimonialsSection />
      <RequirementsSection />
      <HostsSection />
      <FooterSection />
    </main>
  );
};

export default WorkshopClassic;