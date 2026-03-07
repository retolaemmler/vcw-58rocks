import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin } from "lucide-react";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";
import remyImg from "@/assets/Remy.jpeg";
import marcusImg from "@/assets/Marcus.jpeg";

const hostsRow1 = [
  { name: "Valentin Binnendijk", role: "Product Expert & Consultant", initials: "VB", image: valentinImg, linkedin: "https://www.linkedin.com/in/valentinbinnendijk/", ambassador: true },
  { name: "Reto Lämmler", role: "Entrepreneur & UX Expert", initials: "RL", image: retoImg, linkedin: "https://www.linkedin.com/in/rlaemmler/", ambassador: false },
];

const hostsRow2 = [
  { name: "Marcus Kuhn", role: "Product Expert & Consultant", initials: "MK", image: marcusImg, linkedin: "https://www.linkedin.com/in/marcuskuhn/", ambassador: false },
  { name: "Remy Blaettler", role: "CTO Supertext", initials: "RB", image: remyImg, linkedin: "https://www.linkedin.com/in/remyblaettler/", ambassador: false },
];

const HostsSection = () => {
  return (
    <section id="hosts" className="py-20 px-4 bg-section-alt">
      <div className="max-w-4xl mx-auto text-center">
        <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
          Official Lovable Ambassadors
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Your <span className="gradient-text">Workshop Hosts</span>
        </h2>
        <p className="text-muted-foreground mb-12">Your Vibe Coding Specialists</p>

        {[hostsRow1, hostsRow2].map((row, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8 last:mb-0">
            {row.map((host) => (
              <div
                key={host.name}
                className="bg-card rounded-xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <Avatar className="w-20 h-20 mx-auto mb-5">
                  <AvatarImage src={host.image} alt={host.name} className={`object-cover ${host.name === "Marcus Kuhn" ? "scale-150" : ""}`} />
                  <AvatarFallback className="gradient-bg text-white font-display text-xl font-bold">
                    {host.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-display font-semibold text-lg">{host.name}</h3>
                {host.ambassador && (
                  <Badge className="mt-2 px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-xs">
                    Official Lovable Ambassador
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground mt-1">{host.role}</p>
                <a href={host.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 mt-2 text-sm transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HostsSection;
