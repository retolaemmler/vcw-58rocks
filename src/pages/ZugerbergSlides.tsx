import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

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

const splitCount = (rows: SurveyResponse[], key: keyof SurveyResponse) => {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const raw = (r[key] as string | null) ?? "";
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const simpleCount = (rows: SurveyResponse[], key: keyof SurveyResponse) => {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const v = ((r[key] as string | null) ?? "").trim();
    if (!v) return;
    map.set(v, (map.get(v) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
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
  data, color, max,
}: { data: { name: string; value: number }[]; color: string; max: number }) => (
  <div className="flex flex-col gap-6">
    {data.map((d) => (
      <div key={d.name} className="flex items-center gap-8">
        <div className="w-[620px] text-[34px] leading-tight text-right shrink-0">{d.name}</div>
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

const ChartBox = ({ title, data, color }: { title: string; data: { name: string; value: number }[]; color: string }) => (
  <div className="flex-1 flex flex-col">
    <h3 className="text-[36px] font-bold mb-6">{title}</h3>
    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} vertical={false} />
          <XAxis dataKey="name" fontSize={20} interval={0} tickMargin={12} height={90}
            tick={{ width: 220 }} angle={-12} textAnchor="end" />
          <YAxis allowDecimals={false} fontSize={22} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
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

  const aiData = useMemo(() => simpleCount(data, "ai_coding_experience"), [data]);
  const lovableData = useMemo(() => simpleCount(data, "lovable_experience"), [data]);
  const goals = useMemo(() => splitCount(data, "workshop_goals").slice(0, 6), [data]);
  const success = useMemo(() => splitCount(data, "success_criteria").slice(0, 6), [data]);
  const blocks = useMemo(() => splitCount(data, "building_blocks").slice(0, 8), [data]);
  const ideas = useMemo(
    () =>
      data
        .filter((r) => r.has_app_idea && r.app_idea_description?.trim())
        .map((r) => shorten(r.app_idea_description!.replace(/\s+/g, " ").trim()))
        .slice(0, 4),
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
          Zugerberg Finanz × Vibe Code Workshop
        </p>
        <h1 className="text-[128px] leading-[1.02] font-bold font-display tracking-tight max-w-[1500px]">
          Willkommen im Vibe Coding Workshop
        </h1>
        <p className="text-[40px] mt-12 text-white/70">
          {dayFilter === "all" ? `${DAY_1} & ${DAY_2}` : dayFilter} · {total} Teilnehmende
        </p>
      </div>
      <p className="text-[24px] text-white/50">Basierend auf euren Antworten aus dem Prep Survey</p>
    </Slide>,

    /* 2 — Wer ist im Raum */
    <Slide key="room">
      <SlideTitle kicker="Prep Survey">Wer ist im Raum?</SlideTitle>
      <div className="flex gap-10">
        <Stat value={String(total)} label="ausgefüllte Prep Surveys" color={TEAL} />
        <Stat value={`${day1} / ${day2}`} label={`${DAY_1} / ${DAY_2}`} color={VIOLET} />
        <Stat
          value={total ? `${Math.round((withIdea / total) * 100)}%` : "—"}
          label={`haben bereits eine konkrete App-Idee (${withIdea} von ${total})`}
          color={CYAN}
        />
      </div>
    </Slide>,

    /* 3 — Erfahrung */
    <Slide key="exp">
      <SlideTitle kicker="Erfahrungslevel">Wo ihr heute steht</SlideTitle>
      <div className="flex-1 flex gap-20 min-h-0">
        <ChartBox title="AI Coding Erfahrung" data={aiData} color={TEAL} />
        <ChartBox title="Lovable Erfahrung" data={lovableData} color={VIOLET} />
      </div>
      <p className="text-[34px] mt-10 text-muted-foreground">
        {beginners} von {total} haben AI Coding noch nie ausprobiert — genau dafür ist heute da.
      </p>
    </Slide>,

    /* 4 — Ziele */
    <Slide key="goals">
      <SlideTitle kicker="Eure Antworten">Was ihr euch vornehmt</SlideTitle>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <RankingBars data={goals} color={TEAL} max={goals[0]?.value ?? 1} />
        </div>
      </div>
    </Slide>,

    /* 5 — Erfolg */
    <Slide key="success">
      <SlideTitle kicker="Eure Antworten">Woran wir Erfolg messen</SlideTitle>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <RankingBars data={success} color={VIOLET} max={success[0]?.value ?? 1} />
        </div>
      </div>
    </Slide>,

    /* 6 — Ideen */
    <Slide key="ideas">
      <SlideTitle kicker="Anonymisiert">Eure App-Ideen</SlideTitle>
      <div className="grid grid-cols-2 gap-10 flex-1 content-start">
        {ideas.map((t, i) => (
          <div key={i} className="rounded-3xl border-2 border-border bg-muted/40 p-12">
            <p className="text-[30px] leading-snug">„{t}“</p>
          </div>
        ))}
      </div>
      <p className="text-[32px] text-muted-foreground mt-8">
        {total - withIdea} von {total} starten noch ohne fixe Idee — wir finden sie gemeinsam.
      </p>
    </Slide>,

    /* 7 — Building Blocks */
    <Slide key="blocks">
      <SlideTitle kicker="Technische Bausteine">Was ihr bauen wollt</SlideTitle>
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <RankingBars data={blocks} color={CYAN} max={blocks[0]?.value ?? 1} />
        </div>
      </div>
    </Slide>,

    /* 8 — Los geht's */
    <Slide dark key="go">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-[112px] leading-[1.05] font-bold font-display tracking-tight">Los geht's</h2>
        <div className="mt-16 space-y-8 text-[40px] text-white/80">
          <p>1 — Idee schärfen</p>
          <p>2 — Bauen mit Lovable</p>
          <p>3 — Testen &amp; verfeinern</p>
          <p>4 — Zeigen, was ihr gebaut habt</p>
        </div>
      </div>
      <p className="text-[30px] text-[#4fd1c5]">Am Ende des Tages hat jede und jeder eine laufende App.</p>
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
