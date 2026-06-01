import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Calendar, MapPin, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderInfo {
  customer_email: string;
  customer_name: string | null;
  amount_total: number;
  currency: string;
}

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const confirmOrder = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("confirm-order", {
          body: { session_id: sessionId }
        });

        if (fnError) throw fnError;
        if (data?.order) setOrder(data.order);
      } catch (err: unknown) {
        console.error("Confirmation error:", err);
        setError("Could not verify your order. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-teal/10 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-purple/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        {loading ?
        <>
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Confirming your order...</p>
          </> :
        error ?
        <>
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Homepage
              </Link>
            </Button>
          </> :

        <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">Thank you! 🙏</h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Your spot at the Vibe Code Workshop is reserved.
              {order?.customer_email &&
            <> A confirmation email has been sent to <span className="font-medium text-foreground">{order.customer_email}</span>.</>
            }
            </p>

            









          

            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Homepage
              </Link>
            </Button>
          </>
        }
      </div>
    </main>);

};

export default Confirmation;