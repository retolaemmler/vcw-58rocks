import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Copy, ClipboardCheck, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToXlsx } from "@/lib/exportXlsx";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

interface SurveyResponse {
  id: string;
  email: string | null;
  participant_name: string | null;
  ai_coding_experience: string;
  lovable_experience: string;
  workshop_goals: string;
  success_criteria: string;
  has_app_idea: boolean;
  app_idea_description: string | null;
  app_audience: string | null;
  building_blocks: string;
  dietary: string;
  poke_bowl: string | null;
  anything_else: string | null;
  created_at: string;
}

const KIND = "masterclass_june30_prep";
const SURVEY_PATH = "/masterclass-june30-prep";

const MasterclassJune30SurveyAdmin = () => {
  const [surveyLink, setSurveyLink] = useState<string | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: tokenRow } = await supabase
      .from("survey_tokens")
      .select("id, token")
      .eq("kind", KIND)
      .limit(1)
      .maybeSingle();

    let tokenId: string | null = null;
    if (tokenRow) {
      setSurveyLink(`${window.location.origin}${SURVEY_PATH}`);
      tokenId = tokenRow.id;
    }

    if (tokenId) {
      const { data: resps } = await supabase
        .from("survey_responses")
        .select("*")
        .eq("token_id", tokenId)
        .order("created_at", { ascending: false });
      if (resps) setResponses(resps as unknown as SurveyResponse[]);
    }

    setLoading(false);
  };

  const copyLink = () => {
    if (!surveyLink) return;
    navigator.clipboard.writeText(surveyLink);
    setCopied(true);
    toast({ title: "Copied!", description: "Survey link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteResponse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this response?")) return;
    const { error } = await supabase.from("survey_responses").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete response", variant: "destructive" });
    } else {
      setResponses((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Response removed" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const countBy = (fn: (r: SurveyResponse) => string | null | undefined) => {
    const map = new Map<string, number>();
    for (const r of responses) {
      const v = (fn(r) || "—").toString().trim() || "—";
      map.set(v, (map.get(v) || 0) + 1);
    }
    return Array.from(map, ([name, value]) => ({ name, value }));
  };

  const aiData = countBy((r) => r.ai_coding_experience);
  const lovableData = countBy((r) => r.lovable_experience);
  const ideaData = countBy((r) => (r.has_app_idea ? "Yes" : "No"));
  const pokeData = countBy((r) => r.poke_bowl);
  const blockData = (() => {
    const map = new Map<string, number>();
    for (const r of responses) {
      const raw = (r.building_blocks || "").split(/[,;]/).map((s) => s.trim()).filter(Boolean);
      for (const v of raw) map.set(v, (map.get(v) || 0) + 1);
    }
    return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  })();

  const palette = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--muted-foreground))", "hsl(var(--destructive))", "hsl(var(--ring))"];

  const ChartCard = ({ title, data }: { title: string; data: { name: string; value: number }[] }) => (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data</p>
        ) : (
          <ChartContainer config={{ value: { label: "Responses", color: "hsl(var(--primary))" } }} className="h-[240px] w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" /> Edition 2 Prep Survey Link
          </CardTitle>
        </CardHeader>
        {surveyLink && (
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted p-3 rounded text-sm break-all">{surveyLink}</code>
              <Button variant="outline" size="icon" onClick={copyLink}>
                {copied ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {responses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="AI Coding Experience" data={aiData} />
          <ChartCard title="Lovable Experience" data={lovableData} />
          <ChartCard title="Has App Idea" data={ideaData} />
          <ChartCard title="Poke Bowl Preference" data={pokeData} />
          <div className="md:col-span-2"><ChartCard title="Building Blocks" data={blockData} /></div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Responses ({responses.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={!responses.length}
            onClick={() => exportToXlsx(responses, "edition2-survey", "Edition 2 Prep Survey")}
          >
            <Download className="w-4 h-4 mr-1" /> Export XLSX
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>AI Experience</TableHead>
                  <TableHead>Lovable Experience</TableHead>
                  <TableHead>App Idea</TableHead>
                  <TableHead>Poke Bowl</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((r) => (
                  <>
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                      <TableCell className="whitespace-nowrap text-sm">{new Date(r.created_at).toLocaleDateString("de-CH")}</TableCell>
                      <TableCell className="text-sm">{r.email || r.participant_name || "—"}</TableCell>
                      <TableCell className="text-sm"><Badge variant="outline" className="whitespace-nowrap">{r.ai_coding_experience || "—"}</Badge></TableCell>
                      <TableCell className="text-sm"><Badge variant="outline" className="whitespace-nowrap">{r.lovable_experience || "—"}</Badge></TableCell>
                      <TableCell><Badge variant={r.has_app_idea ? "default" : "outline"}>{r.has_app_idea ? "Yes" : "No"}</Badge></TableCell>
                      <TableCell className="capitalize text-sm">{r.poke_bowl || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">{expandedRow === r.id ? "Hide" : "Show"}</Button>
                          <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); deleteResponse(r.id); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRow === r.id && (
                      <TableRow key={`${r.id}-detail`}>
                        <TableCell colSpan={7}>
                          <div className="grid gap-3 p-4 bg-muted/50 rounded-lg text-sm">
                            <div><strong>AI Coding Experience:</strong> {r.ai_coding_experience || "—"}</div>
                            <div><strong>Lovable Experience:</strong> {r.lovable_experience || "—"}</div>
                            <div><strong>Workshop Goals:</strong> {r.workshop_goals || "—"}</div>
                            <div><strong>Success Criteria:</strong> {r.success_criteria || "—"}</div>
                            {r.app_idea_description && (
                              <div><strong>{r.has_app_idea ? "App Idea" : "Exploration Areas"}:</strong> {r.app_idea_description}</div>
                            )}
                            {r.has_app_idea && r.app_audience && (<div><strong>Audience:</strong> {r.app_audience}</div>)}
                            <div><strong>Building Blocks:</strong> {r.building_blocks || "—"}</div>
                            <div><strong>Poke Bowl:</strong> {r.poke_bowl || "—"}</div>
                            {r.anything_else && <div><strong>Other:</strong> {r.anything_else}</div>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {responses.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No responses yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterclassJune30SurveyAdmin;