import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, MapPin, ExternalLink } from "lucide-react";
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
  const { t } = useTranslation();

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

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-tight">
          {t("hero.descriptionBefore")}
          <a href="https://www.lovable.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center align-middle">
            <img src={lovableLogo} alt="Lovable.dev" className="h-3 sm:h-4 inline-block" />
          </a>
          {t("hero.descriptionAfter")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            {t("hero.date")}
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span>{t("hero.time")}</span>
          <span className="hidden sm:inline text-border">|</span>
          <a
            href="https://maps.app.goo.gl/DgThKo1tHm5i4bsK6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <MapPin className="w-4 h-4 text-primary" />
            {t("hero.location")}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        <div className="items-center gap-6 flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              size="lg"
              className="gradient-bg text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
              <Sparkles className="w-5 h-5 mr-2" />
              {t("hero.cta")}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t("hero.limited")}</p>
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