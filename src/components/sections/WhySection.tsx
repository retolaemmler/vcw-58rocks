import { Lightbulb, Users, Handshake, Wrench } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Real Learning Experience",
    description: "You'll walk away with a functioning app you built yourself.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Official Lovable ambassadors guide you through every step.",
  },
  {
    icon: Handshake,
    title: "Teambuilding Effect",
    description: "Discover Lovable together with your peers — it's fun.",
  },
  {
    icon: Wrench,
    title: "Practical Skills",
    description: "Actionable knowledge you can apply in your daily work.",
  },
];

const WhySection = () => {
  return (
    <section id="why" className="py-20 px-4 bg-section-alt">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-6">
          Why <span className="gradient-text">Vibe Coding</span>?
        </h2>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-14 leading-relaxed">
          Modern software development is being democratized by Lovable.dev. Whether you're a designer, product manager, consultant, or simply tech-curious — you can now build functional applications quickly and intuitively using just natural language. This workshop is more than a training. It's a journey into the future of software development, powered by the simplest programming language in the world: your own words.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg gradient-bg-subtle flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
