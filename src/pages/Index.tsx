import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import WhySection from "@/components/sections/WhySection";
import AgendaSection from "@/components/sections/AgendaSection";
import AudienceSection from "@/components/sections/AudienceSection";
import RequirementsSection from "@/components/sections/RequirementsSection";
import HostsSection from "@/components/sections/HostsSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

import FooterSection from "@/components/sections/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhySection />
      <AgendaSection />
      <AudienceSection />
      <RequirementsSection />
      <HostsSection />
      <PricingSection />
      <TestimonialsSection />
      
      <FooterSection />
    </main>
  );
};

export default Index;
