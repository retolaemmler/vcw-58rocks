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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/vcw-logo.png";

const schema = z.object({
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein" }),
  nps_score: z.number({ required_error: "Bitte auswählen" }).min(0).max(10),
  best_part: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const KIND = "hsg_women_feedback";

const HsgWomenFeedback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<"loading" | "invalid" | "form" | "submitted">("loading");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", best_part: "" },
  });

  const nps = form.watch("nps_score");

  useEffect(() => {
    if (!token) { setPageState("invalid"); return; }
    supabase.rpc("validate_survey_token", { _token: token }).then(({ data }) => {
      const row = Array.isArray(data) ? data[0] : null;
      if (row && row.kind === KIND) { setTokenId(row.id); setPageState("form"); }
      else setPageState("invalid");
    });
  }, [token]);

  const onSubmit = async (values: FormValues) => {
    if (!tokenId) return;
    setSubmitting(true);
    const { error } = await supabase.from("feedback_responses").insert({
      token_id: tokenId,
      email: values.email.trim().toLowerCase(),
      nps_score: values.nps_score,
      best_part: values.best_part?.trim() || null,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Bereits abgesendet", description: "Du hast bereits Feedback eingereicht. Danke!" });
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
            <CardTitle>Ungültiger Link</CardTitle>
            <p className="text-muted-foreground mt-2">Dieser Feedback-Link ist ungültig oder abgelaufen.</p>
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
            <CardTitle className="font-display text-2xl">Danke für dein Feedback! 🙏</CardTitle>
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
          <h2 className="font-display text-xl font-semibold">HSG Alumni Women’s Club — Feedback</h2>
          <p className="text-muted-foreground mt-2">Zwei kurze Fragen — danke für deine Rückmeldung!</p>
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
                  name="nps_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">⭐ Wie wahrscheinlich empfiehlst du den Workshop weiter? (0–10)</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => field.onChange(n)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium border transition-all ${
                                nps === n
                                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                  : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="best_part"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">💬 Warum?</FormLabel>
                      <FormControl><Textarea {...field} rows={4} placeholder="Deine Begründung…" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

export default HsgWomenFeedback;
