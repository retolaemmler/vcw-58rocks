import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Copy, ClipboardCheck, FileText, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  drink_preference: string;
  dietary: string;
  anything_else: string | null;
  moderation_language: string | null;
  created_at: string;
}

interface OrderEmail {
  customer_email: string;
  contact_name: string | null;
}

const SurveyAdmin = () => {
  const [surveyLink, setSurveyLink] = useState<string | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [orderEmails, setOrderEmails] = useState<OrderEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [editingEmailValue, setEditingEmailValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load existing token
    const { data: tokens } = await supabase
      .from("survey_tokens")
      .select("token")
      .limit(1)
      .maybeSingle();

    if (tokens) {
      setSurveyLink(`${window.location.origin}/survey?token=${tokens.token}`);
    }

    // Load responses
    const { data: resps } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (resps) setResponses(resps as SurveyResponse[]);

    // Load order emails for completion tracking
    const { data: orders } = await supabase
      .from("orders")
      .select("customer_email, contact_name");

    if (orders) setOrderEmails(orders as OrderEmail[]);

    setLoading(false);
  };

  const generateLink = async () => {
    setGenerating(true);

    // Check if token already exists
    const { data: existing } = await supabase
      .from("survey_tokens")
      .select("token")
      .limit(1)
      .maybeSingle();

    if (existing) {
      setSurveyLink(`${window.location.origin}/survey?token=${existing.token}`);
      setGenerating(false);
      return;
    }

    // Create token via edge function (uses service role)
    const { data, error } = await supabase.functions.invoke("validate-survey-email", {
      body: { action: "create-token" },
    });

    if (error) {
      toast({ title: "Error", description: "Failed to generate link", variant: "destructive" });
      setGenerating(false);
      return;
    }

    if (data?.token) {
      setSurveyLink(`${window.location.origin}/survey?token=${data.token}`);
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

  const assignEmail = async (id: string) => {
    const email = editingEmailValue.trim().toLowerCase();
    if (!email) return;
    const { error } = await supabase.from("survey_responses").update({ email }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to assign email", variant: "destructive" });
    } else {
      setResponses((prev) => prev.map((r) => r.id === id ? { ...r, email } : r));
      setEditingEmailId(null);
      toast({ title: "Assigned", description: `Email set to ${email}` });
    }
  };

  const orderEmailSet = new Set(orderEmails.map((o) => o.customer_email.toLowerCase()));
  const respondedEmails = new Set(responses.map((r) => r.email?.toLowerCase()).filter(Boolean));
  const matchedResponses = responses.filter((r) => r.email && orderEmailSet.has(r.email.toLowerCase()));
  const pendingEmails = orderEmails.filter(
    (o) => !respondedEmails.has(o.customer_email.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Survey Link */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" /> Survey Link
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

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Completion: {responses.length} / {orderEmails.length}
          </CardTitle>
        </CardHeader>
        {pendingEmails.length > 0 && (
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Pending responses from:</p>
            <div className="flex flex-wrap gap-2">
              {pendingEmails.map((o) => (
                <Badge key={o.customer_email} variant="outline">
                  {o.contact_name || o.customer_email}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Responses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>AI Experience</TableHead>
                  <TableHead>Lovable Experience</TableHead>
                  <TableHead>App Idea</TableHead>
                  <TableHead>App Idea Description</TableHead>
                  <TableHead>Dietary</TableHead>
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
                        {r.email ? (
                          r.email
                        ) : editingEmailId === r.id ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Input
                              value={editingEmailValue}
                              onChange={(e) => setEditingEmailValue(e.target.value)}
                              placeholder="email@example.com"
                              className="h-7 text-xs w-40"
                              onKeyDown={(e) => { if (e.key === "Enter") assignEmail(r.id); if (e.key === "Escape") setEditingEmailId(null); }}
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => assignEmail(r.id)}>Save</Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span>{r.participant_name || "—"}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => { e.stopPropagation(); setEditingEmailId(r.id); setEditingEmailValue(""); }}
                              title="Assign email"
                            >
                              <UserPlus className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline" className="whitespace-nowrap">{r.ai_coding_experience || "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline" className="whitespace-nowrap">{r.lovable_experience || "—"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.has_app_idea ? "default" : "outline"}>
                          {r.has_app_idea ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {r.app_idea_description || "—"}
                      </TableCell>
                      <TableCell className="capitalize">{r.dietary === "none" ? "—" : r.dietary || "—"}</TableCell>
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
                         <TableCell colSpan={8}>
                          <div className="grid gap-3 p-4 bg-muted/50 rounded-lg text-sm">
                             <div><strong>AI Coding Experience:</strong> {r.ai_coding_experience || "—"}</div>
                             <div><strong>Lovable Experience:</strong> {r.lovable_experience || "—"}</div>
                             <div><strong>Workshop Goals:</strong> {r.workshop_goals || "—"}</div>
                             <div><strong>Success Criteria:</strong> {r.success_criteria || "—"}</div>
                             {r.app_idea_description && (
                               <div><strong>{r.has_app_idea ? "App Idea" : "Exploration Areas"}:</strong> {r.app_idea_description}</div>
                             )}
                             {r.has_app_idea && r.app_audience && (
                               <div><strong>Audience:</strong> {r.app_audience}</div>
                             )}
                             <div><strong>Building Blocks:</strong> {r.building_blocks || "—"}</div>
                             <div><strong>Workshop Language:</strong> {r.moderation_language || "—"}</div>
                             
                             <div><strong>Dietary:</strong> {r.dietary === "none" ? "—" : r.dietary || "—"}</div>
                             {r.anything_else && <div><strong>Other:</strong> {r.anything_else}</div>}
                           </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {responses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No responses yet.
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

export default SurveyAdmin;
