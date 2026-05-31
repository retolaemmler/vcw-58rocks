import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Copy, ClipboardCheck, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToXlsx } from "@/lib/exportXlsx";

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
const SURVEY_PATH = "/raiffeisen-prep";

const RaiffeisenSurveyAdmin = () => {
  const [surveyLink, setSurveyLink] = useState<string | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: tokens } = await supabase
      .from("survey_tokens")
      .select("id, token")
      .eq("kind", KIND)
      .limit(1)
      .maybeSingle();

    let tokenId: string | null = null;
    if (tokens) {
      setSurveyLink(`${window.location.origin}${SURVEY_PATH}?token=${tokens.token}`);
      tokenId = tokens.id;
    }

    if (tokenId) {
      const { data: resps } = await supabase
        .from("survey_responses")
        .select("*")
        .eq("token_id", tokenId)
        .order("created_at", { ascending: false });
      if (resps) setResponses(resps as SurveyResponse[]);
    }

    setLoading(false);
  };

  const generateLink = async () => {
    setGenerating(true);
    const { data: existing } = await supabase
      .from("survey_tokens")
      .select("token")
      .eq("kind", KIND)
      .limit(1)
      .maybeSingle();

    if (existing) {
      setSurveyLink(`${window.location.origin}${SURVEY_PATH}?token=${existing.token}`);
      setGenerating(false);
      return;
    }

    const { data, error } = await supabase.functions.invoke("validate-survey-email", {
      body: { action: "create-token", kind: KIND },
    });

    if (error) {
      toast({ title: "Error", description: "Failed to generate link", variant: "destructive" });
      setGenerating(false);
      return;
    }

    if (data?.token) {
      setSurveyLink(`${window.location.origin}${SURVEY_PATH}?token=${data.token}`);
      await loadData();
    }

    setGenerating(false);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" /> Raiffeisen Prep Survey Link
          </CardTitle>
          {!surveyLink && (
            <Button onClick={generateLink} disabled={generating} size="sm">
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Link
            </Button>
          )}
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Teilnehmende ({responses.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold font-display">{responses.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Antworten total</p>
                </div>
                <div>
                  <p className="text-3xl font-bold font-display">{responses.filter((r) => r.has_app_idea).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Mit App-Idee</p>
                </div>
                <div>
                  <p className="text-3xl font-bold font-display">{new Set(responses.map((r) => r.email).filter(Boolean)).size}</p>
                  <p className="text-xs text-muted-foreground mt-1">Unique Emails</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">App-Idee vorhanden</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={ideaData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {ideaData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Teilnahme-Tag</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dayData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">AI Coding Erfahrung</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={aiData} layout="vertical">
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Lovable Erfahrung</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={lovableData} layout="vertical">
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Building Blocks</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={blocksData} layout="vertical">
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Responses ({responses.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={!responses.length}
            onClick={() => exportToXlsx(responses, "raiffeisen-prep-survey", "Raiffeisen Prep")}
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
                  <TableHead>Day</TableHead>
                  <TableHead>AI Experience</TableHead>
                  <TableHead>Lovable Experience</TableHead>
                  <TableHead>App Idea</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((r) => (
                  <>
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                      <TableCell className="whitespace-nowrap text-sm">{new Date(r.created_at).toLocaleDateString("de-CH")}</TableCell>
                      <TableCell className="text-sm">{r.email || "—"}</TableCell>
                      <TableCell className="text-sm"><Badge variant="outline" className="whitespace-nowrap">{r.attendance_day || "—"}</Badge></TableCell>
                      <TableCell className="text-sm"><Badge variant="outline" className="whitespace-nowrap">{r.ai_coding_experience || "—"}</Badge></TableCell>
                      <TableCell className="text-sm"><Badge variant="outline" className="whitespace-nowrap">{r.lovable_experience || "—"}</Badge></TableCell>
                      <TableCell><Badge variant={r.has_app_idea ? "default" : "outline"}>{r.has_app_idea ? "Yes" : "No"}</Badge></TableCell>
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
                            <div><strong>Attendance Day:</strong> {r.attendance_day || "—"}</div>
                            <div><strong>AI Coding Experience:</strong> {r.ai_coding_experience || "—"}</div>
                            <div><strong>Lovable Experience:</strong> {r.lovable_experience || "—"}</div>
                            <div><strong>Workshop Goals:</strong> {r.workshop_goals || "—"}</div>
                            <div><strong>Success Criteria:</strong> {r.success_criteria || "—"}</div>
                            {r.app_idea_description && (
                              <div><strong>{r.has_app_idea ? "App Idea" : "Exploration Areas"}:</strong> {r.app_idea_description}</div>
                            )}
                            {r.has_app_idea && r.app_audience && (<div><strong>Audience:</strong> {r.app_audience}</div>)}
                            <div><strong>Building Blocks:</strong> {r.building_blocks || "—"}</div>
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

export default RaiffeisenSurveyAdmin;