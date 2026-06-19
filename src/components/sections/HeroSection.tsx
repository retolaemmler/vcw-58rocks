import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, MapPin, ExternalLink, Users, ArrowRight, Check } from "lucide-react";
import lovableLogo from "@/assets/lovable-logo.png";
import WaitlistSignup from "@/components/NewsletterSignup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const HeroSection = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"you" | "company">("you");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang = "en" } = useParams();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 pt-28 pb-8">
      {/* Background blobs */}
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-blue/8 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          {t("hero.title")}
          <span className="block gradient-text mt-2">{t("hero.subtitle")}</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-tight">
          {t("hero.descriptionBefore")}
          <a href="https://www.lovable.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center align-middle">
            <img src={lovableLogo} alt="Lovable.dev" className="h-3 sm:h-4 inline-block" />
          </a>
          {t("hero.descriptionAfter")}
        </p>

        {/* Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-muted border border-border mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("you")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "you"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("hero.tabs.you")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("company")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "company"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("hero.tabs.company")}
          </button>
        </div>

        {/* Workshop card */}
        <div className="w-full text-left">
          {activeTab === "you" ? (
            <div className="relative flex flex-col p-8 rounded-3xl border-2 border-purple/20 bg-card shadow-xl shadow-purple/5 transition-transform hover:-translate-y-1">
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold mb-2">{t("hero.masterclass.title")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t("hero.masterclass.description")}</p>
              </div>

              <div className="flex-grow space-y-3 mb-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-medium">{t("hero.masterclass.date")}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <a
                    href="https://maps.app.goo.gl/DgThKo1tHm5i4bsK6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    {t("hero.masterclass.location")}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-medium">{t("hero.masterclass.capacity")}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="text-sm text-primary hover:underline underline-offset-4 font-medium"
                >
                  {t("hero.masterclass.dateNote")}
                </button>
              </div>

              <Button
                size="lg"
                className="w-full gradient-bg text-white font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t("hero.masterclass.cta")}
              </Button>
            </div>
          ) : (
            <div className="relative overflow-hidden flex flex-col p-10 rounded-[40px] border border-white/80 bg-card/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)]">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="font-display text-[22px] font-semibold leading-tight tracking-tight mb-3">
                    {t("hero.company.title")}
                  </h3>
                  <p className="text-muted-foreground text-[15px] leading-relaxed">
                    {t("hero.company.description")}
                  </p>
                </div>

                <div className="flex-grow space-y-4 mb-10">
                  {[
                    "hero.company.topic1",
                    "hero.company.topic2",
                    "hero.company.topic3",
                  ].map((key) => (
                    <div key={key} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-1" strokeWidth={2.5} />
                      <span className="text-sm font-medium text-foreground/80">{t(key)}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-background border-border text-foreground text-[15px] font-semibold py-4 px-6 rounded-2xl shadow-sm hover:bg-secondary hover:border-border/80 hover:shadow-md active:scale-[0.98] transition-all group"
                  onClick={() => navigate(`/${lang}/v2/company`)}
                >
                  {t("hero.company.cta")}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("hero.notifyTitle")}</DialogTitle>
            <DialogDescription>{t("hero.notifyDesc")}</DialogDescription>
          </DialogHeader>
          <WaitlistSignup variant="light" />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
