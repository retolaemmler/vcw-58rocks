import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AgendaSection from "@/components/sections/AgendaSection";
import IndustriesSection from "@/components/sections/v2/IndustriesSection";
import CompanyLinkedInPosts from "@/components/sections/v2/CompanyLinkedInPosts";
import TrustedByStrip from "@/components/sections/v2/TrustedByStrip";
import RequirementsSection from "@/components/sections/RequirementsSection";
import HostsSection from "@/components/sections/HostsSection";
import FooterSection from "@/components/sections/FooterSection";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, Mail } from "lucide-react";

const WorkshopCompany = () => {
  const { lang = "en" } = useParams();
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden bg-background px-4 pt-28 pb-16">
        <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link to={`/${lang}/v2`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground mb-6">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            Company Workshop
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            A dedicated
            <span className="block mt-2">vibe coding workshop</span>
            <span className="block gradient-text mt-2">for your whole team.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            6 to 20 people. On-site or remote. Tailored to your industry, your tools and the
            problems your team actually wants to solve.
          </p>
          <Button size="lg" asChild className="gradient-bg text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <a href="mailto:hello@vibecodeworkshop.ch?subject=Company%20Workshop%20Inquiry">
              <Mail className="w-5 h-5 mr-2" />
              Request a company workshop
            </a>
          </Button>
          <TrustedByStrip />
        </div>
      </section>
      <AgendaSection />
      <IndustriesSection />
      <CompanyLinkedInPosts />
      <RequirementsSection />
      <HostsSection />
      <FooterSection />
    </main>
  );
};

export default WorkshopCompany;