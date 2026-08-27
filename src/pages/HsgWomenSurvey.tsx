import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/vcw-logo.png";

const surveySchema = z.object({
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein" }),
  ai_coding_experience: z.enum(["yes", "no"], { required_error: "Bitte auswählen" }),
  lovable_experience: z.string().optional(),
  workshop_goals: z.string().optional(),
  has_app_idea: z.enum(["yes", "no"], { required_error: "Bitte auswählen" }),
  app_idea_description: z.string().optional(),
});

type SurveyFormValues = z.infer<typeof surveySchema>;

const KIND = "hsg_women_prep";

const HsgWomenSurvey = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<"loading" | "invalid" | "form" | "submitted">("loading");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: { email: "", lovable_experience: "", workshop_goals: "", app_idea_description: "" },
  });

  const hasBuilt = form.watch("ai_coding_experience");
  const hasAppIdea = form.watch("has_app_idea");

  useEffect(() => {
    if (!token) { setPageState("invalid"); return; }
    supabase.rpc("validate_survey_token", { _token: token }).then(({ data }) => {
      const row = Array.isArray(data) ? data[0] : null;
      if (row && row.kind === KIND) { setTokenId(row.id); setPageState("form"); }
      else setPageState("invalid");
    });
  }, [token]);

  const onSubmit = async (values: SurveyFormValues) => {
    if (!tokenId) return;
    setSubmitting(true);
    const { error } = await supabase.from("survey_responses").insert({
      token_id: tokenId,
      email: values.email.trim().toLowerCase(),
      ai_coding_experience: values.ai_coding_experience === "yes" ? "Ja" : "Nein",
      lovable_experience: values.lovable_experience?.trim() || "",
      workshop_goals: values.workshop_goals?.trim() || "",
      success_criteria: "",
      has_app_idea: values.has_app_idea === "yes",
      app_idea_description: values.app_idea_description?.trim() || null,
      building_blocks: "",
      moderation_language: "",
      drink_preference: "none",
      dietary: "none",
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Bereits abgesendet", description: "Du hast bereits eine Antwort eingereicht. Vielen Dank!" });
        setPageState("submitted");
      } else {
        toast({ title: "Fehler", description: "Senden fehlgeschlagen. Bitte versuche es erneut.", variant: "destructive" });
      }
    } else {
      setPageState("submitted");
    }
    setSubmitting(false);
  };

  if (pageState === "loading") {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (pageState === "invalid") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle>Ungültiger Umfrage-Link</CardTitle>
            <p className="text-muted-foreground mt-2">Dieser Umfrage-Link ist ungültig oder abgelaufen.</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (pageState === "submitted") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="font-display text-2xl">Alles erledigt! 🎉</CardTitle>
            <p className="text-muted-foreground mt-2">Vielen Dank — wir freuen uns auf dich!</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Vibe Code Workshop" className="h-12 w-12" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold">Vibe Code Workshop</h1>
          </div>
          <h2 className="font-display text-xl font-semibold">HSG Alumni Women’s Club — Vorbereitung</h2>
          <p className="text-muted-foreground mt-2">Kurze Umfrage — dauert etwa 2 Minuten.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>📧 Deine E-Mail</FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="deine@email.com" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ai_coding_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">🤖 Hast du schon mit KI gebaut?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="ai-yes" /><Label htmlFor="ai-yes">Ja</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="ai-no" /><Label htmlFor="ai-no">Nein</Label></div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasBuilt === "yes" && (
                  <FormField
                    control={form.control}
                    name="lovable_experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🛠️ Mit welchen?</FormLabel>
                        <FormControl><Input {...field} placeholder="z.B. Lovable, ChatGPT, Claude…" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="workshop_goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">🎯 Erwartungen</FormLabel>
                      <FormControl><Textarea {...field} rows={3} placeholder="Was möchtest du mitnehmen?" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_app_idea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">💡 Hast du eine App-Idee?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="idea-yes" /><Label htmlFor="idea-yes">Ja</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="idea-no" /><Label htmlFor="idea-no">Nein</Label></div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasAppIdea === "yes" && (
                  <FormField
                    control={form.control}
                    name="app_idea_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">📝 App-Idee Beschreibung</FormLabel>
                        <FormControl><Textarea {...field} rows={5} placeholder="Beschreibe deine Idee…" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Absenden
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HsgWomenSurvey;
