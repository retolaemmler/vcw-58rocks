import { Linkedin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";
import marcoLImg from "@/assets/MarcoLustenberger.png";
import lukasKImg from "@/assets/LukasKarrer.png";
import claudiaDImg from "@/assets/ClaudiaDietschi.png";
import marioFImg from "@/assets/MarioFaeh.png";
import daveLImg from "@/assets/DaveLieber.png";
import janineTImg from "@/assets/JanineTotz.png";
import marcMImg from "@/assets/MarcMaurer.png";
import mattiaPImg from "@/assets/MattiaPiccoli.png";
import ahmetSImg from "@/assets/AhmetSakali.png";
import silvioHImg from "@/assets/SilvioHoldener.png";

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
    company: "CDO at Helion Energy AG",
    linkedin: "https://linkedin.com/in/karrerlukas",
    initials: "LK",
    image: lukasKImg,
  },
  {
    name: "Marco Lustenberger",
    company: "Group CFO at TSG (TrekkSoft Group)",
    linkedin: "https://linkedin.com/in/marco-lustenberger-24259565",
    initials: "ML",
    image: marcoLImg,
  },
  {
    name: "Claudia Dietschi",
    company: "Artist & Owner at DIETSCHIART",
    linkedin: "https://linkedin.com/in/claudia-dietschi",
    initials: "CD",
    image: claudiaDImg,
  },
  {
    name: "Mario Fäh",
    company: "Chief Market Officer at Roarington AG",
    linkedin: "https://linkedin.com/in/mariofaeh",
    initials: "MF",
    image: marioFImg,
  },
  {
    name: "Dave Lieber",
    company: "Managing Director at TestingTime",
    linkedin: "https://linkedin.com/in/dave-lieber-12220b3",
    initials: "DL",
    image: daveLImg,
  },
  {
    name: "Janine Totz",
    company: "Product Lead at TestingTime",
    linkedin: "https://linkedin.com/in/janine-totz-ux-professional",
    initials: "JT",
    image: janineTImg,
  },
  {
    name: "Marc Maurer",
    company: "COO at Chapters Group / Board Member at Software Circle",
    linkedin: "https://linkedin.com/in/marcmaurer",
    initials: "MM",
    image: marcMImg,
  },
  {
    name: "Mattia Piccoli",
    company: "Executive Board Member at Nexus Group",
    linkedin: "https://linkedin.com/in/mattiapiccoli",
    initials: "MP",
    image: mattiaPImg,
  },
  {
    name: "Ahmet Sakali",
    company: "Senior Key Account Manager at TestingTime",
    linkedin: "https://linkedin.com/in/ahmet-sakali-94aa9ab3",
    initials: "AS",
    image: ahmetSImg,
  },
  {
    name: "Silvio Holdener",
    company: "Senior Business Development Manager",
    linkedin: "https://linkedin.com/in/silvio-holdener-456479b8",
    initials: "SH",
    image: silvioHImg,
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

export default Edition1Participants;
