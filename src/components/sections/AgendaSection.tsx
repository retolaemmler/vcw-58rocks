const morning = [
  { time: "09:00", title: "Welcome & Intro", description: "Kickoff, introductions, and overview of the day ahead." },
  { time: "10:00", title: "Workshop Session #1", description: "Hands-on app building in small teams with expert guidance." },
  { time: "12:00", title: "🍕 Lunch Break", description: "Recharge with pizza and connect with fellow participants." },
];

const afternoon = [
  { time: "13:00", title: "Next Level Vibe Coding", description: "APIs, backend integration, and advanced techniques." },
  { time: "13:30", title: "Workshop Session #2", description: "Continue building — push your app to the next level." },
  { time: "15:30", title: "Presentations & Feedback", description: "Present your apps, learn from other teams, and get feedback." },
  { time: "16:15", title: "Future of Vibe Coding", description: "Where is AI-assisted development heading next?" },
  { time: "16:30", title: "Q&A + 🍺 Beer", description: "Open discussion, networking, and a well-deserved drink." },
];

interface AgendaItemProps {
  time: string;
  title: string;
  description: string;
  isLast?: boolean;
}

const AgendaItem = ({ time, title, description, isLast }: AgendaItemProps) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-display font-bold text-xs shadow-lg shrink-0">
        {time}
      </div>
      {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-primary/10 mt-1" />}
    </div>
    <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm flex-1 group-hover:shadow-md transition-shadow mb-3">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

const AgendaSection = () => {
  return (
    <section id="agenda" className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-14">
          <span className="gradient-text">Workshop Schedule</span> in a Nutshell
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Morning */}
          <div>
            <h3 className="font-display font-bold text-xl mb-6 text-center md:text-left">
              ☀️ Morning
            </h3>
            <div>
              {morning.map((item, i) => (
                <AgendaItem key={item.time} {...item} isLast={i === morning.length - 1} />
              ))}
            </div>
          </div>
          {/* Afternoon */}
          <div>
            <h3 className="font-display font-bold text-xl mb-6 text-center md:text-left">
              🌙 Afternoon
            </h3>
            <div>
              {afternoon.map((item, i) => (
                <AgendaItem key={item.time} {...item} isLast={i === afternoon.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
