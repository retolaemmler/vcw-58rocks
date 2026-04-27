import { useEffect } from "react";
import { Quote } from "lucide-react";

type Testimonial = {
  slug: string;
  name: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    slug: "dave",
    name: "Dave",
    quote:
      "Genuinely great working atmosphere that made it easy to engage, learn, and try things out.",
  },
  {
    slug: "ahmet",
    name: "Ahmet",
    quote:
      "Yes, it works. You have something in mind and with easy efforts you will get a nice outcome.",
  },
  {
    slug: "lukas",
    name: "Lukas K.",
    quote:
      "I came in with just a rough idea and left with a working solar calculator linked to our CRM in a day. Seeing how Lovable actually builds complex API integrations shifted my whole perspective on what I can create myself.",
  },
  {
    slug: "marco",
    name: "Marco",
    quote:
      "Reto and Valentin really helped us dive into using these tools quickly and getting quick results. I also liked the advice on what types of projects work well and where more caution is advised. Seeing all of the ideas that others come up with was also fascinating.",
  },
  {
    slug: "mattia",
    name: "Mattia",
    quote:
      "I showed up with nothing and finished the day with a functional web app. It is wild how much I actually got done using Lovable in a single day.",
  },
  {
    slug: "mario",
    name: "Mario",
    quote:
      "I went from never touching AI coding to building a custom marketing automation tool in a day. It was surprising to see how Lovable handled the email integrations and customer data so quickly.",
  },
  {
    slug: "silvio",
    name: "Silvio",
    quote: "Turned an idea into something real — in just one day.",
  },
  {
    slug: "claudio",
    name: "Claudia",
    quote:
      "I loved seeing how easy it is to build an app with no line of code written. It was helpful to have the time blocked and the pressure to get it done in a day. It was great to have assistance by the coaches in moments where I would typically get blocked.",
  },
];

const TestimonialsSection = () => {
  // Smooth-scroll to the section when arriving with a hash like #testimonials.
  // Uses a delay so the sticky header offset
  // (scroll-mt-*) is respected after layout settles.
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 bg-section-alt scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            What past participants say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real feedback from people who joined a previous Vibe Code Workshop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.slug}
              className="group relative bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-7 h-7 text-primary/30 mb-3" />
              <p className="text-foreground leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-4 border-t border-border">
                <span className="font-semibold text-foreground">{t.name}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;