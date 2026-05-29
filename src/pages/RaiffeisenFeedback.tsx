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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, X, Wand2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/vcw-logo.png";

const feedbackSchema = z.object({
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein" }),
  participant_name: z.string().optional(),
  attendance_day: z.enum(["day1", "day2", "both"], { required_error: "Bitte wähle einen Workshop-Tag" }),
  nps_score: z.number({ required_error: "Bitte wähle einen Wert" }).min(0).max(10),
  overall_rating: z.number({ required_error: "Bitte bewerte den Workshop" }).min(1).max(5),
  rating_intro: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  rating_workshop_session_1: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  rating_lunch: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  rating_next_level: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  rating_workshop_session_2: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  rating_presentations: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  rating_future: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  rating_qa_beer: z.number({ required_error: "Bitte bewerte diesen Abschnitt" }).min(1).max(5),
  best_part: z.string().optional(),
  improve_part: z.string().optional(),
  app_built_description: z.string().optional(),
  will_continue_building: z.enum(["yes", "maybe", "no"], { required_error: "Bitte wähle eine Option" }),
  recommend_to_others: z.enum(["yes", "maybe", "no"]).optional(),
  testimonial: z.string().optional(),
  allow_testimonial_public: z.boolean().optional(),
  anything_else: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const StarRating = ({
  value,
  onChange,
  max = 5,
}: {
  value?: number;
  onChange: (v: number) => void;
  max?: number;
}) => (
  <div className="flex flex-wrap gap-2">
    {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
      const selected = value !== undefined && n <= value;
      return (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-full border text-sm font-semibold transition-all ${
            selected
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
          }`}
          aria-label={`${n} Stern${n > 1 ? "e" : ""}`}
        >
          {n}
        </button>
      );
    })}
  </div>
);

const NpsRating = ({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {Array.from({ length: 11 }, (_, i) => i).map((n) => {
      const selected = value === n;
      return (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-md border text-sm font-semibold transition-all ${
            selected
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          {n}
        </button>
      );
    })}
  </div>
);

const AGENDA_SECTIONS: { key: keyof FeedbackFormValues; label: string }[] = [
  { key: "rating_intro", label: "👋 Willkommen & Intro" },
  { key: "rating_workshop_session_1", label: "🛠️ Workshop-Session #1" },
  { key: "rating_lunch", label: "🍕 Mittagspause" },
  { key: "rating_next_level", label: "🚀 Next Level Vibe Coding" },
  { key: "rating_workshop_session_2", label: "🛠️ Workshop-Session #2" },
  { key: "rating_presentations", label: "🎤 Präsentationen & Feedback" },
  { key: "rating_future", label: "🔮 Die Zukunft von Vibe Coding" },
  { key: "rating_qa_beer", label: "🍺 Q&A + Apéro" },
];

const RaiffeisenFeedback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<"loading" | "invalid" | "form" | "submitted">("loading");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingTestimonial, setGeneratingTestimonial] = useState(false);
  const { toast } = useToast();

  const handleGenerateTestimonial = async () => {
    const email = form.getValues("email")?.trim();
    setGeneratingTestimonial(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-testimonial", {
        body: { email: email || null, token, language: "de" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const testimonial = data?.testimonial as string | undefined;
      if (!testimonial) throw new Error("Kein Testimonial erhalten");
      form.setValue("testimonial", testimonial, { shouldDirty: true, shouldValidate: true });
      if (!email) {
        toast({
          title: "Generisches Testimonial erstellt",
          description: "Trage oben deine E-Mail ein, um es auf dein Projekt zuzuschneiden.",
        });
      }
    } catch (err) {
      console.error("Generate testimonial error:", err);
      toast({
        title: "Testimonial konnte nicht erstellt werden",
        description: err instanceof Error ? err.message : "Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setGeneratingTestimonial(false);
    }
  };

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: "",
      participant_name: "",
      allow_testimonial_public: false,
    },
  });

  useEffect(() => {
    if (!token) { setPageState("invalid"); return; }
    supabase.rpc("validate_survey_token", { _token: token })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : null;
        if (row && row.kind === "raiffeisen_feedback") { setTokenId(row.id); setPageState("form"); }
        else setPageState("invalid");
      });
  }, [token]);

  const onSubmit = async (values: FeedbackFormValues) => {
    if (!tokenId) return;
    setSubmitting(true);

    const { error } = await supabase.from("feedback_responses").insert({
      token_id: tokenId,
      email: values.email?.trim().toLowerCase() || null,
      participant_name: values.participant_name?.trim() || null,
      attendance_day: values.attendance_day,
      nps_score: values.nps_score ?? null,
      overall_rating: values.overall_rating ?? null,
      rating_intro: values.rating_intro ?? null,
      rating_workshop_session_1: values.rating_workshop_session_1 ?? null,
      rating_lunch: values.rating_lunch ?? null,
      rating_next_level: values.rating_next_level ?? null,
      rating_workshop_session_2: values.rating_workshop_session_2 ?? null,
      rating_presentations: values.rating_presentations ?? null,
      rating_future: values.rating_future ?? null,
      rating_qa_beer: values.rating_qa_beer ?? null,
      best_part: values.best_part?.trim() || null,
      improve_part: values.improve_part?.trim() || null,
      app_built_description: values.app_built_description?.trim() || null,
      will_continue_building: values.will_continue_building || null,
      recommend_to_others: values.recommend_to_others || null,
      testimonial: values.testimonial?.trim() || null,
      allow_testimonial_public: !!values.allow_testimonial_public,
      anything_else: values.anything_else?.trim() || null,
    });

    if (error) {
      console.error("Feedback submit error:", error);
      toast({ title: "Fehler", description: "Senden fehlgeschlagen. Bitte versuche es erneut.", variant: "destructive" });
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
            <CardTitle>Ungültiger Feedback-Link</CardTitle>
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
            <CardTitle className="font-display text-2xl">Vielen Dank! 🙌</CardTitle>
            <p className="text-muted-foreground mt-2">
              Dein Feedback hilft uns, den nächsten Vibe Code Workshop noch besser zu machen. Du bist ein Star ⭐
            </p>
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
          <h2 className="font-display text-xl font-semibold">Wie war dein Tag? 💬</h2>
          <p className="text-muted-foreground mt-2">
            Kurzes Post-Workshop-Feedback — dauert etwa 3 Minuten. Deine ehrliche Rückmeldung prägt die nächste Ausgabe.
          </p>
        </div>

        {!showForm ? (
          <div className="text-center pt-8">
            <Button
              size="lg"
              className="gradient-bg text-white font-semibold text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => setShowForm(true)}
            >
              Feedback starten (3 Min.)
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>📧 Deine E-Mail (gleiche wie bei der Anmeldung)</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="deine@email.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="overall_rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">⭐ Wie würdest du den Workshop insgesamt bewerten?</FormLabel>
                        <p className="text-sm text-muted-foreground">1 = schlecht, 5 = grossartig</p>
                        <FormControl>
                          <StarRating value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attendance_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">📅 An welchem Workshop-Tag hast du teilgenommen?</FormLabel>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="day1" id="att-day1" />
                              <Label htmlFor="att-day1" className="font-normal cursor-pointer">Tag 1</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="day2" id="att-day2" />
                              <Label htmlFor="att-day2" className="font-normal cursor-pointer">Tag 2</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="both" id="att-both" />
                              <Label htmlFor="att-both" className="font-normal cursor-pointer">Beide Tage</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nps_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🤝 Wie wahrscheinlich würdest du diesen Workshop einer Kollegin oder einem Kollegen empfehlen?</FormLabel>
                        <p className="text-sm text-muted-foreground">0 = überhaupt nicht, 10 = absolut</p>
                        <FormControl>
                          <NpsRating value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-semibold text-base">📅 Wie hat dir jeder Teil gefallen?</h3>
                      <p className="text-sm text-muted-foreground">Bewerte jeden Abschnitt von 1 (schlecht) bis 5 (grossartig).</p>
                    </div>
                    {AGENDA_SECTIONS.map(({ key, label }) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof FeedbackFormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{label}</FormLabel>
                            <FormControl>
                              <StarRating
                                value={field.value as number | undefined}
                                onChange={(v) => field.onChange(v)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="best_part"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">💎 Was war dein Highlight des Tages?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="Der Moment, die Session oder die Erkenntnis, die herausragte…" rows={3} className="pr-8" />
                            {field.value && (
                              <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="improve_part"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🛠️ Was würdest du ändern oder verbessern?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="Sei ehrlich — wir möchten den nächsten Workshop noch besser machen." rows={3} className="pr-8" />
                            {field.value && (
                              <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="app_built_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🚀 Was hast du im Workshop gebaut?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="Kurz beschreiben, was deine App macht…" rows={3} className="pr-8" />
                            {field.value && (
                              <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="will_continue_building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🔧 Wirst du nach dem Workshop weiter an deiner App bauen?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="continue-yes" />
                              <Label htmlFor="continue-yes">Ja, auf jeden Fall</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="maybe" id="continue-maybe" />
                              <Label htmlFor="continue-maybe">Vielleicht</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="continue-no" />
                              <Label htmlFor="continue-no">Eher nicht</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recommend_to_others"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">📣 Würdest du diesen Workshop weiterempfehlen?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="rec-yes" />
                              <Label htmlFor="rec-yes">Ja</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="maybe" id="rec-maybe" />
                              <Label htmlFor="rec-maybe">Vielleicht</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="rec-no" />
                              <Label htmlFor="rec-no">Nein</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="testimonial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">💬 Ein kurzes Testimonial in deinen eigenen Worten, das wir intern verwenden dürfen?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="„Der Workshop hat mir geholfen…“" rows={3} className="pr-8" />
                            {field.value && (
                              <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateTestimonial}
                          disabled={generatingTestimonial}
                          className="mt-2"
                        >
                          {generatingTestimonial ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wird generiert…</>
                          ) : field.value ? (
                            <><RefreshCw className="w-4 h-4 mr-2" /> Testimonial neu generieren</>
                          ) : (
                            <><Wand2 className="w-4 h-4 mr-2" /> Testimonial generieren</>
                          )}
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allow_testimonial_public"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="text-sm font-normal leading-snug">
                          Ihr dürft mein Testimonial öffentlich (z.B. auf der Website) verwenden.
                        </Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="anything_else"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">✨ Möchtest du sonst noch etwas mitteilen?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="Beliebige weitere Anmerkungen…" rows={2} className="pr-8" />
                            {field.value && (
                              <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full text-base" disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Wird gesendet…</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Feedback senden 🙌</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RaiffeisenFeedback;