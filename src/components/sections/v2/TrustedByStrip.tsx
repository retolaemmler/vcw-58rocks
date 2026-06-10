import trekksoft from "@/assets/trekksoft-logo.png.asset.json";
import raiffeisen from "@/assets/raiffeisen-logo.png.asset.json";
import humatica from "@/assets/humatica-logo.png.asset.json";
import startups from "@/assets/startups-logo.svg.asset.json";

const logos = [
  { name: "Raiffeisen", src: raiffeisen.url },
  { name: "TrekkSoft", src: trekksoft.url },
  { name: "Humatica", src: humatica.url },
  { name: "startups.ch", src: startups.url },
];

const TrustedByStrip = () => (
  <div className="mt-12">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-5">
      Trusted by teams at
    </p>
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {logos.map((l) => (
        <img
          key={l.name}
          src={l.src}
          alt={l.name}
          loading="lazy"
          className="h-7 md:h-9 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition"
        />
      ))}
    </div>
  </div>
);

export default TrustedByStrip;