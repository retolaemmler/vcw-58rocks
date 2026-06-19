import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import WhySection from "@/components/sections/WhySection";
import AgendaSection from "@/components/sections/AgendaSection";
import AudienceSection from "@/components/sections/AudienceSection";
import RequirementsSection from "@/components/sections/RequirementsSection";
import HostsSection from "@/components/sections/HostsSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

import FooterSection from "@/components/sections/FooterSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"you" | "company">("you");

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <TrustedBySection isVisible={activeTab === "company"} />
      <WhySection />
      <AgendaSection />
      <AudienceSection activeTab={activeTab} />
      <TestimonialsSection />
      <RequirementsSection />
      <HostsSection />
      {activeTab === "you" && <PricingSection />}
      
      <FooterSection />
    </main>
  );
};

export default Index;
