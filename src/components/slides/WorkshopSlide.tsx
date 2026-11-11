import { ArrowRight, Check, Sparkles } from "lucide-react";
import deck from "./workshop-deck.json";
import { SlideLayout } from "./SlideLayout";

const pointers = import.meta.glob<{ url: string }>("/src/assets/workshop-slides/*.asset.json", { eager: true, import: "default" });
export const workshopDeck = deck;
const imageUrl = (file: string) => pointers[`/src/assets/workshop-slides/${file}.asset.json`]?.url;

export function WorkshopSlide({ index }: { index: number }) {
  const slide = deck[index];
  if (!slide) return null;
  const n = slide.number;
  const images = slide.images;
  const image = (i: number, className = "") => images[i] ? <img className={className} src={imageUrl(images[i].file)} alt={`${slide.title} — original presentation visual ${i + 1}`} /> : null;
  const title = <h2 className="workshop-slide-title">{slide.title}</h2>;
  const bullets = (items: string[]) => <ul className="workshop-slide-list">{items.map(item => <li key={item}><Check className="text-primary" /><span>{item}</span></li>)}</ul>;
  const schedule = [
    ["17:00", "Welcome & Intro", "Introductions, intro to vibe coding, Lovable setup & tips"],
    ["17:30", "Workshop Session #1", "Start working on your app with continuous coaching"],
    ["19:00", "Pizza Break", "Refuel and chat with fellow participants"],
    ["19:30", "Next Level Vibe Coding", "APIs, emails, payments, backend, login, security"],
    ["19:45", "Workshop Session #2", "Continue building & polish your app"],
    ["20:30", "Presentations & Feedback", "Present your app to the others and give feedback"],
    ["21:00", "End", "Wrap up & celebrate"],
  ];
  let content;
  if (n === 1) content = <div className="workshop-opening"><img src="/vcw-logo.png" alt="VCW" className="workshop-opening-logo" /><p className="workshop-slide-kicker">11 November 2026 · Headquarters — The Elegant, Zürich</p><h1 className="workshop-slide-title-lg">Vibe Code Workshop<span className="gradient-text block">Build a real web app<br />in one evening.</span></h1><p className="workshop-slide-body-lg">By just using natural language and AI.</p><div className="workshop-opening-benefits"><span>Faster experimentation of ideas</span><span>Lower dependency on IT teams</span><span>Idea → prototype in hours, not months</span></div></div>;
  else if (n === 2 || n === 27) content = <main className="workshop-slide-main">{title}<div className="workshop-schedule">{schedule.map(([time, heading, text]) => <div key={time} className="workshop-schedule-item"><span className="workshop-slide-subtitle text-primary">{time}</span><div><h3 className="workshop-slide-body-lg font-semibold">{heading}</h3><p className="workshop-slide-body text-muted-foreground">{text}</p></div></div>)}</div></main>;
  else if (n === 3) content = <main className="workshop-slide-main">{title}<div className="workshop-coaches">{[0, 1].map((i) => <section key={i}>{image(i)}<div><h3 className="workshop-slide-subtitle">{i === 0 ? "Reto Lämmler" : "Remy Blaettler"}</h3><p className="workshop-slide-body-lg text-primary">{i === 0 ? "Entrepreneur & UX Expert" : "Founder & AI practitioner"}</p>{bullets(i === 0 ? ["Co-Organisator Vibe Code Fest", "Co-Founder TestingTime", "B.S. Computer Science & MAS in User Experience"] : ["Co-Organisator Vibe Code Fest", "Co-Founder Supertext", "M.S. Computer Engineering"])}</div></section>)}</div></main>;
  else if ([4,5,6,7,8,9,10,11,12,17,18,25,28].includes(n)) content = <main className="workshop-slide-main">{title}{n === 18 && <p className="workshop-slide-body mb-8 text-primary">Switch to the Vibe Code Workshop Workspace <ArrowRight className="inline" /></p>}<div className={`workshop-media-gallery workshop-media-count-${images.length} ${n === 28 ? "workshop-qr" : ""}`}>{images.map((_, i) => <div key={i}>{image(i)}</div>)}</div></main>;
  else if (n === 13) content = <main className="workshop-slide-main">{title}<div className="workshop-hype"><div>{image(2, "workshop-karpathy")}<h3 className="workshop-slide-subtitle">Andrej Karpathy</h3><p className="workshop-slide-body">OpenAI Co-Founder · AI Lead Tesla · Anthropic</p>{image(0, "workshop-tweet")}</div><div>{image(3, "workshop-srf")}{image(1)}{image(4)}</div></div></main>;
  else if (n === 16) content = <main className="workshop-slide-main">{title}<div className="workshop-prompt-columns"><div><p className="workshop-slide-body-lg">Prompt engineering isn't technical. It's about clearly explaining what you want.</p><h3 className="workshop-slide-subtitle text-primary mt-10">Role + Action + The Vibe</h3><div className="workshop-prompt-example workshop-slide-body"><p><strong>Role:</strong> “You are a senior UI designer…”</p><p><strong>Action:</strong> “Build a pricing table…”</p><p><strong>The Vibe:</strong> “…that looks like a restaurant menu. Use serif fonts and paper textures.”</p></div><p className="workshop-slide-caption text-muted-foreground mt-6">Translate the entire website into German. Add a language selector (EN, DE) to the navigation. Automatically select the browser's language; the fallback is English.</p></div><div className="workshop-media-gallery workshop-media-vertical">{image(0)}{image(1)}</div></div></main>;
  else if ([22,26,29].includes(n)) content = <div className="workshop-immersive-image">{image(0)}</div>;
  else {
    const copy: Record<number, { intro?: string; items?: string[]; quote?: string }> = {
      14: {intro: "You describe your idea in plain language — AI builds a working app.", items: ["No syntax. No setup. No waiting for developers.", "Describe the idea and context", "AI generates a real, usable application", "You improve it by talking to the system"]},
      15: {intro: "Lovable features used", items: ["Email for confirmation", "Database for orders and participants", "Stripe for payment", "OpenAI for Idea Generator", "Google Authentication", "Domain connect"]},
      19: {intro: "Prompt", quote: slide.texts[0].split("Prompt:")[1]?.trim()},
      20: {items: ["Open Lovable", "Select Plan mode", "Connect your design system", "Enter your app idea", "Get started and let Lovable guide you"], quote: "Build the first version without login.\nMetaphor: Building a house"},
      21: {intro: "No worries! Explain the issue again, like you would to a coworker.", quote: "Now, let’s build this step by step.\nI am frustrated!", items: ["Or just start over…"]},
      23: {items: ["Visual edits", "Undo / History", "Desktop vs. tablet vs. mobile view", "Enable login / sign-up", "Send emails", "AI features"]},
      24: {intro: "How to publish your app for others to use?", items: ["Publish your app", "Always: A Lovable subdomain", "Optional: Connect your own custom domain or buy one through Lovable", "Preview vs. published version", "Unpublish your app later"]},
    };
    const c = copy[n] || {};
    content = <main className="workshop-slide-main">{title}<div className="workshop-content-columns"><div>{c.intro && <p className="workshop-slide-body-lg mb-8">{c.intro}</p>}{c.items && bullets(c.items)}{c.quote && <blockquote className={`workshop-prompt-example ${n === 19 ? "workshop-slide-body" : "workshop-slide-body-lg"}`}><Sparkles className="text-primary mb-4" />{c.quote}</blockquote>}</div><div className="workshop-content-image">{image(0)}</div></div></main>;
  }
  return <SlideLayout number={n} title={slide.title} immersive={[1,22,26,29].includes(n)}>{content}</SlideLayout>;
}