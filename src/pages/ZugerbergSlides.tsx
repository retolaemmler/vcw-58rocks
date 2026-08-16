import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Maximize } from "lucide-react";
interface SurveyResponse {
  id: string;
  ai_coding_experience: string | null;
  lovable_experience: string | null;
  attendance_day: string | null;
  workshop_goals: string | null;
  success_criteria: string | null;
  has_app_idea: boolean;
  app_idea_description: string | null;
  building_blocks: string | null;
}

const KIND = "zugerberg_prep";
const DAY_1 = "Donnerstag, 20. August";
const DAY_2 = "Dienstag, 8. September";

const TEAL = "hsl(var(--primary))";
const VIOLET = "#8b5cf6";
const CYAN = "#06b6d4";

const AI_OPTIONS = [
  "Noch nie ausprobiert",
  "Ein bisschen herumgespielt, nichts Ernsthaftes",
  "Schon eine App gebaut und veröffentlicht",
];
const LOVABLE_OPTIONS = [
  "Davon gehört",
  "Eine Demo gesehen",
  "Ein wenig damit experimentiert",
  "Etwas Echtes damit gebaut",
];
const GOAL_CHIPS = [
  "Meine erste App bauen",
  "Eine Idee schnell prototypisieren",
  "Verstehen, was möglich ist",
  "Mit anderen Builders vernetzen",
  "Spass haben 🎉",
];
const SUCCESS_CHIPS = [
  "Mit einer funktionierenden App nach Hause gehen",
  "Lovable selbständig nutzen können",
  "Klare Roadmap für mein Projekt",
  "Neue Kontakte geknüpft",
  "Neues Mindset zum Coden",
];
const BLOCK_CHIPS = [
  "E-Mail",
  "Zahlungen (z.B. Stripe)",
  "Benutzer-Login",
  "CRM (z.B. HubSpot)",
  "Buchhaltung (z.B. Bexio)",
  "Datenbank / Speicher",
  "Datei-Uploads",
  "Karten / Standort",
  "Kalender",
  "API-Integrationen",
  "KI-Funktionen (z.B. OpenAI)",
];

const sortDesc = (map: Map<string, number>) =>
  Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

/** Counts multi-select answers by matching known chip options first,
 *  so option labels containing commas stay intact. */
const splitCount = (rows: SurveyResponse[], key: keyof SurveyResponse, chips: string[]) => {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    let raw = ((r[key] as string | null) ?? "").trim();
    if (!raw) return;
    chips.forEach((chip) => {
      if (raw.includes(chip)) {
        map.set(chip, (map.get(chip) ?? 0) + 1);
        raw = raw.split(chip).join(" | ");
      }
    });
    raw
      .split(/[|,;\n]/)
      .map((s) => s.trim().replace(/^[-–•]\s*/, ""))
      .filter((s) => s.length > 3)
      .forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
  });
  return sortDesc(map);
};

/** Single-choice answers may carry free-text details after the chip; group by chip. */
const simpleCount = (rows: SurveyResponse[], key: keyof SurveyResponse, options: string[]) => {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const v = ((r[key] as string | null) ?? "").trim();
    if (!v) return;
    const chip = options.find((o) => v.startsWith(o)) ?? v;
    map.set(chip, (map.get(chip) ?? 0) + 1);
  });
  return sortDesc(map);
};

const shorten = (s: string, n = 260) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

/* ---------- layout primitives ---------- */

const Slide = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <div
    className={`w-[1920px] h-[1080px] relative overflow-hidden px-[120px] py-[90px] flex flex-col ${
      dark ? "bg-[#0d1b2a] text-white" : "bg-white text-foreground"
    }`}
  >
    {children}
  </div>
);

const SlideTitle = ({ children, kicker }: { children: React.ReactNode; kicker?: string }) => (
  <div className="mb-[56px]">
    {kicker && (
      <p className="text-[22px] tracking-[0.16em] uppercase font-semibold text-primary mb-4">{kicker}</p>
    )}
    <h2 className="text-[80px] leading-[1.05] font-bold font-display tracking-tight">{children}</h2>
  </div>
);

const RankingBars = ({
  data, color, max, labelWidth = 620, fontSize = 34,
}: { data: { name: string; value: number }[]; color: string; max: number; labelWidth?: number; fontSize?: number }) => (
  <div className="flex flex-col gap-6">
    {data.map((d) => (
      <div key={d.name} className="flex items-center gap-8">
        <div
          className="leading-tight text-right shrink-0"
          style={{ width: labelWidth, fontSize }}
        >{d.name}</div>
        <div className="flex-1 flex items-center gap-6">
          <div
            className="h-[46px] rounded-r-lg"
            style={{ width: `${Math.max((d.value / max) * 100, 3)}%`, background: color }}
          />
          <span className="text-[34px] font-bold tabular-nums">{d.value}</span>
        </div>
      </div>
    ))}
  </div>
);

const Stat = ({ value, label, color }: { value: string; label: string; color: string }) => (
  <div className="flex-1 rounded-3xl border-2 border-border bg-muted/40 px-12 py-14">
    <p className="text-[128px] leading-none font-bold font-display" style={{ color }}>{value}</p>
    <p className="text-[32px] mt-6 text-muted-foreground leading-snug">{label}</p>
  </div>
);

/* ---------- page ---------- */

const ZugerbergSlides = () => {
  const [rows, setRows] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [dayFilter, setDayFilter] = useState<"all" | typeof DAY_1 | typeof DAY_2>("all");
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: token } = await supabase
        .from("survey_tokens").select("id").eq("kind", KIND).limit(1).maybeSingle();
      if (token) {
        const { data } = await supabase
          .from("survey_responses").select("*").eq("token_id", token.id)
          .order("created_at", { ascending: false });
        if (data) setRows(data as unknown as SurveyResponse[]);
      }
      setLoading(false);
    })();
  }, []);

  useLayoutEffect(() => {
    const fit = () => {
      const el = stageRef.current;
      if (!el) return;
      setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [loading]);

  const data = useMemo(
    () => (dayFilter === "all" ? rows : rows.filter((r) => r.attendance_day === dayFilter)),
    [rows, dayFilter],
  );

  const total = data.length;
  const day1 = rows.filter((r) => r.attendance_day === DAY_1).length;
  const day2 = rows.filter((r) => r.attendance_day === DAY_2).length;
  const withIdea = data.filter((r) => r.has_app_idea).length;

  const aiData = useMemo(
    () => simpleCount(data, "ai_coding_experience", AI_OPTIONS).slice(0, 5).map((d) => ({ ...d, name: shorten(d.name, 42) })),
    [data],
  );
  const lovableData = useMemo(
    () => simpleCount(data, "lovable_experience", LOVABLE_OPTIONS).slice(0, 5).map((d) => ({ ...d, name: shorten(d.name, 42) })),
    [data],
  );
  const goals = useMemo(() => splitCount(data, "workshop_goals", GOAL_CHIPS).slice(0, 6), [data]);
  const success = useMemo(() => splitCount(data, "success_criteria", SUCCESS_CHIPS).slice(0, 6), [data]);
  const blocks = useMemo(() => splitCount(data, "building_blocks", BLOCK_CHIPS).slice(0, 8), [data]);
  // Feature the richer, multi-idea responses first so the slide leads with
  // a concrete example (e.g. the RACI / Cyber-Schulung quote) instead of a
  // short one-liner. Longer, multi-idea answers stay legible.
  const FEATURE_IDEA =
    "drei Unterschiedliche Ideen - eine gamifizierte online Cyber Schulung entwerfen. - RACI Matrizen aus Weisungen extrahieren und über alle Weisungen hinweg zusammenfügen. -…";
  const ideas = useMemo(
    () => {
      const cleaned = data
        .filter((r) => r.has_app_idea && r.app_idea_description?.trim())
        .map((r) => r.app_idea_description!.replace(/\s+/g, " ").trim());
      // Surface the feature example first if present, then the rest by length.
      const normalized = (s: string) => s.replace(/\u00ad/g, "").replace(/\s+/g, " ").trim();
      const hasFeature = cleaned.some((s) => s.toLowerCase().includes("raci"));
      const rest = cleaned
        .filter((s) => !s.toLowerCase().includes("raci"))
        .sort((a, b) => b.length - a.length)
        .map((s) => shorten(s, 200));
      return hasFeature ? [shorten(FEATURE_IDEA, 320), ...rest.slice(0, 3)] : rest.slice(0, 4);
    },
    [data],
  );

  const beginners = data.filter((r) =>
    (r.ai_coding_experience ?? "").toLowerCase().startsWith("noch nie"),
  ).length;

  const slides: React.ReactNode[] = [
    /* 1 — Titel */
    <Slide dark key="title">
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[26px] tracking-[0.22em] uppercase text-[#4fd1c5] font-semibold mb-10">
          Briefing für Zugerberg Finanz
        </p>
        <h1 className="text-[112px] leading-[1.02] font-bold font-display tracking-tight max-w-[1500px]">
          Vibe Coding Workshop — Standortbestimmung vor der Durchführung
        </h1>
        <p className="text-[40px] mt-12 text-white/70">
          {dayFilter === "all" ? `${DAY_1} & ${DAY_2}` : dayFilter} · {total} Antworten aus dem Prep Survey
        </p>
      </div>
      <p className="text-[24px] text-white/50">Auswertung der Teilnehmenden-Befragung · Stand heute</p>
    </Slide>,

    /* 2 — Teilnehmende */
    <Slide key="room">
      <SlideTitle kicker="Ausgangslage">Wer nimmt teil?</SlideTitle>
      <div className="flex gap-10">
        <Stat value={String(total)} label="ausgefüllte Prep Surveys" color={TEAL} />
        <Stat value={`${day1} / ${day2}`} label={`Verteilung ${DAY_1} / ${DAY_2}`} color={VIOLET} />
        <Stat
          value={total ? `${Math.round((withIdea / total) * 100)}%` : "—"}
          label={`kommen mit einer konkreten App-Idee (${withIdea} von ${total})`}
          color={CYAN}
        />
      </div>
      <p className="text-[32px] mt-12 text-muted-foreground">
        Beide Durchführungen laufen mit identischem Setup und identischem Coaching-Team.
      </p>
    </Slide>,

    /* 3 — Erfahrung */
    <Slide key="exp">
      <SlideTitle kicker="Erfahrungslevel">Vorkenntnisse im Team</SlideTitle>
      <div className="flex-1 flex gap-24 min-h-0">
        <div className="flex-1">
          <h3 className="text-[36px] font-bold mb-10">AI Coding Erfahrung</h3>
          <RankingBars data={aiData} color={TEAL} max={aiData[0]?.value ?? 1} labelWidth={330} fontSize={26} />
        </div>
        <div className="flex-1">
          <h3 className="text-[36px] font-bold mb-10">Lovable Erfahrung</h3>
          <RankingBars data={lovableData} color={VIOLET} max={lovableData[0]?.value ?? 1} labelWidth={330} fontSize={26} />
        </div>
      </div>
      <p className="text-[34px] mt-10 text-muted-foreground">
        {beginners} von {total} haben AI Coding noch nie ausprobiert — der Einstieg ist entsprechend niederschwellig.
      </p>
    </Slide>,

    /* 4 — Ziele */
    <Slide key="goals">
      <SlideTitle kicker="Erwartungen der Teilnehmenden">Was sich das Team vornimmt</SlideTitle>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <RankingBars data={goals} color={TEAL} max={goals[0]?.value ?? 1} />
        </div>
      </div>
    </Slide>,

    /* 5 — Erfolg */
    <Slide key="success">
      <SlideTitle kicker="Erfolgskriterien">Woran der Workshop gemessen wird</SlideTitle>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <RankingBars data={success} color={VIOLET} max={success[0]?.value ?? 1} />
        </div>
      </div>
    </Slide>,

    /* 6 — Ideen */
    <Slide key="ideas">
      <SlideTitle kicker="Anonymisierte Auszüge">Eingereichte App-Ideen</SlideTitle>
      <div className="grid grid-cols-2 gap-10 flex-1 content-start overflow-hidden">
        {ideas.map((t, i) => (
          <div key={i} className="rounded-3xl border-2 border-border bg-muted/40 p-10">
            <p className="text-[28px] leading-snug">„{t}“</p>
          </div>
        ))}
      </div>
      <p className="text-[30px] text-muted-foreground mt-8 shrink-0">
        {total - withIdea} von {total} kommen noch ohne fixe Idee — dafür ist ein geführter Ideation-Block eingeplant.
      </p>
    </Slide>,

    /* 7 — Building Blocks */
    <Slide key="blocks">
      <SlideTitle kicker="Technische Bausteine">Bausteine, die das Team nutzen möchte</SlideTitle>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <RankingBars data={blocks} color={CYAN} max={blocks[0]?.value ?? 1} />
        </div>
      </div>
    </Slide>,

    /* 8 — Ableitungen */
    <Slide key="implications">
      <SlideTitle kicker="Unsere Ableitungen">Was das für die Durchführung bedeutet</SlideTitle>
      <div className="grid grid-cols-2 gap-8 flex-1 content-start">
        <div className="rounded-3xl border-2 border-border bg-muted/40 p-9">
          <p className="text-[30px] leading-snug">
            <strong>Einstieg ohne Vorwissen.</strong> Start auf Beginner ausgelegt, Erfahrene erhalten optionale
            Zusatzaufgaben.
          </p>
        </div>
        <div className="rounded-3xl border-2 border-border bg-muted/40 p-9">
          <p className="text-[30px] leading-snug">
            <strong>Ideation vorgeschaltet.</strong> Teilnehmende ohne Idee kommen zeitgleich mit allen anderen ins
            Bauen.
          </p>
        </div>
        <div className="rounded-3xl border-2 border-border bg-muted/40 p-9">
          <p className="text-[30px] leading-snug">
            <strong>Fokus auf gefragte Bausteine.</strong> Demos und Vorlagen richten sich nach den meistgenannten
            Integrationen.
          </p>
        </div>
        <div className="rounded-3xl border-2 border-border bg-muted/40 p-9">
          <p className="text-[30px] leading-snug">
            <strong>Betreuung.</strong> 2–3 Coaches vor Ort sichern individuelle Unterstützung an beiden Tagen.
          </p>
        </div>
      </div>
    </Slide>,

    /* 9 — Ablauf & offene Punkte */
    <Slide dark key="go">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-[96px] leading-[1.05] font-bold font-display tracking-tight">Ablauf &amp; nächste Schritte</h2>
        <div className="mt-14 space-y-7 text-[38px] text-white/80">
          <p>1 — Kickoff &amp; Ideation</p>
          <p>2 — Bauen mit Lovable, begleitet durch die Coaches</p>
          <p>3 — Testen &amp; verfeinern</p>
          <p>4 — Abschlussrunde: jede Person zeigt ihre App</p>
        </div>
      </div>
      <p className="text-[30px] text-[#4fd1c5]">
        Offen für die Abstimmung: Raum &amp; Technik, Verpflegung, Foto- und Kommunikationsfreigabe.
      </p>
    </Slide>,
  ];

  const count = slides.length;
  const go = useCallback((d: number) => setIndex((i) => Math.min(Math.max(i + d, 0), count - 1)), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <p className="text-lg text-muted-foreground max-w-md">
          Keine Survey-Daten geladen. Bitte zuerst im Admin-Bereich anmelden und diese Seite erneut öffnen.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-neutral-900 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 text-white/80 text-sm shrink-0">
        <div className="flex gap-2">
          {(["all", DAY_1, DAY_2] as const).map((d) => (
            <Button
              key={d}
              size="sm"
              variant={dayFilter === d ? "default" : "outline"}
              className={dayFilter === d ? "" : "bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white"}
              onClick={() => { setDayFilter(d); setIndex(0); }}
            >
              {d === "all" ? "Alle" : d}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white"
          onClick={() => document.documentElement.requestFullscreen?.()}
        >
          <Maximize className="w-4 h-4 mr-1" /> Vollbild
        </Button>
      </div>

      <div ref={stageRef} className="relative flex-1 overflow-hidden" onClick={() => go(1)}>
        <div
          className="absolute left-1/2 top-1/2 w-[1920px] h-[1080px] -ml-[960px] -mt-[540px] shadow-2xl"
          style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
        >
          {slides[index]}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 py-3 text-white/70 shrink-0">
        <Button size="icon" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white" onClick={() => go(-1)} disabled={index === 0}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="tabular-nums text-sm">{index + 1} / {count}</span>
        <Button size="icon" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white" onClick={() => go(1)} disabled={index === count - 1}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ZugerbergSlides;
