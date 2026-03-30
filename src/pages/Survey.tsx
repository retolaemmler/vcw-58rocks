import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClearableInput } from "@/components/ClearableInput";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";
import MicrophoneButton from "@/components/MicrophoneButton";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/vcw-logo.png";

const surveySchema = z.object({
  email: z.string().optional(),
  participant_name: z.string().optional(),
  no_email: z.boolean().default(false),
  ai_coding_experience: z.string().optional(),
  lovable_experience: z.string().optional(),
  workshop_goals: z.string().optional(),
  success_criteria: z.string().optional(),
  has_app_idea: z.enum(["yes", "no"]).optional(),
  app_idea_description: z.string().optional(),
  app_audience: z.enum(["public", "internal"]).optional(),
  building_blocks: z.string().optional(),
  drink_preference: z.enum(["coffee", "tea", "both"]).optional(),
  dietary: z.enum(["none", "vegetarian", "vegan"]).optional(),
  anything_else: z.string().optional(),
}).refine(
  (data) => data.no_email ? (data.participant_name && data.participant_name.trim().length > 0) : (data.email && data.email.trim().length > 0),
  { message: "Please provide your email or name", path: ["email"] }
);

type SurveyFormValues = z.infer<typeof surveySchema>;

// Chip selector component
const ChipSelect = ({
  options,
  selected,
  onChange,
  multiple = true,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => {
            if (multiple) {
              onChange(isSelected ? selected.filter((s) => s !== opt) : [...selected, opt]);
            } else {
              onChange(isSelected ? [] : [opt]);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            isSelected
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const AI_EXPERIENCE_OPTIONS = ["Never tried it", "Fiddled around, nothing serious", "Built and deployed an app before"];
const LOVABLE_EXPERIENCE_OPTIONS = ["Heard about it", "Watched a demo", "Played around with it", "Built something real"];
const GOAL_CHIPS = ["Build my first app", "Prototype an idea fast", "Understand what's possible", "Network with builders", "Have fun 🎉"];
const SUCCESS_CHIPS = ["Walk out with a working app", "Know how to use Lovable solo", "Clear roadmap for my project", "New connections made", "Mindset shift about coding"];
const BUILDING_BLOCK_CHIPS = ["Email / notifications", "Stripe payments", "User login / auth", "HubSpot CRM", "Bexio", "Database / storage", "File uploads", "Maps / location", "Calendar", "Analytics", "API integrations", "AI features"];

const Survey = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<"loading" | "invalid" | "form" | "submitted">("loading");
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [noEmail, setNoEmail] = useState(false);
  const [nameValidated, setNameValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSuccess, setSelectedSuccess] = useState<string[]>([]);
  const [successDetails, setSuccessDetails] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      email: "",
      participant_name: "",
      no_email: false,
      ai_coding_experience: "",
      lovable_experience: "",
      workshop_goals: "",
      success_criteria: "",
      has_app_idea: "no",
      app_idea_description: "",
      app_audience: undefined,
      building_blocks: "",
      drink_preference: undefined,
      dietary: "none",
      anything_else: "",
    },
  });

  const hasAppIdea = form.watch("has_app_idea");
  const identityReady = noEmail ? nameValidated : emailValidated;

  useEffect(() => {
    if (!token) { setPageState("invalid"); return; }
    supabase.from("survey_tokens").select("id").eq("token", token).maybeSingle()
      .then(({ data }) => { if (data) { setTokenId(data.id); setPageState("form"); } else setPageState("invalid"); });
  }, [token]);

  // Sync chip selections into form fields
  useEffect(() => {
    const custom = form.getValues("workshop_goals");
    const chipText = selectedGoals.join(", ");
    const hasCustom = custom && !GOAL_CHIPS.some((c) => custom.includes(c)) && custom !== chipText;
    form.setValue("workshop_goals", hasCustom ? `${chipText}; ${custom}` : chipText, { shouldValidate: true });
  }, [selectedGoals]);

  useEffect(() => {
    const chips = selectedSuccess.join(", ");
    form.setValue("success_criteria", chips && successDetails ? `${chips}; ${successDetails}` : chips || successDetails, { shouldValidate: true });
  }, [selectedSuccess, successDetails]);

  useEffect(() => {
    const custom = form.getValues("building_blocks");
    const chipText = selectedBlocks.join(", ");
    const hasCustom = custom && !BUILDING_BLOCK_CHIPS.some((c) => custom.includes(c)) && custom !== chipText;
    form.setValue("building_blocks", hasCustom ? `${chipText}; ${custom}` : chipText, { shouldValidate: true });
  }, [selectedBlocks]);

  const validateEmail = async (email: string) => {
    if (!email || !tokenId) return;
    setEmailChecking(true);
    setEmailError(null);
    setEmailValidated(false);

    const { data: existing } = await supabase.from("survey_responses").select("id")
      .eq("token_id", tokenId).eq("email", email.trim().toLowerCase()).maybeSingle();
    if (existing) { setEmailError("You've already submitted a response."); setEmailChecking(false); return; }

    const { data } = await supabase.functions.invoke("validate-survey-email", { body: { email: email.trim().toLowerCase() } });
    if (data?.valid) { setEmailValidated(true); } else {
      setEmailError("This email doesn't match any order. Please use your registration email, or click \"I don't remember\" below.");
    }
    setEmailChecking(false);
  };

  const handleNoEmail = () => {
    setNoEmail(true);
    form.setValue("no_email", true);
    setEmailError(null);
    setTimeout(() => {
      const nameInput = document.querySelector<HTMLInputElement>('input[name="participant_name"], input[placeholder*="name" i]');
      if (nameInput) nameInput.focus();
    }, 100);
  };

  const handleNameContinue = () => {
    const name = form.getValues("participant_name");
    if (name && name.trim().length > 0) setNameValidated(true);
  };

  const onSubmit = async (values: SurveyFormValues) => {
    if (!tokenId || !identityReady) return;
    setSubmitting(true);

    const { error } = await supabase.from("survey_responses").insert({
      token_id: tokenId,
      email: noEmail ? null : values.email!.trim().toLowerCase(),
      participant_name: noEmail ? values.participant_name!.trim() : null,
      ai_coding_experience: values.ai_coding_experience || "",
      lovable_experience: values.lovable_experience || "",
      workshop_goals: values.workshop_goals || "",
      success_criteria: values.success_criteria || "",
      has_app_idea: values.has_app_idea === "yes",
      app_idea_description: values.has_app_idea === "yes" ? values.app_idea_description || null : null,
      app_audience: values.has_app_idea === "yes" ? values.app_audience || null : null,
      building_blocks: values.building_blocks || "",
      drink_preference: values.drink_preference || "none",
      dietary: values.dietary || "none",
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
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
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
            <CardTitle className="font-display text-2xl">You're all set! 🎉</CardTitle>
            <p className="text-muted-foreground mt-2">
              Thanks for taking the time — we'll use your answers to make the workshop awesome for you. See you there!
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
          <img src={logo} alt="Vibe Code Workshop" className="h-24 w-24 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold">Let's Get You Ready! 🚀</h1>
          <p className="text-muted-foreground mt-2">
            Quick prep survey — takes about 3 minutes. Tap answers or type your own.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">

                {/* Identity Section */}
                {!noEmail ? (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's your email? (the one you registered with)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            onBlur={(e) => { field.onBlur(); validateEmail(e.target.value); }}
                            disabled={emailValidated}
                          />
                        </FormControl>
                        {emailChecking && <p className="text-sm text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking…</p>}
                        {emailError && (
                          <div>
                            <p className="text-sm text-destructive">{emailError}</p>
                            <button type="button" onClick={handleNoEmail} className="text-sm text-primary underline mt-1 hover:text-primary/80">
                              I don't remember my email →
                            </button>
                          </div>
                        )}
                        {emailValidated && <p className="text-sm text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Found you! ✨</p>}
                        {!emailError && !emailChecking && !emailValidated && (
                          <button type="button" onClick={handleNoEmail} className="text-sm text-muted-foreground underline hover:text-primary">
                            I don't remember my email
                          </button>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="participant_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No worries! What's your name?</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              placeholder="Your full name"
                              disabled={nameValidated}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleNameContinue(); } }}
                            />
                            {!nameValidated && (
                              <Button type="button" onClick={handleNameContinue} disabled={!field.value?.trim()}>
                                Continue
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        {nameValidated && <p className="text-sm text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Welcome, {field.value}! 👋</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {identityReady && (
                  <>
                    {/* Q1: AI coding experience */}
                    <FormField
                      control={form.control}
                      name="ai_coding_experience"
                      render={({ field }) => {
                        const chipValue = AI_EXPERIENCE_OPTIONS.find((o) => field.value?.startsWith(o)) || "";
                        const detailsValue = chipValue && field.value ? field.value.slice(chipValue.length).replace(/^;\s*/, "") : (AI_EXPERIENCE_OPTIONS.includes(field.value || "") ? "" : field.value || "");
                        return (
                          <FormItem>
                            <FormLabel className="text-base">🤖 Have you built a website using AI tools prior to this workshop?</FormLabel>
                            <div className="space-y-3">
                              <ChipSelect
                                options={AI_EXPERIENCE_OPTIONS}
                                selected={chipValue ? [chipValue] : []}
                                onChange={(sel) => {
                                  const chip = sel[0] || "";
                                  const details = detailsValue;
                                  field.onChange(chip && details ? `${chip}; ${details}` : chip || details);
                                }}
                                multiple={false}
                              />
                              <FormControl>
                                <div className="flex items-center gap-1">
                                  <ClearableInput
                                    value={detailsValue}
                                    onChange={(e) => {
                                      const details = (e.target as HTMLInputElement).value;
                                      field.onChange(chipValue && details ? `${chipValue}; ${details}` : chipValue || details);
                                    }}
                                    onClear={() => field.onChange(chipValue || "")}
                                    placeholder="Add details if you like…"
                                    className="text-sm"
                                  />
                                  <MicrophoneButton onTranscript={(text) => {
                                    const newDetails = detailsValue ? `${detailsValue} ${text}` : text;
                                    field.onChange(chipValue && newDetails ? `${chipValue}; ${newDetails}` : chipValue || newDetails);
                                  }} />
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Q2: Lovable experience */}
                    <FormField
                      control={form.control}
                      name="lovable_experience"
                      render={({ field }) => {
                        const chipValue = LOVABLE_EXPERIENCE_OPTIONS.find((o) => field.value?.startsWith(o)) || "";
                        const detailsValue = chipValue && field.value ? field.value.slice(chipValue.length).replace(/^;\s*/, "") : (LOVABLE_EXPERIENCE_OPTIONS.includes(field.value || "") ? "" : field.value || "");
                        return (
                          <FormItem>
                            <FormLabel className="text-base">💜 What's your experience with Lovable.dev?</FormLabel>
                            <div className="space-y-3">
                              <ChipSelect
                                options={LOVABLE_EXPERIENCE_OPTIONS}
                                selected={chipValue ? [chipValue] : []}
                                onChange={(sel) => {
                                  const chip = sel[0] || "";
                                  const details = detailsValue;
                                  field.onChange(chip && details ? `${chip}; ${details}` : chip || details);
                                }}
                                multiple={false}
                              />
                              <FormControl>
                                <div className="flex items-center gap-1">
                                  <ClearableInput
                                    value={detailsValue}
                                    onChange={(e) => {
                                      const details = (e.target as HTMLInputElement).value;
                                      field.onChange(chipValue && details ? `${chipValue}; ${details}` : chipValue || details);
                                    }}
                                    onClear={() => field.onChange(chipValue || "")}
                                    placeholder="Add details if you like…"
                                    className="text-sm"
                                  />
                                  <MicrophoneButton onTranscript={(text) => {
                                    const newDetails = detailsValue ? `${detailsValue} ${text}` : text;
                                    field.onChange(chipValue && newDetails ? `${chipValue}; ${newDetails}` : chipValue || newDetails);
                                  }} />
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Q3: Workshop goals */}
                    <FormField
                      control={form.control}
                      name="workshop_goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">🎯 What do you want to get out of this workshop?</FormLabel>
                          <p className="text-sm text-muted-foreground">Pick as many as you like, or add your own</p>
                          <div className="space-y-3">
                            <ChipSelect options={GOAL_CHIPS} selected={selectedGoals} onChange={setSelectedGoals} />
                            <FormControl>
                              <div className="flex items-center gap-1">
                                <Input
                                  placeholder="Add something else…"
                                  className="text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const val = (e.target as HTMLInputElement).value.trim();
                                      if (val) {
                                        const current = field.value || "";
                                        field.onChange(current ? `${current}, ${val}` : val);
                                        (e.target as HTMLInputElement).value = "";
                                      }
                                    }
                                  }}
                                />
                                <MicrophoneButton onTranscript={(text) => {
                                  const current = field.value || "";
                                  field.onChange(current ? `${current}, ${text}` : text);
                                }} />
                              </div>
                            </FormControl>
                          </div>
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
                          <FormLabel className="text-base">🏆 What would make this day a WIN for you?</FormLabel>
                          <p className="text-sm text-muted-foreground">And what would feel like a miss?</p>
                          <div className="space-y-3">
                            <ChipSelect options={SUCCESS_CHIPS} selected={selectedSuccess} onChange={setSelectedSuccess} />
                            <FormControl>
                              <div className="flex items-center gap-1">
                                <ClearableInput
                                  placeholder="Add details if you like…"
                                  className="text-sm"
                                  value={successDetails}
                                  onChange={(e) => setSuccessDetails((e.target as HTMLInputElement).value)}
                                  onClear={() => setSuccessDetails("")}
                                />
                                <MicrophoneButton onTranscript={(text) => {
                                  setSuccessDetails(prev => prev ? `${prev} ${text}` : text);
                                }} />
                              </div>
                            </FormControl>
                          </div>
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
                          <FormLabel className="text-base">💡 Got an app idea already?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="idea-yes" />
                                <Label htmlFor="idea-yes">Yes, ready to roll!</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="idea-no" />
                                <Label htmlFor="idea-no">Not yet, still exploring</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {hasAppIdea === "yes" && (
                      <>
                        <FormField
                          control={form.control}
                          name="app_idea_description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base">📝 Tell us about it! What should the app do?</FormLabel>
                              <FormControl>
                              <div className="flex items-start gap-1">
                                <div className="relative flex-1">
                                  <Textarea {...field} placeholder="Even a rough idea is great — we'll help you shape it!" rows={3} className="pr-8" />
                                  {field.value && (
                                    <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <MicrophoneButton onTranscript={(text) => {
                                  field.onChange(field.value ? `${field.value} ${text}` : text);
                                }} className="mt-1" />
                              </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="app_audience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base">🌍 Who is it for?</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="public" id="audience-public" />
                                    <Label htmlFor="audience-public">Public / customers</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="internal" id="audience-internal" />
                                    <Label htmlFor="audience-internal">Internal / team</Label>
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
                          <FormLabel className="text-base">🧱 What building blocks might you need?</FormLabel>
                          <p className="text-sm text-muted-foreground">Tap all that apply — helps us prepare examples</p>
                          <div className="space-y-3">
                            <ChipSelect options={BUILDING_BLOCK_CHIPS} selected={selectedBlocks} onChange={setSelectedBlocks} />
                            <FormControl>
                              <div className="flex items-center gap-1">
                                <Input
                                  placeholder="Remove Type and press Enter"
                                  className="text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const val = (e.target as HTMLInputElement).value.trim();
                                      if (val) {
                                        const current = field.value || "";
                                        field.onChange(current ? `${current}, ${val}` : val);
                                        (e.target as HTMLInputElement).value = "";
                                      }
                                    }
                                  }}
                                />
                                <MicrophoneButton onTranscript={(text) => {
                                  const current = field.value || "";
                                  field.onChange(current ? `${current}, ${text}` : text);
                                }} />
                              </div>
                            </FormControl>
                          </div>
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
                          <FormLabel className="text-base">🥗 Any dietary preferences?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="diet-none" />
                                <Label htmlFor="diet-none">I eat everything</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vegetarian" id="diet-veg" />
                                <Label htmlFor="diet-veg">🌿 Vegetarian</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vegan" id="diet-vegan" />
                                <Label htmlFor="diet-vegan">🌱 Vegan</Label>
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
                          <FormLabel className="text-base">💬 Anything else we should know?</FormLabel>
                          <FormControl>
                              <div className="flex items-start gap-1">
                                <div className="relative flex-1">
                                  <Textarea {...field} placeholder="Add anything else..." rows={2} className="pr-8" />
                                  {field.value && (
                                    <button type="button" tabIndex={-1} onClick={() => field.onChange("")} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors">
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <MicrophoneButton onTranscript={(text) => {
                                  field.onChange(field.value ? `${field.value} ${text}` : text);
                                }} className="mt-1" />
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
                        <><Sparkles className="w-4 h-4 mr-2" /> Submit & Get ready! 🚀</>
                      )}
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
