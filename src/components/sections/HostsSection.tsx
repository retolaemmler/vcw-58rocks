import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";
import remyImg from "@/assets/Remy.jpeg";

const hosts = [
  { name: "Valentin Binnendijk", role: "Product Expert", initials: "VB", image: valentinImg },
  { name: "Reto Lämmler", role: "Entrepreneur & UX Expert", initials: "RL", image: retoImg },
  { name: "Remy Blaettler", role: "CTO Supertext", initials: "RB", image: remyImg },
];

const HostsSection = () => {
  return (
    <section className="py-20 px-4 bg-section-alt">
      <div className="max-w-4xl mx-auto text-center">
        <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
          Official Lovable Ambassadors
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Your <span className="gradient-text">Workshop Hosts</span>
        </h2>
        <p className="text-muted-foreground mb-12">Your Vibe Coding Specialists</p>

        <div className="grid sm:grid-cols-3 gap-8">
          {hosts.map((host) => (
            <div
              key={host.name}
              className="bg-card rounded-xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <Avatar className="w-20 h-20 mx-auto mb-5">
                <AvatarImage src={host.image} alt={host.name} className="object-cover" />
                <AvatarFallback className="gradient-bg text-white font-display text-xl font-bold">
                  {host.initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-display font-semibold text-lg">{host.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{host.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostsSection;
