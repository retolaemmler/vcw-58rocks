import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function ScaledSlide({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resize = () => setScale(Math.min(element.clientWidth / 1920, element.clientHeight / 1080));
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="workshop-slide-stage"><div className="workshop-slide-wrapper" style={{ transform: `scale(${scale})` }}>{children}</div></div>;
}

export function SlideLayout({ children, number, title, immersive = false }: { children: ReactNode; number: number; title: string; immersive?: boolean }) {
  return <article className={`workshop-slide ${immersive ? "workshop-slide-immersive" : ""}`} aria-label={`Slide ${number}: ${title}`}>
    {!immersive && <header className="workshop-slide-header"><img src="/vcw-logo.png" alt="Vibe Code Workshop" /><span>Vibe Code Workshop</span><span className="ml-auto">11 November 2026 · Zürich</span></header>}
    {children}
    <footer className="workshop-slide-footer"><span>vibecodeworkshop.ch</span><span>{String(number).padStart(2, "0")} / 29</span></footer>
  </article>;
}