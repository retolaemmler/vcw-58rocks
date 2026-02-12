import { Laptop, Globe, Sparkles, ShieldCheck } from "lucide-react";

const items = [
  { icon: Laptop, text: "A laptop or computer" },
  { icon: Globe, text: "Access to lovable.dev (initial credits will be provided)" },
  { icon: Sparkles, text: "Curiosity and team spirit" },
];

const RequirementsSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-10">
          What You'll <span className="gradient-text">Need</span>
        </h2>
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.text} className="flex items-center gap-4 bg-card rounded-xl px-6 py-4 border border-border/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg gradient-bg-subtle flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
        <div className="gradient-bg-subtle rounded-xl p-6 border border-primary/20 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground mb-1">Important</p>
            <p className="text-muted-foreground">All applications you develop during the workshop are fully owned by you.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
