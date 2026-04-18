import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  variant?: "light" | "dark";
}

const AVAILABLE_DATES = [
  { value: "2026-05-28", label: "Thu, 28 May 2026" },
  { value: "2026-06-11", label: "Thu, 11 June 2026" },
  { value: "2026-06-23", label: "Tue, 23 June 2026" },
  { value: "2026-06-30", label: "Tue, 30 June 2026" },
];

const NewsletterSignup = ({ variant = "light" }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const toggleDate = (value: string) => {
    setSelectedDates((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const datesNote = selectedDates.length
      ? `Preferred dates: ${selectedDates
          .map((d) => AVAILABLE_DATES.find((x) => x.value === d)?.label || d)
          .join(", ")}`
      : null;
    const companyValue = [company.trim() || null, datesNote]
      .filter(Boolean)
      .join(" | ") || null;

    const { error } = await supabase.from("newsletter_signups").insert({
      email: email.trim().toLowerCase(),
      name: name.trim() || null,
      company: companyValue,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already signed up!", description: "You're already on the list." });
        setSuccess(true);
      } else {
        toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    } else {
      setSuccess(true);
      toast({ title: "You're on the list! 🎉", description: "We'll notify you about upcoming dates." });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 justify-center text-sm">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className={variant === "dark" ? "text-primary-foreground/80" : "text-muted-foreground"}>
          You're on the list — we'll keep you posted!
        </span>
      </div>
    );
  }

  const isDark = variant === "dark";

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2 justify-center mb-3">
        <Bell className={`w-4 h-4 ${isDark ? "text-primary-foreground/70" : "text-primary"}`} />
        <p className={`text-sm font-medium ${isDark ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          Inform me about other upcoming dates
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            required
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-9 text-sm ${isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40" : ""}`}
          />
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`h-9 text-sm ${isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40" : ""}`}
          />
        </div>
        <Input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={`h-9 text-sm ${isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40" : ""}`}
        />
        <div className="pt-2 text-left">
          <p className={`text-xs font-medium mb-2 ${isDark ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            Which date(s) would work for you?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_DATES.map((d) => (
              <label
                key={d.value}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer text-xs transition-colors ${
                  selectedDates.includes(d.value)
                    ? isDark
                      ? "bg-primary-foreground/20 border-primary-foreground/40"
                      : "bg-primary/10 border-primary/40"
                    : isDark
                    ? "border-primary-foreground/20 hover:bg-primary-foreground/5"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Checkbox
                  checked={selectedDates.includes(d.value)}
                  onCheckedChange={() => toggleDate(d.value)}
                />
                <span className={isDark ? "text-primary-foreground" : ""}>{d.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <Button type="submit" size="sm" disabled={loading} className="h-9 px-6 whitespace-nowrap">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSignup;
