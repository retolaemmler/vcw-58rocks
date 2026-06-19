import { useTranslation } from "react-i18next";
import raiffeisenLogo from "@/assets/raiffeisen-logo.png.asset.json";
import trekksoftLogo from "@/assets/trekksoft-logo.png.asset.json";
import humaticaLogo from "@/assets/humatica-logo.png.asset.json";
import startupsLogo from "@/assets/startups-logo.svg.asset.json";

interface TrustedBySectionProps {
  isVisible: boolean;
}

const logos = [
  { src: raiffeisenLogo.url, alt: "Raiffeisen", height: "h-8 sm:h-9" },
  { src: trekksoftLogo.url, alt: "TrekkSoft", height: "h-8 sm:h-9" },
  { src: humaticaLogo.url, alt: "Humatica", height: "h-8 sm:h-9" },
  { src: startupsLogo.url, alt: "Startups.ch", height: "h-8 sm:h-9" },
];

const TrustedBySection = ({ isVisible }: TrustedBySectionProps) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <section className="py-12 sm:py-16 px-4 bg-background animate-fade-up border-b border-border/50">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-center text-muted-foreground uppercase mb-8 sm:mb-10">
          {t("hero.trustedBy.title")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12 lg:gap-x-16">
          {logos.map((logo) => (
            <div key={logo.alt} className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.height} w-auto object-contain max-w-[140px] sm:max-w-[160px]`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
