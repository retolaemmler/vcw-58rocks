import trekksoft from "@/assets/trekksoft-logo.png.asset.json";
import raiffeisen from "@/assets/raiffeisen-logo.png.asset.json";
import humatica from "@/assets/humatica-logo.png.asset.json";
import startups from "@/assets/startups-logo.svg.asset.json";

const logos = [
  { name: "Raiffeisen", src: raiffeisen.url, scale: 1 },
  { name: "TrekkSoft", src: trekksoft.url, scale: 0.9 },
  { name: "Humatica", src: humatica.url, scale: 0.95 },
  { name: "startups.ch", src: startups.url, scale: 0.85 },
];

const TrustedByStrip = () => (
  <div className="mt-14">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
      Trusted by teams at
    </p>
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
      {logos.map((l) => (
        <div
          key={l.name}
          className="flex items-center justify-center h-8 md:h-10 w-28 md:w-36"
        >
          <img
            src={l.src}
            alt={l.name}
            loading="lazy"
            style={{ maxHeight: `${l.scale * 100}%` }}
            className="max-w-full w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition"
          />
        </div>
      ))}
    </div>
  </div>
);

export default TrustedByStrip;