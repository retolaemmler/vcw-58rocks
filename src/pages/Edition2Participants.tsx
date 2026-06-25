import { Linkedin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";

const coaches = [
  {
    name: "Valentin Binnendijk",
    role: "Product Expert & Consultant",
    linkedin: "https://www.linkedin.com/in/valentinbinnendijk/",
    initials: "VB",
    image: valentinImg,
    ambassador: true,
  },
  {
    name: "Reto Lämmler",
    role: "Entrepreneur & UX Expert",
    linkedin: "https://www.linkedin.com/in/rlaemmler/",
    initials: "RL",
    image: retoImg,
    ambassador: true,
  },
];

type Participant = {
  name: string;
  company?: string;
  linkedin?: string;
  initials: string;
  image?: string;
};

const participants: Participant[] = [
  { name: "Andreas Kropf", company: "Finalix AG", initials: "AK" },
  { name: "Klaus Enke", initials: "KE" },
  { name: "Nicole Steiner", company: "Netcetera", initials: "NS" },
  { name: "Simon Husi", company: "Startups.ch AG", initials: "SH" },
  { name: "Tobias Bangerter", company: "Tobis 2nd Opinion", initials: "TB" },
  { name: "Michel Schoch", company: "Zugerberg Finanz AG", initials: "MS" },
  { name: "Felix Huber", company: "OST – Ostschweizer Fachhochschule", initials: "FH" },
];

const Edition2Participants = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Connect with other participants
        </h1>
        <p className="text-muted-foreground mb-10">
          Meet the builders joining Vibe Code Workshop Edition 2.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map((p) => {
            const CardInner = (
              <>
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarImage src={p.image || ""} alt={p.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {p.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground truncate">
                    {p.name}
                  </div>
                  {p.company && (
                    <div className="text-sm text-muted-foreground">
                      {p.company}
                    </div>
                  )}
                </div>
                {p.linkedin && (
                  <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                )}
              </>
            );

            return p.linkedin ? (
              <a
                key={p.name}
                href={p.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40"
              >
                {CardInner}
              </a>
            ) : (
              <div
                key={p.name}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                {CardInner}
              </div>
            );
          })}
        </div>

        {/* Coaches */}
        <h2 className="text-2xl font-bold text-foreground mt-16 mb-6">Coaches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {coaches.map((c) => (
            <a
              key={c.name}
              href={c.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40"
            >
              <Avatar className="h-14 w-14 shrink-0">
                <AvatarImage src={c.image} alt={c.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {c.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground truncate">
                  {c.name}
                </div>
                <div className="text-sm text-muted-foreground truncate">{c.role}</div>
                {c.ambassador && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-1">
                    🩷 Lovable Ambassador
                  </Badge>
                )}
              </div>
              <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Edition2Participants;