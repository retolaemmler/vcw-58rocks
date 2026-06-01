import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Lightbulb, Sparkles } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";

interface SurveyResponse {
  id: string;
  email: string | null;
  participant_name: string | null;
  ai_coding_experience: string;
  lovable_experience: string;
  attendance_day: string | null;
  workshop_goals: string;
  success_criteria: string;
  has_app_idea: boolean;
  app_idea_description: string | null;
  app_audience: string | null;
  building_blocks: string;
  anything_else: string | null;
  created_at: string;
}

const KIND = "raiffeisen_prep";
const COLORS = ["hsl(var(--primary))", "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#ec4899"];

const countBy = <T,>(arr: T[], fn: (x: T) => string | null | undefined) => {
  const map = new Map<string, number>();
  arr.forEach((x) => {
    const k = fn(x);
    if (!k) return;
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
};

const DAY_LABELS: Record<string, string> = {
  day1: "Freitag, 29.5.",
  day2: "Montag, 1.6.",
};

const RaiffeisenDashboard = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: token } = await supabase
        .from("survey_tokens")
        .select("id")
        .eq("kind", KIND)
        .limit(1)
        .maybeSingle();
      if (token) {
        const { data } = await supabase
          .from("survey_responses")
          .select("*")
          .eq("token_id", token.id)
          .order("created_at", { ascending: false });
        if (data) setResponses(data as SurveyResponse[]);
      }
      setLoading(false);
    })();
  }, []);

  const dayData = useMemo(
    () => countBy(responses, (r) => (r.attendance_day ? DAY_LABELS[r.attendance_day] ?? r.attendance_day : null)),
    [responses],
  );
  const aiData = useMemo(() => countBy(responses, (r) => r.ai_coding_experience), [responses]);
  const lovableData = useMemo(() => countBy(responses, (r) => r.lovable_experience), [responses]);
  const ideaData = useMemo(
    () => [
      { name: "Hat Idee", value: responses.filter((r) => r.has_app_idea).length },
      { name: "Noch keine Idee", value: responses.filter((r) => !r.has_app_idea).length },
    ],
    [responses],
  );
  const blocksData = useMemo(() => countBy(responses, (r) => r.building_blocks), [responses]);

  const total = responses.length;
  const withIdea = responses.filter((r) => r.has_app_idea).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Noch keine Antworten aus dem Raiffeisen Prep Survey.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teilnehmende</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-display">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mit App-Idee</CardTitle>
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-display">
              {withIdea}
              <span className="text-base text-muted-foreground ml-2">
                ({Math.round((withIdea / total) * 100)}%)
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Antworten</CardTitle>
            <Sparkles className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-display">{total}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Teilnahme-Tag</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dayData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {dayData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">App-Idee</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ideaData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {ideaData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">AI Coding Erfahrung</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Lovable Erfahrung</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lovableData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Building Blocks</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blocksData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Teilnehmende</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Tag</th>
                  <th className="py-2 pr-4">AI</th>
                  <th className="py-2 pr-4">Lovable</th>
                  <th className="py-2 pr-4">Idee</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{r.participant_name || "—"}</td>
                    <td className="py-2 pr-4">{r.email || "—"}</td>
                    <td className="py-2 pr-4">{r.attendance_day ? DAY_LABELS[r.attendance_day] ?? r.attendance_day : "—"}</td>
                    <td className="py-2 pr-4">{r.ai_coding_experience}</td>
                    <td className="py-2 pr-4">{r.lovable_experience}</td>
                    <td className="py-2 pr-4">{r.has_app_idea ? (r.app_idea_description?.slice(0, 60) ?? "Ja") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RaiffeisenDashboard;