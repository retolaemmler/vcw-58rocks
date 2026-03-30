import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Copy, ClipboardCheck, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SurveyResponse {
  id: string;
  email: string;
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

    // Create new token via service role (use edge function)
    const { data, error } = await supabase.functions.invoke("validate-survey-email", {
      body: { action: "create-token" },
    });

    // Fallback: insert directly (anon can't insert due to RLS, so we use a simple approach)
    // Actually, let's create a dedicated approach - insert with the authenticated user
    // Since admin is authenticated, we need an insert policy for authenticated admins
    // For now, reload to check
    if (error) {
      toast({ title: "Error", description: "Failed to generate link", variant: "destructive" });
    }

    // Reload
    const { data: newToken } = await supabase
      .from("survey_tokens")
      .select("token")
      .limit(1)
      .maybeSingle();

    if (newToken) {
      setSurveyLink(`${window.location.origin}/survey?token=${newToken.token}`);
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

  const respondedEmails = new Set(responses.map((r) => r.email.toLowerCase()));
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
                  <TableHead>Email</TableHead>
                  <TableHead>App Idea</TableHead>
                  <TableHead>Drink</TableHead>
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
                      <TableCell className="text-sm">{r.email}</TableCell>
                      <TableCell>
                        <Badge variant={r.has_app_idea ? "default" : "outline"}>
                          {r.has_app_idea ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{r.drink_preference}</TableCell>
                      <TableCell className="capitalize">{r.dietary === "none" ? "—" : r.dietary}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          {expandedRow === r.id ? "Hide" : "Show"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRow === r.id && (
                      <TableRow key={`${r.id}-detail`}>
                        <TableCell colSpan={6}>
                          <div className="grid gap-3 p-4 bg-muted/50 rounded-lg text-sm">
                            <div><strong>AI Coding Experience:</strong> {r.ai_coding_experience}</div>
                            <div><strong>Lovable Experience:</strong> {r.lovable_experience}</div>
                            <div><strong>Workshop Goals:</strong> {r.workshop_goals}</div>
                            <div><strong>Success Criteria:</strong> {r.success_criteria}</div>
                            {r.has_app_idea && (
                              <>
                                <div><strong>App Idea:</strong> {r.app_idea_description || "—"}</div>
                                <div><strong>Audience:</strong> {r.app_audience || "—"}</div>
                              </>
                            )}
                            <div><strong>Building Blocks:</strong> {r.building_blocks}</div>
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
