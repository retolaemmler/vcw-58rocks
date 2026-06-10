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
  <div className="mt-14">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
      Trusted by teams at
    </p>
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
      {logos.map((l) => (
        <div
          key={l.name}
          className="flex items-center justify-center h-10 md:h-12 w-32 md:w-40"
        >
          <img
            src={l.src}
            alt={l.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition"
          />
        </div>
      ))}
    </div>
  </div>
);

export default TrustedByStrip;