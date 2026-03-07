import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Star, Users } from "lucide-react";

const tiers = [
{ name: "Early Bird", price: "599", discount: "25% off", highlight: true },
{ name: "Late Bird", price: "679", discount: "15% off", highlight: false },
{ name: "Regular", price: "799", discount: "Base price", highlight: false }];


const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          <span className="gradient-text">Pricing</span> & Tickets
        </h2>
        <p className="text-muted-foreground mb-12">
          Full-day workshop — Base price <span className="font-semibold text-foreground">CHF 799</span>
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {tiers.map((tier) =>
          <div
            key={tier.name}
            className={`relative rounded-xl p-6 border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${
            tier.highlight ?
            "gradient-bg text-white border-transparent shadow-lg" :
            "bg-card border-border/50"}`
            }>

              {tier.highlight &&
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-white text-foreground shadow-md border-0 px-3">
                    <Star className="w-3 h-3 mr-1" /> Best Deal
                  </Badge>
                </div>
            }
              <h3 className={`font-display font-semibold text-lg mb-1 ${tier.highlight ? "" : ""}`}>
                {tier.name}
              </h3>
              <p className={`text-sm mb-4 ${tier.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                {tier.discount}
              </p>
              <p className="font-display text-4xl font-bold mb-1">
                CHF {tier.price}
              </p>
              <p className={`text-xs ${tier.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                per person
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="gradient-bg text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            asChild>
            <a href="https://buy.stripe.com/fZu4gzcOhfW5g4Y09ifIs0h" target="_blank" rel="noopener noreferrer">
              <Ticket className="w-5 h-5 mr-2" />
              Get Your Ticket
            </a>
          </Button>

          <Badge className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Min. 10 participants required.
          </Badge>
        </div>
    </section>);

};

export default PricingSection;