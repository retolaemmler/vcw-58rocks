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

interface SurveyResponse {
  id: string;
  email: string | null;
  ai_coding_experience: string;
  lovable_experience: string;
  workshop_goals: string;
  has_app_idea: boolean;
  app_idea_description: string | null;
  created_at: string;
}

const KIND = "hsg_women_prep";
const SURVEY_PATH = "/hsg-women-prep";

const HsgWomenSurveyAdmin = () => {
  const [surveyLink, setSurveyLink] = useState<string | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: tokens } = await supabase
      .from("survey_tokens").select("id, token").eq("kind", KIND).limit(1).maybeSingle();

    if (tokens) {
      setSurveyLink(`${window.location.origin}${SURVEY_PATH}?token=${tokens.token}`);
      const { data: resps } = await supabase
        .from("survey_responses").select("*").eq("token_id", tokens.id)
        .order("created_at", { ascending: false });
      if (resps) setResponses(resps as SurveyResponse[]);
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
    if (error) toast({ title: "Error", description: "Failed to delete response", variant: "destructive" });
    else {
      setResponses((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Response removed" });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" /> 26.8.26 HSG Women Masterclass Prep Survey Link
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Responses ({responses.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={!responses.length}
            onClick={() => exportToXlsx(responses, "hsg-women-prep-survey", "HSG Women Prep Survey")}
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
                  <TableHead>Built with AI?</TableHead>
                  <TableHead>Tools</TableHead>
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
                      <TableCell className="text-sm"><Badge variant="outline">{r.ai_coding_experience || "—"}</Badge></TableCell>
                      <TableCell className="text-sm">{r.lovable_experience || "—"}</TableCell>
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
                        <TableCell colSpan={6}>
                          <div className="grid gap-3 p-4 bg-muted/50 rounded-lg text-sm">
                            <div><strong>Schon mit KI gebaut?:</strong> {r.ai_coding_experience || "—"}</div>
                            <div><strong>Mit welchen?:</strong> {r.lovable_experience || "—"}</div>
                            <div className="whitespace-pre-wrap"><strong>Erwartungen:</strong> {r.workshop_goals || "—"}</div>
                            <div className="whitespace-pre-wrap"><strong>App Idee:</strong> {r.app_idea_description || "—"}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {responses.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No responses yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HsgWomenSurveyAdmin;
