import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

type Testimonial = {
  slug: string;
  name: string;
  quote: string;
  image: string;
  initials: string;
  linkedin: string;
};

const testimonials: Testimonial[] = [
  {
    slug: "dave",
    name: "Dave Lieber",
    image: "/participants/DaveLieber.png",
    initials: "DL",
    linkedin: "https://linkedin.com/in/dave-lieber-12220b3",
    quote:
      "Genuinely great working atmosphere that made it easy to engage, learn, and try things out.",
  },
  {
    slug: "ahmet",
    name: "Ahmet Sakali",
    image: "/participants/AhmetSakali.png",
    initials: "AS",
    linkedin: "https://linkedin.com/in/ahmet-sakali-94aa9ab3",
    quote:
      "Yes, it works. You have something in mind and with easy efforts you will get a nice outcome.",
  },
  {
    slug: "lukas",
    name: "Lukas Karrer",
    image: "/participants/LukasKarrer.png",
    initials: "LK",
    linkedin: "https://linkedin.com/in/karrerlukas",
    quote:
      "I came in with just a rough idea and left with a working solar calculator linked to our CRM in a day. Seeing how Lovable actually builds complex API integrations shifted my whole perspective on what I can create myself.",
  },
  {
    slug: "marco",
    name: "Marco Lustenberger",
    image: "/participants/MarcoLustenberger.png",
    initials: "ML",
    linkedin: "https://linkedin.com/in/marco-lustenberger-24259565",
    quote:
      "Reto and Valentin really helped us dive into using these tools quickly and getting quick results. I also liked the advice on what types of projects work well and where more caution is advised. Seeing all of the ideas that others come up with was also fascinating.",
  },
  {
    slug: "mattia",
    name: "Mattia Piccoli",
    image: "/participants/MattiaPiccoli.png",
    initials: "MP",
    linkedin: "https://linkedin.com/in/mattiapiccoli",
    quote:
      "I showed up with nothing and finished the day with a functional web app. It is wild how much I actually got done using Lovable in a single day.",
  },
  {
    slug: "mario",
    name: "Mario Fäh",
    image: "/participants/MarioFaeh.png",
    initials: "MF",
    linkedin: "https://linkedin.com/in/mariofaeh",
    quote:
      "I went from never touching AI coding to building a custom marketing automation tool in a day. It was surprising to see how Lovable handled the email integrations and customer data so quickly.",
  },
  {
    slug: "silvio",
    name: "Silvio Holdener",
    image: "/participants/SilvioHoldener.png",
    initials: "SH",
    linkedin: "https://linkedin.com/in/silvio-holdener-456479b8",
    quote: "Turned an idea into something real — in just one day.",
  },
  {
    slug: "claudia",
    name: "Claudia Dietschi",
    image: "/participants/ClaudiaDietschi.png",
    initials: "CD",
    linkedin: "https://www.linkedin.com/in/claudiadietschi/",
    quote:
      "I loved seeing how easy it is to build an app with no line of code written. It was helpful to have the time blocked and the pressure to get it done in a day. It was great to have assistance by the coaches in moments where I would typically get blocked.",
  },
];

const TestimonialsSection = () => {
  const { t } = useTranslation();
  return (
    <section id="testimonials" className="py-20 px-4 bg-section-alt scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            {t("testimonials.eyebrow")}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials.intro")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Participant testimonials">
          {testimonials.map((t) => (
            <article
              key={t.slug}
              className="group relative bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-7 h-7 text-primary/30 mb-3" />
              <p className="text-foreground leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={t.image} alt={t.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <a
                    href={t.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground hover:text-primary transition-colors leading-tight"
                  >
                    {t.name === "Dave Lieber" 
                      ? "Dave Lieber, Managing Director at TestingTime" 
                      : t.name === "Ahmet Sakali"
                      ? "Ahmet Sakali, Senior Account Manager at TestingTime"
                      : t.name === "Lukas Karrer"
                      ? "Lukas Karrer, CDO at Helion Energy"
                      : t.name === "Marco Lustenberger"
                      ? "Marco Lustenberger, Group CFO at Trekksoft Group"
                      : t.name === "Mario Fäh"
                      ? "Mario Fäh, CMO at Roaringten"
                      : t.name === "Mattia Piccoli"
                      ? "Mattia Piccoli, CMO at Nexus Group Holding"
                      : t.name === "Silvio Holdener"
                      ? "Silvio Holdener, Senior Business Development Manager at SIX"
                      : t.name}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;