import { useEffect, useState } from "react";
import ShareQr from "@/components/admin/ShareQr";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Copy, ClipboardCheck, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToXlsx } from "@/lib/exportXlsx";

interface FeedbackResponse {
  id: string;
  email: string | null;
  nps_score: number | null;
  best_part: string | null;
  created_at: string;
}

const KIND = "hsg_women_feedback";
const SURVEY_PATH = "/hsg-women-feedback";

const HsgWomenFeedbackAdmin = () => {
  const [surveyLink, setSurveyLink] = useState<string | null>(null);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: tokens } = await supabase
      .from("survey_tokens").select("id, token").eq("kind", KIND).limit(1).maybeSingle();

    if (tokens) {
      setSurveyLink(`${window.location.origin}${SURVEY_PATH}?token=${tokens.token}`);
      const { data: resps } = await supabase
        .from("feedback_responses").select("*").eq("token_id", tokens.id)
        .order("created_at", { ascending: false });
      if (resps) setResponses(resps as FeedbackResponse[]);
    }
    setLoading(false);
  };

  const copyLink = () => {
    if (!surveyLink) return;
    navigator.clipboard.writeText(surveyLink);
    setCopied(true);
    toast({ title: "Copied!", description: "Feedback link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteResponse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this response?")) return;
    const { error } = await supabase.from("feedback_responses").delete().eq("id", id);
    if (error) toast({ title: "Error", description: "Failed to delete response", variant: "destructive" });
    else {
      setResponses((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Response removed" });
    }
  };

  const scores = responses.map((r) => r.nps_score).filter((n): n is number => typeof n === "number");
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
  const promoters = scores.filter((n) => n >= 9).length;
  const detractors = scores.filter((n) => n <= 6).length;
  const nps = scores.length ? Math.round(((promoters - detractors) / scores.length) * 100) : null;

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" /> 26.8.26 HSG Women Masterclass Feedback Link
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
            <ShareQr url={surveyLink} />
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Responses</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold font-display">{responses.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ø Empfehlung</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold font-display">{avg}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">NPS</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold font-display">{nps ?? "—"}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Responses ({responses.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={!responses.length}
            onClick={() => exportToXlsx(responses, "hsg-women-feedback", "HSG Women Feedback")}
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
                  <TableHead>Empfehlung (0-10)</TableHead>
                  <TableHead>Warum?</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-sm">{new Date(r.created_at).toLocaleDateString("de-CH")}</TableCell>
                    <TableCell className="text-sm">{r.email || "—"}</TableCell>
                    <TableCell><Badge variant={(r.nps_score ?? 0) >= 9 ? "default" : "outline"}>{r.nps_score ?? "—"}</Badge></TableCell>
                    <TableCell className="text-sm whitespace-pre-wrap">{r.best_part || "—"}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => deleteResponse(r.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {responses.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No responses yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HsgWomenFeedbackAdmin;
