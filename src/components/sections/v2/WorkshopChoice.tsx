import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users, ArrowRight, Check } from "lucide-react";

const WorkshopChoice = () => {
  const navigate = useNavigate();
  const { lang = "en" } = useParams();

  const cards = [
    {
      icon: Building2,
      title: "Company Workshop",
      subtitle: "Private workshop for your team (6–20 people).",
      bullets: [
        "Tailored to your industry & use cases",
        "On-site or remote, your dates",
        "Team builds real internal tools",
      ],
      cta: "Book for your team",
      to: `/${lang}/v2/company`,
    },
    {
      icon: Users,
      title: "Classic Workshop",
      subtitle: "Join one of our upcoming public dates.",
      bullets: [
        "Mixed group, curated participants",
        "Fixed dates, apply for a spot",
        "Perfect for individuals & small teams",
      ],
      cta: "Apply for a date",
      to: `/${lang}/v2/classic`,
    },
  ];

  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={() => navigate(c.to)}
            className="group text-left bg-card rounded-2xl p-8 border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5 shadow-md">
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">{c.title}</h3>
            <p className="text-muted-foreground mb-5">{c.subtitle}</p>
            <ul className="space-y-2 mb-6">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full group-hover:gap-3 transition-all">
              {c.cta}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </button>
        ))}
      </div>
    </section>
  );
};

export default WorkshopChoice;