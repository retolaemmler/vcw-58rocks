import { BarChart3, Zap, Wrench, Sparkles, Globe, FileText } from "lucide-react";

const examples = [
  {
    icon: BarChart3,
    title: "Excel → Live Dashboard",
    description: "Turn your manual Excel reports into interactive, real-time dashboards your whole team can access.",
  },
  {
    icon: Zap,
    title: "Automate Manual Workflows",
    description: "Replace repetitive, error-prone processes with smart automations — no developer needed.",
  },
  {
    icon: Wrench,
    title: "Build Internal Tools",
    description: "Create that one little app your team has been wishing for — in hours, not months.",
  },
  {
    icon: Globe,
    title: "Launch a Landing Page",
    description: "Go from idea to a polished, published website in a single afternoon.",
  },
  {
    icon: FileText,
    title: "Custom Client Portals",
    description: "Build tailored portals and forms for your clients — professional and fully branded.",
  },
  {
    icon: Sparkles,
    title: "And So Much More…",
    description: "CRM tools, booking systems, calculators, onboarding flows — if you can describe it, you can build it.",
  },
];

const WhySection = () => {
  return (
    <section id="why" className="py-20 px-4 bg-section-alt">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-6">
          What You will Build with <span className="gradient-text">Vibe Coding</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-14 leading-relaxed">
          Lovable.dev lets anyone build real, functional applications using just natural language. Here are just a few things you'll be able to create after this workshop:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((v) => (
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
