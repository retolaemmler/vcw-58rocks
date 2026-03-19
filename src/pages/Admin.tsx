import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, DollarSign, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string | null;
  contact_name: string | null;
  amount_total: number;
  currency: string;
  status: string;
  tier: string | null;
  free_vcf_ticket: string;
  created_at: string;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.email) {
      setAuthorized(false);
      return;
    }

    const checkAccess = async () => {
      const { data } = await supabase
        .from("admin_allowed_emails")
        .select("id")
        .eq("email", session.user.email!)
        .maybeSingle();
      
      setAuthorized(!!data);
      
      if (data) {
        fetchOrders();
      }
    };

    checkAccess();
  }, [session]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setOrders(data as Order[]);
    }
    setOrdersLoading(false);
  };

  const handleSignIn = async () => {
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAuthorized(false);
    setOrders([]);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount_total, 0) / 100;
  const totalOrders = orders.length;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
            <p className="text-muted-foreground mt-2">Sign in with your Google account to access the admin dashboard.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={handleSignIn} className="w-full" size="lg">
              Sign in with Google
            </Button>
            <Button variant="ghost" asChild size="sm">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Access Denied</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your account ({session.user.email}) is not authorized to access the admin dashboard.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" />Sign Out</Button>
            <Button variant="ghost" asChild size="sm">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">CHF {totalRevenue.toLocaleString("de-CH", { minimumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">{totalOrders}</p>
            </CardContent>
          </Card>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>VCF Ticket</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {new Date(order.created_at).toLocaleDateString("de-CH")}
                        </TableCell>
                        <TableCell>{order.contact_name ?? "—"}</TableCell>
                        <TableCell className="text-sm">{order.customer_email}</TableCell>
                        <TableCell>{order.customer_name ?? "—"}</TableCell>
                        <TableCell>
                          {order.tier ? <Badge variant="secondary">{order.tier}</Badge> : "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                          CHF {(order.amount_total / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.free_vcf_ticket === "no" ? "outline" : order.free_vcf_ticket === "offered" ? "secondary" : "default"}>
                            {order.free_vcf_ticket}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === "completed" ? "default" : "outline"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No orders yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Admin;
