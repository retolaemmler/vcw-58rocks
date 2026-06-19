import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import valentinImg from "@/assets/Valentin.jpeg";
import retoImg from "@/assets/Reto.jpeg";
import remyImg from "@/assets/Remy.jpeg";
import coachesTeamImg from "@/assets/coaches-team.jpg.asset.json";

const coaches = [
  { name: "Reto Lämmler", roleKey: "reto", initials: "RL", image: retoImg, linkedin: "https://www.linkedin.com/in/rlaemmler/", ambassador: true },
  { name: "Remy Blaettler", roleKey: "remy", initials: "RB", image: remyImg, linkedin: "https://www.linkedin.com/in/remyblaettler/", ambassador: false },
  { name: "Valentin Binnendijk", roleKey: "valentin", initials: "VB", image: valentinImg, linkedin: "https://www.linkedin.com/in/valentinbinnendijk/", ambassador: true },
];

const HostsSection = () => {
  const { t } = useTranslation();
  return (
    <section id="coaches" className="py-20 px-4 bg-section-alt">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          {t("coaches.titlePre")}<span className="gradient-text">{t("coaches.titleHighlight")}</span>
        </h2>
        <p className="text-muted-foreground mb-12">{t("coaches.intro")}</p>

        <div className="max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-md border border-border/50">
          <img
            src={coachesTeamImg.url}
            alt="Valentin Binnendijk, Reto Lämmler and Remy Blaettler at a Vibe Code Workshop"
            loading="lazy"
            className="w-full aspect-[16/7] object-cover object-top"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {coaches.map((host) => (
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
              <p className="text-sm text-muted-foreground mt-1">{t(`coaches.roles.${host.roleKey}`)}</p>
              <div className="flex flex-col items-center gap-2 mt-2">
                {host.ambassador && (
                  <Badge className="px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-xs">
                    {t("coaches.ambassador")}
                  </Badge>
                )}
                <a href={host.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostsSection;
