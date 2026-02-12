import { Badge } from "@/components/ui/badge";
import { Briefcase, BarChart3, Palette, Rocket, Megaphone, UserCheck, Building2, Heart } from "lucide-react";

const audiences = [
  { label: "Senior Professionals", icon: Briefcase },
  { label: "Consultants", icon: BarChart3 },
  { label: "Marketing Leaders", icon: Megaphone },
  { label: "Product Managers", icon: Rocket },
  { label: "UX/UI Designers", icon: Palette },
  { label: "CEOs & Founders", icon: Building2 },
  { label: "Agency Owners", icon: UserCheck },
  { label: "HR Leaders", icon: Heart },
];

const AudienceSection = () => {
  return (
    <section className="py-20 px-4 bg-section-alt">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10">
          Who Is This <span className="gradient-text">For</span>?
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {audiences.map((a) => (
            <Badge
              key={a.label}
              variant="secondary"
              className="px-4 py-2.5 text-sm font-medium bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <a.icon className="w-4 h-4 mr-2 text-primary" />
              {a.label}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground text-lg italic">
          "No coding experience required — just curiosity and ambition."
        </p>
      </div>
    </section>
  );
};

export default AudienceSection;
