import { useEffect, useState } from "react";
import ShareQr from "@/components/admin/ShareQr";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, ClipboardCheck, MessageSquare, Trash2, Star, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToXlsx } from "@/lib/exportXlsx";

interface FeedbackResponse {
  id: string;
  email: string | null;
  participant_name: string | null;
  nps_score: number | null;
  overall_rating: number | null;
  rating_intro: number | null;
  rating_workshop_session_1: number | null;
  rating_lunch: number | null;
  rating_presentations: number | null;
  rating_qa_beer: number | null;
  best_part: string | null;
  improve_part: string | null;
  app_built_description: string | null;
  will_continue_building: string | null;
  recommend_to_others: string | null;
  testimonial: string | null;
  allow_testimonial_public: boolean | null;
  anything_else: string | null;
  token_id: string;
  created_at: string;
}

const SECTION_RATINGS: { key: keyof FeedbackResponse; label: string }[] = [
  { key: "rating_intro", label: "Intro" },
  { key: "rating_workshop_session_1", label: "Workshop Session" },
  { key: "rating_lunch", label: "Pizza Break" },
  { key: "rating_presentations", label: "Presentations" },
  { key: "rating_qa_beer", label: "Q&A + Beer" },
];

const avg = (vals: (number | null)[]) => {
  const filtered = vals.filter((v): v is number => typeof v === "number");
  if (!filtered.length) return null;
  return filtered.reduce((a, b) => a + b, 0) / filtered.length;
};

const MasterclassEveningFeedbackAdmin = () => {
  const [link, setLink] = useState<string | null>(null);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: tokensData } = await supabase
        .from("survey_tokens")
        .select("id, token, kind")
        .eq("kind", "mc_evening_feedback");

      const ids: string[] = [];
      if (tokensData?.length) {
        setLink(`${window.location.origin}/mc-evening-feedback?token=${tokensData[0].token}`);
        tokensData.forEach((t) => ids.push(t.id));
      }

      if (ids.length) {
        const { data: resps } = await supabase
          .from("feedback_responses")
          .select("*")
          .in("token_id", ids)
          .order("created_at", { ascending: false });
        if (resps) setResponses(resps as unknown as FeedbackResponse[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Copied!", description: "Feedback link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteResponse = async (id: string) => {
    if (!window.confirm("Delete this feedback response?")) return;
    const { error } = await supabase.from("feedback_responses").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete response", variant: "destructive" });
    } else {
      setResponses((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Response removed" });
    }
  };

  const avgOverall = avg(responses.map((r) => r.overall_rating));
  const avgNps = avg(responses.map((r) => r.nps_score));
  const promoters = responses.filter((r) => (r.nps_score ?? -1) >= 9).length;
  const detractors = responses.filter((r) => (r.nps_score ?? -1) >= 0 && (r.nps_score ?? 11) <= 6).length;
  const npsResponses = responses.filter((r) => typeof r.nps_score === "number").length;
  const npsValue = npsResponses > 0 ? Math.round(((promoters - detractors) / npsResponses) * 100) : null;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {link && (
        <div className="bg-muted p-2 rounded-lg text-xs inline-block">
          <div className="flex items-center gap-2">
            <code className="text-muted-foreground break-all">{link}</code>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={copyLink}>
              {copied ? <ClipboardCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">Language is chosen automatically (EN/DE), switchable on the page.</p>
          <ShareQr url={link} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Responses</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-display">{responses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Overall</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-display">
              {avgOverall !== null ? `${avgOverall.toFixed(1)} / 5` : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">NPS</CardTitle>
            <Badge variant="outline">{npsResponses} resp.</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-display">{npsValue !== null ? npsValue : "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              avg {avgNps !== null ? avgNps.toFixed(1) : "—"} · {promoters} promoters / {detractors} detractors
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Section averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SECTION_RATINGS.map((s) => {
              const a = avg(responses.map((r) => r[s.key] as number | null));
              return (
                <div key={s.key} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-display font-semibold text-lg">{a !== null ? `${a.toFixed(1)} / 5` : "—"}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Masterclass Evening Feedback</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={!responses.length}
            onClick={() => exportToXlsx(responses, "masterclass-evening-feedback", "Evening Feedback")}
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
                  <TableHead>Participant</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>NPS</TableHead>
                  <TableHead>Testimonial</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((r) => (
                  <>
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(r.created_at).toLocaleDateString("de-CH")}
                      </TableCell>
                      <TableCell className="text-sm">{r.participant_name || r.email || "—"}</TableCell>
                      <TableCell>{r.overall_rating ? <Badge variant="default">{r.overall_rating} / 5</Badge> : "—"}</TableCell>
                      <TableCell>
                        {typeof r.nps_score === "number" ? (
                          <Badge variant={r.nps_score >= 9 ? "default" : r.nps_score <= 6 ? "destructive" : "outline"}>
                            {r.nps_score}
                          </Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm max-w-[240px] truncate">{r.testimonial || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">{expandedRow === r.id ? "Hide" : "Show"}</Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); deleteResponse(r.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRow === r.id && (
                      <TableRow key={`${r.id}-detail`}>
                        <TableCell colSpan={6}>
                          <div className="grid gap-3 p-4 bg-muted/50 rounded-lg text-sm">
                            <div><strong>Email:</strong> {r.email || "—"}</div>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {SECTION_RATINGS.map((s) => (
                                <div key={s.key} className="bg-background rounded p-2 border border-border">
                                  <div className="text-xs text-muted-foreground">{s.label}</div>
                                  <div className="font-medium">{(r[s.key] as number | null) ?? "—"}</div>
                                </div>
                              ))}
                            </div>
                            {r.best_part && <div><strong>Highlight of the evening:</strong> {r.best_part}</div>}
                            {r.improve_part && <div><strong>To improve:</strong> {r.improve_part}</div>}
                            <div><strong>Will continue:</strong> {r.will_continue_building || "—"}</div>
                            {r.testimonial && (
                              <div>
                                <strong>Testimonial:</strong> {r.testimonial}
                                {r.allow_testimonial_public && <Badge variant="default" className="ml-2">Public OK</Badge>}
                              </div>
                            )}
                            {r.anything_else && <div><strong>Other:</strong> {r.anything_else}</div>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {responses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No feedback yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterclassEveningFeedbackAdmin;
