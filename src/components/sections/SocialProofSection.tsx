import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const supporters = [
  { name: "Rico Wyder", initials: "RW" },
  { name: "Matthias Sala", initials: "MS" },
  { name: "Marc Gasser", initials: "MG" },
];

const SocialProofSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">Supported by</p>
        <div className="flex flex-wrap justify-center gap-10">
          {supporters.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-muted text-muted-foreground font-display font-semibold text-lg">
                  {s.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
