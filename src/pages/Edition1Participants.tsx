import { Linkedin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";
import marcoLImg from "@/assets/MarcoLustenberger.png";

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

const participants = [
  {
    name: "Lukas Karrer",
    company: "Helion Energy AG",
    linkedin: "https://linkedin.com/in/karrerlukas",
    initials: "LK",
  },
  {
    name: "Marco Lustenberger",
    company: "TrekkSoft AG",
    linkedin: "https://linkedin.com/in/marco-lustenberger-24259565",
    initials: "ML",
    image: marcoLImg,
  },
  {
    name: "Claudia Dietschi",
    company: "DIETSCHIART",
    linkedin: "https://linkedin.com/in/claudia-dietschi",
    initials: "CD",
  },
  {
    name: "Mario Fäh",
    company: "Roarington AG",
    linkedin: "https://linkedin.com/in/mariofaeh",
    initials: "MF",
  },
  {
    name: "Dave Lieber",
    company: "TestingTime AG",
    linkedin: "https://linkedin.com/in/dave-lieber-12220b3",
    initials: "DL",
  },
  {
    name: "Janine Totz",
    company: "TestingTime AG",
    linkedin: "https://linkedin.com/in/janine-totz-ux-professional",
    initials: "JT",
  },
  {
    name: "Marc Maurer",
    company: "Chapters Group",
    linkedin: "https://linkedin.com/in/marcmaurer",
    initials: "MM",
  },
  {
    name: "Mattia Piccoli",
    company: "",
    linkedin: "https://linkedin.com/in/mattiapiccoli",
    initials: "MP",
  },
  {
    name: "Ahmet Sakali",
    company: "TestingTime AG",
    linkedin: "https://linkedin.com/in/ahmet-sakali-94aa9ab3",
    initials: "AS",
  },
  {
    name: "Silvio Holdener",
    company: "SIX",
    linkedin: "https://linkedin.com/in/silvio-holdener-456479b8",
    initials: "SH",
  },
];

const Edition1Participants = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Connect with other participants
        </h1>
        <p className="text-muted-foreground mb-10">
          Meet the builders joining Vibe Code Workshop Edition 1.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map((p) => (
            <a
              key={p.name}
              href={p.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40"
            >
              <Avatar className="h-14 w-14 shrink-0">
                <AvatarImage src="" alt={p.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {p.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground truncate">
                  {p.name}
                </div>
                {p.company && (
                  <div className="text-sm text-muted-foreground truncate">
                    {p.company}
                  </div>
                )}
              </div>
              <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
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
                <div className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                  {c.name}
                  {c.ambassador && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                      🩷 Lovable Ambassador
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground truncate">{c.role}</div>
              </div>
              <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Edition1Participants;
