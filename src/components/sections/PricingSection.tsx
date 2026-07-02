import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Star, Users, Gift, Sparkles } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const tierDefs = [
  { key: "early", price: "249", highlight: true, soldOut: false },
  { key: "regular", price: "299", highlight: false, soldOut: false },
  { key: "late", price: "349", highlight: false, soldOut: false },
];

const PricingSection = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <section id="pricing" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          <span className="gradient-text">{t("pricing.titleHighlight")}</span>{t("pricing.titlePost")}
        </h2>
        <p className="text-muted-foreground mb-12">
          {t("pricing.intro")} <span className="font-semibold text-foreground">CHF 349</span>
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {tierDefs.map((tier) =>
          <div
            key={tier.key}
            className={`relative rounded-xl p-6 border shadow-sm transition-all ${
            tier.soldOut
            ? "bg-muted/50 border-border/30 opacity-60"
            : tier.highlight
            ? "gradient-bg text-white border-transparent shadow-lg hover:shadow-md hover:-translate-y-1"
            : "bg-card border-border/50 hover:shadow-md hover:-translate-y-1"}`
            }>

              {tier.soldOut &&
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-destructive text-destructive-foreground shadow-lg px-3 animate-pulse border-0">
                    {t("pricing.soldOut")}
                  </Badge>
                </div>
            }
              {tier.highlight &&
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-white text-foreground shadow-md border-0 px-3">
                    <Star className="w-3 h-3 mr-1" /> {t("pricing.bestDeal")}
                  </Badge>
                </div>
            }
              <h3 className={`font-display font-semibold text-lg mb-1 ${tier.soldOut ? "line-through" : ""}`}>
                {t(`pricing.tiers.${tier.key}.name`)}
              </h3>
              <p className={`text-sm mb-4 ${tier.soldOut ? "line-through text-muted-foreground" : tier.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                {t(`pricing.tiers.${tier.key}.discount`)}
              </p>
              <p className={`font-display text-4xl font-bold mb-1 ${tier.soldOut ? "line-through" : ""}`}>
                CHF {tier.price}
              </p>
              <p className={`text-xs ${tier.soldOut ? "text-muted-foreground" : tier.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                {t("pricing.perPerson")}
              </p>
            </div>
          )}
        </div>


        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              size="lg"
              className="gradient-bg text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              asChild>
              <a
                href="https://buy.stripe.com/fZu4gzcOhfW5g4Y09ifIs0h"
                target="_blank"
                rel="noopener noreferrer">
                <Sparkles className="w-5 h-5 mr-2" />
                {t("pricing.cta")}
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t("pricing.limited")}</p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("hero.notifyTitle")}</DialogTitle>
            <DialogDescription>{t("hero.notifyDesc")}</DialogDescription>
          </DialogHeader>
          <NewsletterSignup variant="light" />
        </DialogContent>
      </Dialog>
    </section>);

};

export default PricingSection;