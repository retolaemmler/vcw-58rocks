import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AVAILABLE_DATES = [
  { value: "2026-05-28", label: "Thu, 28 May 2026" },
  { value: "2026-06-11", label: "Thu, 11 June 2026" },
  { value: "2026-06-23", label: "Tue, 23 June 2026" },
  { value: "2026-06-30", label: "Tue, 30 June 2026" },
];

const UpdateDates = () => {
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
    const { data, error } = await supabase.functions.invoke("update-newsletter-dates", {
      body: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        company: company.trim(),
        preferred_dates: selectedDates,
      },
    });

    setLoading(false);

    if (error || (data && data.error)) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us.",
        variant: "destructive",
      });
      return;
    }

    setSuccess(true);
    toast({
      title: "Updated! 🎉",
      description: data?.found
        ? "Your preferred dates have been updated."
        : "We've added you to the list with your preferred dates.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Pick your preferred dates
            </h1>
            <p className="text-muted-foreground">
              The dates we suggested earlier weren't a fit for everyone — here are
              the current options. Select all that work for you. This is{" "}
              <span className="italic">non-binding, no commitment required.</span>
            </p>
          </div>

          {success ? (
            <div className="rounded-xl border bg-card p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Thanks — you're updated!</h2>
              <p className="text-muted-foreground mb-6">
                We'll get in touch as soon as a date matching your preferences is
                confirmed.
              </p>
              <Button asChild variant="outline">
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border bg-card p-6 sm:p-8 space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    placeholder="Optional"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-1">
                  Which date(s) would work for you?
                </p>
                <p className="text-xs italic text-muted-foreground/80 mb-3">
                  Non-binding — no commitment required.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_DATES.map((d) => (
                    <label
                      key={d.value}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                        selectedDates.includes(d.value)
                          ? "bg-primary/10 border-primary/40"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        checked={selectedDates.includes(d.value)}
                        onCheckedChange={() => toggleDate(d.value)}
                      />
                      <span>{d.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={loading} className="px-6">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save my dates"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateDates;