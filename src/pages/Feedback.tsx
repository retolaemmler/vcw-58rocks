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
import { Loader2, CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/vcw-logo.png";

const feedbackSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  participant_name: z.string().optional(),
  nps_score: z.number({ required_error: "Please select a score" }).min(0).max(10),
  overall_rating: z.number({ required_error: "Please rate the workshop" }).min(1).max(5),
  rating_intro: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  rating_workshop_session_1: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  rating_lunch: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  rating_next_level: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  rating_workshop_session_2: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  rating_presentations: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  rating_future: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  rating_qa_beer: z.number({ required_error: "Please rate this section" }).min(1).max(5),
  best_part: z.string().optional(),
  improve_part: z.string().optional(),
  app_built_description: z.string().optional(),
  will_continue_building: z.enum(["yes", "maybe", "no"], { required_error: "Please choose an option" }),
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
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
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
  { key: "rating_intro", label: "👋 Welcome & Intro" },
  { key: "rating_workshop_session_1", label: "🛠️ Workshop Session #1" },
  { key: "rating_lunch", label: "🍕 Lunch Break" },
  { key: "rating_next_level", label: "🚀 Next Level Vibe Coding" },
  { key: "rating_workshop_session_2", label: "🛠️ Workshop Session #2" },
  { key: "rating_presentations", label: "🎤 Presentations & Feedback" },
  { key: "rating_future", label: "🔮 Future of Vibe Coding" },
  { key: "rating_qa_beer", label: "🍺 Q&A + Beer" },
];

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "feedback-default-2748de83f3cd4235b6e3c4469bda0d80";
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<"loading" | "invalid" | "form" | "submitted">("loading");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

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
    supabase.from("survey_tokens").select("id,kind").eq("token", token).maybeSingle()
      .then(({ data }) => {
        if (data) { setTokenId(data.id); setPageState("form"); }
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
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
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
            <CardTitle>Invalid Feedback Link</CardTitle>
            <p className="text-muted-foreground mt-2">This feedback link is invalid or has expired.</p>
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
            <CardTitle className="font-display text-2xl">Thank you! 🙌</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your feedback helps us make the next Vibe Code Workshop even better. You're a star ⭐
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
          <h2 className="font-display text-xl font-semibold">How was your day? 💬</h2>
          <p className="text-muted-foreground mt-2">
            Quick post-workshop feedback — takes about 3 minutes. Your honest input shapes the next edition.
          </p>
        </div>

        {!showForm ? (
          <div className="text-center pt-8">
            <Button
              size="lg"
              className="gradient-bg text-white font-semibold text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => setShowForm(true)}
            >
              Start Feedback (3 min)
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">

                  {/* Identity */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>📧 Your Email (same as your ticket)</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="your@email.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Overall rating */}
                  <FormField
                    control={form.control}
                    name="overall_rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">⭐ Overall, how would you rate the workshop?</FormLabel>
                        <p className="text-sm text-muted-foreground">1 = poor, 5 = amazing</p>
                        <FormControl>
                          <StarRating value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* NPS */}
                  <FormField
                    control={form.control}
                    name="nps_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🤝 How likely are you to recommend this workshop to a friend or colleague?</FormLabel>
                        <p className="text-sm text-muted-foreground">0 = not at all, 10 = absolutely</p>
                        <FormControl>
                          <NpsRating value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Per-section ratings */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-semibold text-base">📅 How did each part land?</h3>
                      <p className="text-sm text-muted-foreground">Rate each session — skip any you don't want to score.</p>
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

                  {/* Best part */}
                  <FormField
                    control={form.control}
                    name="best_part"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">💎 What was the best part of the day?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="The moment, session or insight that stood out…" rows={3} className="pr-8" />
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

                  {/* Improve */}
                  <FormField
                    control={form.control}
                    name="improve_part"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🛠️ What would you change or improve?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="Be honest — we want to make the next one even better." rows={3} className="pr-8" />
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

                  {/* Continue building */}
                  <FormField
                    control={form.control}
                    name="will_continue_building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">🔧 Will you keep building your app after the workshop?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="continue-yes" />
                              <Label htmlFor="continue-yes">Yes, definitely</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="maybe" id="continue-maybe" />
                              <Label htmlFor="continue-maybe">Maybe</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="continue-no" />
                              <Label htmlFor="continue-no">Probably not</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Testimonial */}
                  <FormField
                    control={form.control}
                    name="testimonial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">💬 A short testimonial in your own words?</FormLabel>
                        <p className="text-sm text-muted-foreground">Optional — a sentence we could quote.</p>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="“The workshop helped me…”" rows={3} className="pr-8" />
                            {field.value && (
                              <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormField
                          control={form.control}
                          name="allow_testimonial_public"
                          render={({ field: cbField }) => (
                            <FormItem className="flex items-center gap-2 space-y-0 mt-2">
                              <FormControl>
                                <Checkbox
                                  checked={!!cbField.value}
                                  onCheckedChange={cbField.onChange}
                                  id="allow-public"
                                />
                              </FormControl>
                              <Label htmlFor="allow-public" className="text-sm font-normal text-muted-foreground cursor-pointer">
                                You may publish my testimonial (with my name) on the website.
                              </Label>
                            </FormItem>
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Anything else */}
                  <FormField
                    control={form.control}
                    name="anything_else"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">✨ Anything else you want to share?</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Textarea {...field} placeholder="Add anything else…" rows={2} className="pr-8" />
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
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting…</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Send Feedback 🙌</>
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

export default Feedback;
