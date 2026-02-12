const steps = [
  {
    num: "01",
    title: "Vibe Coding Introduction",
    description: "Understand the fundamentals of vibe coding — the philosophy of going from idea to working app using natural language.",
  },
  {
    num: "02",
    title: "Lovable.dev Onboarding",
    description: "As official Lovable ambassadors, we'll professionally onboard you to the platform and show you how to get the best results.",
  },
  {
    num: "03",
    title: "Hands-On App Development",
    description: "The core of the workshop. In small teams (1–4 people), you'll build a functional app of your choice — with continuous expert support.",
  },
  {
    num: "04",
    title: "Presentation & Awards",
    description: "Present your apps, learn from other teams, and we'll award the best projects.",
  },
];

const schedule = [
  { time: "9:00 – 12:00", label: "Keynotes incl. Guest Speakers" },
  { time: "12:00 – 13:00", label: "Lunch" },
  { time: "13:00 – 16:00", label: "Hands-On App Development" },
  { time: "16:00 – 17:00", label: "Award & Next Steps" },
];

const AgendaSection = () => {
  return (
    <section id="agenda" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-14">
          What You'll <span className="gradient-text">Experience</span>
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 gradient-bg hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-5 sm:gap-8 group">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-bg flex items-center justify-center text-white font-display font-bold text-lg sm:text-xl shadow-lg">
                  {step.num}
                </div>
                <div className="bg-card rounded-xl p-5 sm:p-6 border border-border/50 shadow-sm flex-1 group-hover:shadow-md transition-shadow">
                  <h3 className="font-display font-semibold text-lg sm:text-xl mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-14">
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-center mb-6">
            Daily <span className="gradient-text">Schedule</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {schedule.map((item) => (
              <div
                key={item.time}
                className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border/50 shadow-sm"
              >
                <span className="font-display font-bold text-sm sm:text-base text-primary whitespace-nowrap">
                  {item.time}
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
