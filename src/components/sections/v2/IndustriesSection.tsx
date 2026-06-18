import { Badge } from "@/components/ui/badge";
import { Banknote, Briefcase, Megaphone, Shield, GraduationCap, Building2 } from "lucide-react";

const industries = [
  { label: "Financial services", icon: Banknote },
  { label: "Banking", icon: Building2 },
  { label: "Insurances", icon: Shield },
  { label: "Consulting", icon: Briefcase },
  { label: "Marketing & agencies", icon: Megaphone },
  { label: "Education", icon: GraduationCap },
];

const IndustriesSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Built for <span className="gradient-text">your industry</span>
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
          We've run vibecoding workshops with teams across very different fields. The toolkit
          adapts to your context — internal tools, prototypes, client demos, or operational helpers.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {industries.map((i) => (
            <Badge
              key={i.label}
              variant="secondary"
              className="px-4 py-2.5 text-sm font-medium bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <i.icon className="w-4 h-4 mr-2 text-primary" />
              {i.label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;