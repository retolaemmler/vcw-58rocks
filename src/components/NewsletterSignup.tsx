import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  variant?: "light" | "dark";
}

 const WaitlistSignup = ({ variant = "light" }: NewsletterSignupProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("newsletter_signups").insert({
      email: email.trim().toLowerCase(),
      name: name.trim() || null,
      company: company.trim() || null,
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
          {t("newsletter.informTitle")}
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
        <div className="flex justify-end pt-1">
          <Button type="submit" size="sm" disabled={loading} className="h-9 px-6 whitespace-nowrap">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
          </Button>
        </div>
      </form>
    </div>
  );
};

 export default WaitlistSignup;
