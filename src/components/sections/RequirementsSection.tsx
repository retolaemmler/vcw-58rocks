import { Laptop, Globe, Sparkles, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const itemKeys = [
  { icon: Laptop, key: "laptop" },
  { icon: Globe, key: "lovable" },
  { icon: Sparkles, key: "curiosity" },
];

const RequirementsSection = () => {
  const { t } = useTranslation();
  return (
    <section id="requirements" className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-10">
          {t("requirements.titlePre")}<span className="gradient-text">{t("requirements.titleHighlight")}</span>
        </h2>
        <div className="space-y-4 mb-8">
          {itemKeys.map((item) => (
            <div key={item.key} className="flex items-center gap-4 bg-card rounded-xl px-6 py-4 border border-border/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg gradient-bg-subtle flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground">{t(`requirements.items.${item.key}`)}</span>
            </div>
          ))}
        </div>
        <div className="gradient-bg-subtle rounded-xl p-6 border border-primary/20 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground mb-1">{t("requirements.importantLabel")}</p>
            <p className="text-muted-foreground">{t("requirements.importantText")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
