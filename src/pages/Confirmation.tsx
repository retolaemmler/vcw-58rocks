import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Confirmation = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">Thank you! 🙏

        </h1>

        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">Your spot at the Vibe Code Workshop is reserved. If the min. of 10 participants is not reached, the money will be refunded to you. </p>

        <div className="rounded-xl border border-border/50 bg-card p-6 mb-8 text-left space-y-3">
          <h2 className="font-display font-semibold text-lg mb-4">Event Details</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>Thursday, 16 April 2026 · 9:00 – 17:00</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>Zurich, Switzerland (exact location TBD)</span>
          </div>
        </div>

        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </Button>
      </div>
    </main>);};
export default Confirmation;