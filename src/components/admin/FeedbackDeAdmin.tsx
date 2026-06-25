import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Copy, ClipboardCheck, MessageSquare, Trash2, Star, Download } from "lucide-react";
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
  rating_next_level: number | null;
  rating_workshop_session_2: number | null;
  rating_presentations: number | null;
  rating_future: number | null;
  rating_qa_beer: number | null;
  best_part: string | null;
  improve_part: string | null;
  app_built_description: string | null;
  will_continue_building: string | null;
  recommend_to_others: string | null;
  testimonial: string | null;
  allow_testimonial_public: boolean | null;
  anything_else: string | null;
  created_at: string;
}

const SECTION_RATINGS: { key: keyof FeedbackResponse; label: string }[] = [
  { key: "rating_intro", label: "Intro" },
  { key: "rating_workshop_session_1", label: "Session #1" },
  { key: "rating_lunch", label: "Lunch" },
  { key: "rating_next_level", label: "Next Level" },
  { key: "rating_workshop_session_2", label: "Session #2" },
  { key: "rating_presentations", label: "Presentations" },
  { key: "rating_future", label: "Future" },
  { key: "rating_qa_beer", label: "Q&A + Beer" },
];

const avg = (vals: (number | null)[]) => {
  const filtered = vals.filter((v): v is number => typeof v === "number");
  if (!filtered.length) return null;
  return filtered.reduce((a, b) => a + b, 0) / filtered.length;
};

const FeedbackAdmin = () => {
  const [feedbackLink, setFeedbackLink] = useState<string | null>(null);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: tokens } = await supabase
      .from("survey_tokens")
      .select("token")
      .eq("kind", "feedback")
      .limit(1)
      .maybeSingle();

    if (tokens) {
      setFeedbackLink(`${window.location.origin}/feedback?token=${tokens.token}`);
    }

    const { data: resps } = await supabase
      .from("feedback_responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (resps) setResponses(resps as FeedbackResponse[]);
    setLoading(false);
  };

  const copyLink = () => {
    if (!feedbackLink) return;
    navigator.clipboard.writeText(feedbackLink);
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

  // Aggregates
  const avgOverall = avg(responses.map((r) => r.overall_rating));
  const avgNps = avg(responses.map((r) => r.nps_score));
  const promoters = responses.filter((r) => (r.nps_score ?? -1) >= 9).length;
  const detractors = responses.filter((r) => (r.nps_score ?? -1) >= 0 && (r.nps_score ?? 11) <= 6).length;
  const npsResponses = responses.filter((r) => typeof r.nps_score === "number").length;
  const npsValue = npsResponses > 0
    ? Math.round(((promoters - detractors) / npsResponses) * 100)
    : null;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" /> Feedback Link
          </CardTitle>
        </CardHeader>
        {feedbackLink && (
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted p-3 rounded text-sm break-all">{feedbackLink}</code>
              <Button variant="outline" size="icon" onClick={copyLink}>
                {copied ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary cards */}
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
            <p className="text-3xl font-bold font-display">
              {npsValue !== null ? npsValue : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              avg {avgNps !== null ? avgNps.toFixed(1) : "—"} · {promoters} promoters / {detractors} detractors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section averages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Section averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SECTION_RATINGS.map((s) => {
              const a = avg(responses.map((r) => r[s.key] as number | null));
              return (
                <div key={s.key} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-display font-semibold text-lg">
                    {a !== null ? `${a.toFixed(1)} / 5` : "—"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Feedback Responses</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={!responses.length}
            onClick={() => exportToXlsx(responses, "feedback", "Feedback")}
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
                  <TableHead>Recommend</TableHead>
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
                      <TableCell className="text-sm">
                        {r.participant_name || r.email || "—"}
                      </TableCell>
                      <TableCell>
                        {r.overall_rating ? (
                          <Badge variant="default">{r.overall_rating} / 5</Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        {typeof r.nps_score === "number" ? (
                          <Badge variant={r.nps_score >= 9 ? "default" : r.nps_score <= 6 ? "destructive" : "outline"}>
                            {r.nps_score}
                          </Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{r.recommend_to_others || "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-[240px] truncate">
                        {r.testimonial || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            {expandedRow === r.id ? "Hide" : "Show"}
                          </Button>
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
                        <TableCell colSpan={7}>
                          <div className="grid gap-3 p-4 bg-muted/50 rounded-lg text-sm">
                            <div><strong>Email:</strong> {r.email || "—"}</div>
                            <div><strong>Overall:</strong> {r.overall_rating ?? "—"} / 5 · <strong>NPS:</strong> {r.nps_score ?? "—"}</div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {SECTION_RATINGS.map((s) => (
                                <div key={s.key} className="bg-background rounded p-2 border border-border">
                                  <div className="text-xs text-muted-foreground">{s.label}</div>
                                  <div className="font-medium">{(r[s.key] as number | null) ?? "—"}</div>
                                </div>
                              ))}
                            </div>
                            {r.best_part && <div><strong>Best part:</strong> {r.best_part}</div>}
                            {r.improve_part && <div><strong>To improve:</strong> {r.improve_part}</div>}
                            {r.app_built_description && <div><strong>Built:</strong> {r.app_built_description}</div>}
                            <div>
                              <strong>Will continue:</strong> {r.will_continue_building || "—"} · <strong>Recommend:</strong> {r.recommend_to_others || "—"}
                            </div>
                            {r.testimonial && (
                              <div>
                                <strong>Testimonial:</strong> {r.testimonial}
                                {r.allow_testimonial_public && (
                                  <Badge variant="default" className="ml-2">Public OK</Badge>
                                )}
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
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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

export default FeedbackAdmin;
