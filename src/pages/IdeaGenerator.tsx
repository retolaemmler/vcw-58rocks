import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Lightbulb, Sparkles, Copy, Check, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Idea {
  title: string;
  summary: string;
  targetUser: string;
  expandedPrompt?: string;
  isExpanding?: boolean;
}

const businessChips = [
  "Internal team dashboard",
  "Client onboarding portal",
  "Invoice automation tool",
];

const consumerChips = [
  "Fitness tracker with social features",
  "Recipe sharing community",
  "Local event discovery app",
  "Personal budget planner",
  "Habit tracker with streaks",
];

export default function IdeaGenerator() {
  const [prompt, setPrompt] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateIdeas = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setIdeas([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-ideas", {
        body: { prompt: text, type: "ideas" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setIdeas(data.ideas || []);
    } catch (e: any) {
      toast({
        title: "Error generating ideas",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const expandIdea = async (index: number) => {
    const idea = ideas[index];
    setIdeas((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isExpanding: true } : item))
    );

    try {
      const { data, error } = await supabase.functions.invoke("generate-ideas", {
        body: {
          type: "expand",
          ideaSummary: `${idea.title}: ${idea.summary} (Target user: ${idea.targetUser})`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setIdeas((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, expandedPrompt: data.prompt, isExpanding: false } : item
        )
      );
    } catch (e: any) {
      setIdeas((prev) =>
        prev.map((item, i) => (i === index ? { ...item, isExpanding: false } : item))
      );
      toast({
        title: "Error expanding idea",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const handleChipClick = (chip: string) => {
    setPrompt(chip);
    generateIdeas(chip);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">App Idea Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Describe your interest area and get AI-generated app ideas you can build in the workshop.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4 mb-8">
          <Textarea
            placeholder="Describe what kind of app you'd like to build, your industry, or a problem you want to solve..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                generateIdeas(prompt);
              }
            }}
          />
          <Button
            onClick={() => generateIdeas(prompt)}
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Ideas
              </>
            )}
          </Button>
        </div>

        {/* Suggestion chips */}
        {ideas.length === 0 && !isLoading && (
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Business / Internal</p>
              <div className="flex flex-wrap gap-2">
                {businessChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1.5 text-sm rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Consumer / Public</p>
              <div className="flex flex-wrap gap-2">
                {consumerChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1.5 text-sm rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {ideas.map((idea, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{idea.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">{idea.summary}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  {idea.targetUser}
                </div>

                {!idea.expandedPrompt && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => expandIdea(i)}
                    disabled={idea.isExpanding}
                  >
                    {idea.isExpanding ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Generating prompt...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" /> Generate Lovable Prompt
                      </>
                    )}
                  </Button>
                )}

                {idea.expandedPrompt && (
                  <div className="relative mt-2">
                    <pre className="bg-muted rounded-md p-4 text-sm whitespace-pre-wrap font-sans text-foreground overflow-x-auto">
                      {idea.expandedPrompt}
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(idea.expandedPrompt!, i)}
                    >
                      {copiedIndex === i ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
