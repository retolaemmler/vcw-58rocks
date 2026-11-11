import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Grid2X2, Maximize, Minimize, NotebookPen, Printer, Home, PanelLeftClose, PanelLeftOpen, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScaledSlide } from "@/components/slides/SlideLayout";
import { WorkshopSlide, workshopDeck } from "@/components/slides/WorkshopSlide";

export default function WorkshopSlides() {
  const [params, setParams] = useSearchParams();
  const parsed = Number(params.get("slide") || "1");
  const index = Number.isFinite(parsed) ? Math.min(Math.max(Math.trunc(parsed) - 1, 0), workshopDeck.length - 1) : 0;
  const print = params.has("print");
  const presenter = params.has("presenter");
  const [grid, setGrid] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>(() => { try { return JSON.parse(localStorage.getItem("vcw-workshop-notes") || "{}"); } catch { return {}; } });
  const [seconds, setSeconds] = useState(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const goTo = useCallback((next: number) => {
    const value = Math.min(Math.max(next, 0), workshopDeck.length - 1);
    setParams(previous => { const updated = new URLSearchParams(previous); updated.set("slide", String(value + 1)); return updated; }, { replace: true });
    channel.current?.postMessage({ index: value });
  }, [setParams]);
  useEffect(() => {
    const c = new BroadcastChannel("vcw-workshop-slides"); channel.current = c;
    c.onmessage = event => { if (Number.isInteger(event.data?.index)) setParams(previous => { const updated = new URLSearchParams(previous); updated.set("slide", String(Math.min(Math.max(event.data.index, 0), workshopDeck.length - 1) + 1)); return updated; }, { replace: true }); };
    return () => { c.close(); channel.current = null; };
  }, [setParams]);
  useEffect(() => {
    document.title = `${index + 1}/29 — ${workshopDeck[index].title}`;
  }, [index]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) { e.preventDefault(); goTo(index + 1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(index - 1); }
      if (e.key.toLowerCase() === "g") setGrid(value => !value);
      if (e.key === "Escape") setGrid(false);
      if (e.key === "F5") { e.preventDefault(); document.documentElement.requestFullscreen?.().catch(() => {}); }
    };
    const change = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener("keydown", key); document.addEventListener("fullscreenchange", change);
    return () => { window.removeEventListener("keydown", key); document.removeEventListener("fullscreenchange", change); };
  }, [index, goTo]);
  useEffect(() => { if (!presenter) return; const timer = setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(timer); }, [presenter]);
  useEffect(() => {
    if (!print) return;
    let cancelled = false;
    Promise.all(Array.from(document.images).map(img => img.decode().catch(() => {}))).then(() => { if (!cancelled) window.print(); });
    return () => { cancelled = true; };
  }, [print]);
  const note = notes[index] ?? workshopDeck[index].notes;
  if (print) return <div className="workshop-print">{workshopDeck.map((_, i) => <WorkshopSlide index={i} key={i} />)}</div>;
  return <div className={`workshop-editor ${fullscreen ? "workshop-presenting" : ""}`}>
    {!fullscreen && <header className="workshop-toolbar"><a href="/" title="Back to website" className="flex items-center gap-3"><img src="/vcw-logo.png" alt="VCW" className="w-9 h-9" /><Home className="h-4 w-4 text-muted-foreground" /></a><div className="workshop-document-label"><strong className="font-display">Vibe Code Workshop</strong><span className="text-xs text-muted-foreground">11 November 2026</span></div><div className="ml-auto flex items-center gap-2">
      <Button size="icon" variant="outline" title="Toggle slide thumbnails" aria-label="Toggle slide thumbnails" onClick={() => setSidebar(s => !s)}>{sidebar ? <PanelLeftClose /> : <PanelLeftOpen />}</Button>
      <Button size="icon" variant={grid ? "default" : "outline"} title="Slide overview" aria-label="Slide overview" onClick={() => setGrid(g => !g)}><Grid2X2 /></Button>
      <Button size="icon" variant={notesOpen ? "default" : "outline"} title="Speaker notes" aria-label="Speaker notes" onClick={() => setNotesOpen(n => !n)}><NotebookPen /></Button>
      <Button size="icon" variant="outline" title="Export PDF" aria-label="Export PDF" onClick={() => window.open(`${window.location.pathname}?print`, "_blank")}><Printer /></Button>
      <Button size="icon" variant="outline" title="Presenter view" aria-label="Presenter view" onClick={() => window.open(`${window.location.pathname}?presenter&slide=${index + 1}`, "_blank")}><Monitor /></Button>
      <Button className="workshop-present-button" title="Present fullscreen" aria-label="Present fullscreen" onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}><Maximize /><span>Present</span></Button>
    </div></header>}
    <div className="workshop-workspace">
      {sidebar && !fullscreen && !presenter && <aside className="workshop-sidebar" aria-label="Slide thumbnails">{workshopDeck.map((slide, i) => <Button key={i} variant="outline" className={`workshop-thumbnail ${index === i ? "workshop-thumbnail-selected" : ""}`} onClick={() => { goTo(i); setGrid(false); }} aria-label={`Open slide ${i + 1}: ${slide.title}`}><div className="workshop-thumbnail-image"><ScaledSlide><WorkshopSlide index={i} /></ScaledSlide></div><span>{String(i + 1).padStart(2, "0")}<span className="truncate">{slide.title}</span></span></Button>)}</aside>}
      <main className="workshop-canvas-area">
        {grid ? <div className="workshop-overview">{workshopDeck.map((slide, i) => <Button variant="outline" key={i} className="workshop-overview-item" onClick={() => { goTo(i); setGrid(false); }} aria-label={`Go to slide ${i + 1}`}><div className="workshop-thumbnail-image"><ScaledSlide><WorkshopSlide index={i} /></ScaledSlide></div><span>{i + 1}. {slide.title}</span></Button>)}</div> : <div className="workshop-canvas" onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={e => { const start = touch.current; if (!start) return; const dx = e.changedTouches[0].clientX - start.x; const dy = e.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goTo(index + (dx < 0 ? 1 : -1)); touch.current = null; }}><ScaledSlide><WorkshopSlide index={index} /></ScaledSlide></div>}
        {presenter && <div className="workshop-presenter-panel"><div className="workshop-next"><ScaledSlide><WorkshopSlide index={Math.min(index + 1, 28)} /></ScaledSlide></div><div><span className="font-display text-xl tabular-nums">{Math.floor(seconds / 60).toString().padStart(2, "0")}:{(seconds % 60).toString().padStart(2, "0")}</span><p className="whitespace-pre-wrap mt-4">{note}</p></div></div>}
        {notesOpen && !fullscreen && <section className="workshop-notes"><label htmlFor="speaker-notes" className="text-xs font-semibold text-muted-foreground">Speaker notes</label><textarea id="speaker-notes" value={note} onChange={e => { const value = { ...notes, [index]: e.target.value }; setNotes(value); localStorage.setItem("vcw-workshop-notes", JSON.stringify(value)); }} /></section>}
      </main>
    </div>
    <footer className="workshop-controls"><Button size="icon" variant="outline" aria-label="Previous slide" title="Previous slide" disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronLeft /></Button><span className="tabular-nums text-sm">{index + 1} <span className="text-muted-foreground">/ 29</span></span><Button size="icon" variant="outline" aria-label="Next slide" title="Next slide" disabled={index === 28} onClick={() => goTo(index + 1)}><ChevronRight /></Button>{fullscreen && <Button size="icon" variant="outline" aria-label="Exit fullscreen" title="Exit fullscreen" onClick={() => document.exitFullscreen?.()}><Minimize /></Button>}</footer>
  </div>;
}