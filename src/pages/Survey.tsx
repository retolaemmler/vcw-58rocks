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
  email: z.string().email("Please enter a valid email address"),
  ai_coding_experience: z.string().min(1, "Please share your experience"),
  lovable_experience: z.string().min(1, "Please share your experience"),
  workshop_goals: z.string().min(1, "Please share your goals"),
  success_criteria: z.string().min(1, "Please share your success criteria"),
  has_app_idea: z.enum(["yes", "no"]),
  app_idea_description: z.string().optional(),
  app_audience: z.enum(["public", "internal"]).optional(),
  building_blocks: z.string().min(1, "Please list the building blocks you need"),
  drink_preference: z.enum(["coffee", "tea", "both"]),
  dietary: z.enum(["none", "vegetarian", "vegan"]),
  anything_else: z.string().optional(),
});

type SurveyFormValues = z.infer<typeof surveySchema>;

const Survey = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<"loading" | "invalid" | "form" | "submitted" | "already_submitted">("loading");
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      email: "",
      ai_coding_experience: "",
      lovable_experience: "",
      workshop_goals: "",
      success_criteria: "",
      has_app_idea: "no",
      app_idea_description: "",
      app_audience: undefined,
      building_blocks: "",
      drink_preference: "coffee",
      dietary: "none",
      anything_else: "",
    },
  });

  const hasAppIdea = form.watch("has_app_idea");

  useEffect(() => {
    if (!token) {
      setPageState("invalid");
      return;
    }

    const validateToken = async () => {
      const { data } = await supabase
        .from("survey_tokens")
        .select("id")
        .eq("token", token)
        .maybeSingle();

      if (!data) {
        setPageState("invalid");
      } else {
        setTokenId(data.id);
        setPageState("form");
      }
    };

    validateToken();
  }, [token]);

  const validateEmail = async (email: string) => {
    if (!email || !tokenId) return;

    setEmailChecking(true);
    setEmailError(null);
    setEmailValidated(false);

    // Check if already submitted
    const { data: existing } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("token_id", tokenId)
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existing) {
      setEmailError("You've already submitted a response.");
      setEmailChecking(false);
      return;
    }

    // Validate email against orders
    const { data } = await supabase.functions.invoke("validate-survey-email", {
      body: { email: email.trim().toLowerCase() },
    });

    if (data?.valid) {
      setEmailValidated(true);
    } else {
      setEmailError("This email doesn't match any order. Please use the email you registered with.");
    }
    setEmailChecking(false);
  };

  const onSubmit = async (values: SurveyFormValues) => {
    if (!tokenId || !emailValidated) return;

    setSubmitting(true);
    const { error } = await supabase.from("survey_responses").insert({
      token_id: tokenId,
      email: values.email.trim().toLowerCase(),
      ai_coding_experience: values.ai_coding_experience,
      lovable_experience: values.lovable_experience,
      workshop_goals: values.workshop_goals,
      success_criteria: values.success_criteria,
      has_app_idea: values.has_app_idea === "yes",
      app_idea_description: values.has_app_idea === "yes" ? values.app_idea_description || null : null,
      app_audience: values.has_app_idea === "yes" ? values.app_audience || null : null,
      building_blocks: values.building_blocks,
      drink_preference: values.drink_preference,
      dietary: values.dietary,
      anything_else: values.anything_else || null,
    });

    if (error) {
      console.error("Survey submit error:", error);
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } else {
      setPageState("submitted");
    }
    setSubmitting(false);
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pageState === "invalid") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle>Invalid Survey Link</CardTitle>
            <p className="text-muted-foreground mt-2">This survey link is invalid or has expired.</p>
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
            <CardTitle className="font-display text-2xl">Thank You! 🎉</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your responses have been submitted. We'll use them to make the workshop an amazing experience for you!
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
          <img src={logo} alt="Vibe Code Workshop" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold">Workshop Preparation Survey</h1>
          <p className="text-muted-foreground mt-2">
            Help us tailor the workshop to your needs. This takes about 5 minutes.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address (used when registering)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                          onBlur={(e) => {
                            field.onBlur();
                            validateEmail(e.target.value);
                          }}
                          disabled={emailValidated}
                        />
                      </FormControl>
                      {emailChecking && <p className="text-sm text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Verifying…</p>}
                      {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                      {emailValidated && <p className="text-sm text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Email verified</p>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {emailValidated && (
                  <>
                    {/* Q1: AI coding experience */}
                    <FormField
                      control={form.control}
                      name="ai_coding_experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your experience with AI coding, if any?</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="e.g., I've used ChatGPT for coding, tried GitHub Copilot, etc." rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q2: Lovable experience */}
                    <FormField
                      control={form.control}
                      name="lovable_experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your experience with Lovable.dev, if any?</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="e.g., Never used it, tried it once, built a project, etc." rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q3: Workshop goals */}
                    <FormField
                      control={form.control}
                      name="workshop_goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name the most important things you want to get out of this workshop</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="What do you hope to learn or achieve?" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q4: Success criteria */}
                    <FormField
                      control={form.control}
                      name="success_criteria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What outcome would make it a personal success vs. fail?</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe your ideal outcome" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q5: App idea */}
                    <FormField
                      control={form.control}
                      name="has_app_idea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you already have an app idea you'd like to implement?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="idea-yes" />
                                <Label htmlFor="idea-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="idea-no" />
                                <Label htmlFor="idea-no">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q6: App description (conditional) */}
                    {hasAppIdea === "yes" && (
                      <>
                        <FormField
                          control={form.control}
                          name="app_idea_description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Briefly describe your app idea</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="What should the app do?" rows={3} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Q7: App audience (conditional) */}
                        <FormField
                          control={form.control}
                          name="app_audience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Is this an app for the public or something internal in your company?</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="public" id="audience-public" />
                                    <Label htmlFor="audience-public">Public</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="internal" id="audience-internal" />
                                    <Label htmlFor="audience-internal">Internal</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Q8: Building blocks */}
                    <FormField
                      control={form.control}
                      name="building_blocks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What building blocks will you need?</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="e.g., email, Stripe payment, HubSpot, Bexio, user login, etc." rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q9: Drink preference */}
                    <FormField
                      control={form.control}
                      name="drink_preference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you drink coffee or tea? ☕🍵</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="coffee" id="drink-coffee" />
                                <Label htmlFor="drink-coffee">Coffee</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="tea" id="drink-tea" />
                                <Label htmlFor="drink-tea">Tea</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="both" id="drink-both" />
                                <Label htmlFor="drink-both">Both</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q10: Dietary */}
                    <FormField
                      control={form.control}
                      name="dietary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Are you vegetarian or vegan?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="diet-none" />
                                <Label htmlFor="diet-none">Neither</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vegetarian" id="diet-veg" />
                                <Label htmlFor="diet-veg">Vegetarian</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vegan" id="diet-vegan" />
                                <Label htmlFor="diet-vegan">Vegan</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Q11: Anything else */}
                    <FormField
                      control={form.control}
                      name="anything_else"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anything else we need to know?</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Allergies, accessibility needs, or anything else" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting…</> : "Submit Survey"}
                    </Button>
                  </>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Survey;
