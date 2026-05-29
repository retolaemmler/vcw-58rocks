import { BarChart3, Zap, Wrench, Sparkles, Globe, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const exampleKeys: { icon: typeof BarChart3; key: string }[] = [
  { icon: BarChart3, key: "excel" },
  { icon: Zap, key: "automate" },
  { icon: Wrench, key: "internal" },
  { icon: Globe, key: "landing" },
  { icon: FileText, key: "portals" },
  { icon: Sparkles, key: "more" },
];

const WhySection = () => {
  const { t } = useTranslation();
  return (
    <section id="why" className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-6">
          {t("why.titlePre")}<span className="gradient-text">{t("why.titleHighlight")}</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-14 leading-relaxed">
          {t("why.intro")}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleKeys.map((v) => (
            <div
              key={v.key}
              className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg gradient-bg-subtle flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{t(`why.examples.${v.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`why.examples.${v.key}.description`)}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href="https://vibehunt.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {t("why.inspire")}
            <ExternalLink className="w-4 h-4" />
          </a>
          <div className="mt-4">
            <Button asChild size="lg">
              <Link to="/ideas">
                <Sparkles className="w-4 h-4" />
                {t("why.ideaGenerator")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
