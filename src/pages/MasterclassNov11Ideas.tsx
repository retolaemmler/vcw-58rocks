import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lightbulb } from "lucide-react";
import logo from "@/assets/vcw-logo.png";

interface IdeaRow {
  id: string;
  created_at: string;
  has_app_idea: boolean;
  app_idea_description: string | null;
  app_audience: string | null;
  building_blocks: string | null;
}

/* Post-it palette — classic sticky-note pastels */
const NOTE_COLORS = [
  { bg: "#fff7ae", tape: "rgba(244, 180, 60, 0.55)", text: "#4a3f10" },
  { bg: "#ffd6e0", tape: "rgba(230, 120, 150, 0.5)", text: "#5c2333" },
  { bg: "#d3ecff", tape: "rgba(110, 160, 220, 0.5)", text: "#1d3a5c" },
  { bg: "#d9f7d4", tape: "rgba(120, 190, 110, 0.5)", text: "#234d1e" },
  { bg: "#ffe8c2", tape: "rgba(230, 170, 90, 0.5)", text: "#5c3d14" },
  { bg: "#eadcff", tape: "rgba(160, 120, 220, 0.45)", text: "#3d2660" },
];

/** Deterministic pseudo-random from the row id so layout is stable across renders. */
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const PostIt = ({ row, index }: { row: IdeaRow; index: number }) => {
  const h = hash(row.id);
  const color = NOTE_COLORS[h % NOTE_COLORS.length];
  const rotate = ((h % 7) - 3) * 1.1; // -3.3° .. +3.3°
  const idea = row.app_idea_description!.replace(/\s+/g, " ").trim();

  return (
    <div
      className="relative break-inside-avoid mb-8 transition-transform duration-200 hover:scale-[1.03] hover:rotate-0 hover:z-10"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* tape strip */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 rounded-sm z-10"
        style={{ background: color.tape, transform: `translateX(-50%) rotate(${-rotate * 1.6}deg)` }}
      />
      <div
        className="rounded-sm p-6 pt-8 min-h-[180px] flex flex-col"
        style={{
          background: color.bg,
          color: color.text,
          boxShadow: "0 10px 24px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)",
        }}
      >
        <p className="text-lg leading-snug font-medium flex-1">„{idea}“</p>
        <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide opacity-70">
          <span>{row.app_audience === "internal" ? "Interne App" : "Öffentliche App"}</span>
          <span>#{index + 1}</span>
        </div>
      </div>
    </div>
  );
};

const MasterclassNov11Ideas = () => {
  const [rows, setRows] = useState<IdeaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.functions.invoke("mc-nov11-ideas-data");
      if (data?.rows) setRows(data.rows as IdeaRow[]);
      setLoading(false);
    })();
  }, []);

  const ideas = useMemo(
    () => rows.filter((r) => r.has_app_idea && r.app_idea_description?.trim()),
    [rows],
  );

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-foreground">
      {/* header */}
      <header className="max-w-6xl mx-auto px-6 pt-10 pb-8 flex items-center gap-4">
        <img src={logo} alt="Vibe Coding Workshop" className="h-10 w-auto" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
            App-Ideen · Masterclass 11.11.26
          </h1>
          <p className="text-sm text-muted-foreground">
            Anonymisierte Ideen aus der Vorbereitungs-Umfrage
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-24">
            <Lightbulb className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Noch keine Ideen eingereicht — die Pinnwand füllt sich, sobald die Teilnehmenden die Umfrage ausfüllen.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">
              {ideas.length} {ideas.length === 1 ? "Idee" : "Ideen"} auf der Pinnwand
            </p>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8">
              {ideas.map((row, i) => (
                <PostIt key={row.id} row={row} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MasterclassNov11Ideas;
