import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  BarChart3,
  Palette,
  Rocket,
  Megaphone,
  UserCheck,
  Building2,
  Heart,
  CreditCard,
  Landmark,
  Shield,
  GraduationCap,
  Store,
  HeartPulse,
  Cpu,
  Building,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const audienceKeys = [
  { key: "senior", icon: Briefcase },
  { key: "consultants", icon: BarChart3 },
  { key: "marketing", icon: Megaphone },
  { key: "product", icon: Rocket },
  { key: "design", icon: Palette },
  { key: "founders", icon: Building2 },
  { key: "agency", icon: UserCheck },
  { key: "hr", icon: Heart },
];

const industryKeys = [
  { key: "financial", icon: CreditCard },
  { key: "banking", icon: Landmark },
  { key: "insurances", icon: Shield },
  { key: "consulting", icon: Briefcase },
  { key: "marketing", icon: Megaphone },
  { key: "education", icon: GraduationCap },
  { key: "retail", icon: Store },
  { key: "healthcare", icon: HeartPulse },
  { key: "tech", icon: Cpu },
  { key: "public", icon: Building },
];

const AudienceSection = () => {
  const { t } = useTranslation();
  return (
    <section id="audience" className="py-20 px-4 bg-section-alt">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10">
          {t("audience.titlePre")}<span className="gradient-text">{t("audience.titleHighlight")}</span>{t("audience.titlePost")}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {audienceKeys.map((a) => (
            <Badge
              key={a.key}
              variant="secondary"
              className="px-4 py-2.5 text-sm font-medium bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <a.icon className="w-4 h-4 mr-2 text-primary" />
              {t(`audience.items.${a.key}`)}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground text-lg italic mb-10">
          {t("audience.quote")}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {industryKeys.map((industry) => {
            const Icon = industry.icon;
            return (
              <Badge
                key={industry.key}
                variant="secondary"
                className="px-4 py-2.5 text-sm font-semibold bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <Icon className="w-4 h-4 mr-2 text-primary" />
                {t(`audience.industries.${industry.key}`)}
              </Badge>
            );
          })}
        </div>
        <p className="text-muted-foreground text-lg italic mb-0">
          {t("audience.industryAgnostic")}
        </p>
      </div>
    </section>
  );
};

export default AudienceSection;
