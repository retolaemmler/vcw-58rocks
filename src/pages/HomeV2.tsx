import Navbar from "@/components/Navbar";
import V2Hero from "@/components/sections/v2/V2Hero";
import WorkshopChoice from "@/components/sections/v2/WorkshopChoice";
import IndustriesSection from "@/components/sections/v2/IndustriesSection";
import AgendaSection from "@/components/sections/AgendaSection";
import AudienceSection from "@/components/sections/AudienceSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import RequirementsSection from "@/components/sections/RequirementsSection";
import HostsSection from "@/components/sections/HostsSection";
import FooterSection from "@/components/sections/FooterSection";

const HomeV2 = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <V2Hero />
      <WorkshopChoice />
      <AgendaSection />
      <AudienceSection />
      <IndustriesSection />
      <TestimonialsSection />
      <RequirementsSection />
      <HostsSection />
      <FooterSection />
    </main>
  );
};

export default HomeV2;