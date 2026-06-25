import { useEffect, useState } from "react";

const usePersistedTab = (key: string, defaultValue: string) => {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return defaultValue;
    return localStorage.getItem(key) ?? defaultValue;
  });
  useEffect(() => {
    try { localStorage.setItem(key, value); } catch {}
  }, [key, value]);
  return [value, setValue] as const;
};
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, DollarSign, ShoppingCart, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/vcw-logo.png";
import SurveyAdmin from "@/components/admin/SurveyAdmin";
import FeedbackAdmin from "@/components/admin/FeedbackAdmin";
import FeedbackDeAdmin from "@/components/admin/FeedbackDeAdmin";
import NewsletterAdmin from "@/components/admin/NewsletterAdmin";
import RaiffeisenSurveyAdmin from "@/components/admin/RaiffeisenSurveyAdmin";
import RaiffeisenFeedbackAdmin from "@/components/admin/RaiffeisenFeedbackAdmin";
import RaiffeisenDashboard from "@/components/admin/RaiffeisenDashboard";
import MasterclassJune30SurveyAdmin from "@/components/admin/MasterclassJune30SurveyAdmin";
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

type AuthState = "loading" | "unauthenticated" | "checking" | "authorized" | "denied";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [mainTab, setMainTab] = usePersistedTab("admin.mainTab", "orders");
  const [surveyTab, setSurveyTab] = usePersistedTab("admin.surveyTab", "prep");
  const [ordersBatchTab, setOrdersBatchTab] = usePersistedTab("admin.ordersBatchTab", "workshop2");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setAuthState("unauthenticated");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setAuthState("unauthenticated");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.email) return;

    setAuthState("checking");

    const checkAccess = async () => {
      const { data } = await supabase
        .from("admin_allowed_emails")
        .select("id")
        .eq("email", session.user.email!)
        .maybeSingle();

      if (data) {
        setAuthState("authorized");
        fetchOrders();
      } else {
        setAuthState("denied");
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

    if (error) {
      console.error("Error fetching orders:", error);
    }
    if (data) {
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
    setAuthState("unauthenticated");
    setOrders([]);
  };

  const BATCH1_END = new Date("2026-04-16T00:00:00Z").getTime();
  const BATCH2_END = new Date("2026-06-30T23:59:59Z").getTime();
  const filteredOrders = orders.filter((o) => {
    const t = new Date(o.created_at).getTime();
    if (ordersBatchTab === "workshop1") return t < BATCH1_END;
    if (ordersBatchTab === "workshop2") return t >= BATCH1_END && t < BATCH2_END;
    return true;
  });
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.amount_total, 0) / 100;
  const totalOrders = filteredOrders.length;

  const NavBar = ({ children }: { children?: React.ReactNode }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md shadow-sm border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </Link>
        {children}
      </div>
    </nav>
  );

  if (authState === "loading" || authState === "checking") {
    return (
      <main className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <main className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center pt-32 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
              <p className="text-muted-foreground mt-2">Sign in with your Google account to access the admin dashboard.</p>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSignIn} className="w-full" size="lg">
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (authState === "denied") {
    return (
      <main className="min-h-screen bg-background">
        <NavBar>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </NavBar>
        <div className="flex items-center justify-center pt-32 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-destructive">Access Denied</CardTitle>
              <p className="text-muted-foreground mt-2">
                Your account ({session?.user.email}) is not authorized.
              </p>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <NavBar>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{session?.user.email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </div>
      </NavBar>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <h1 className="font-display text-2xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="survey">Surveys</TabsTrigger>
            <TabsTrigger value="newsletter">Waitlist</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Tabs value={ordersBatchTab} onValueChange={setOrdersBatchTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="workshop1">Workshop 1 (April 26)</TabsTrigger>
                <TabsTrigger value="workshop2">Workshop 2 (June 26)</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
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
                          <TableHead>Amount</TableHead>
                          <TableHead>VCF Ticket</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="whitespace-nowrap text-sm">
                              {new Date(order.created_at).toLocaleDateString("de-CH")}
                            </TableCell>
                            <TableCell>{order.contact_name ?? "—"}</TableCell>
                            <TableCell className="text-sm">{order.customer_email}</TableCell>
                            <TableCell>{order.customer_name ?? "—"}</TableCell>
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
                        {filteredOrders.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
          </TabsContent>

          <TabsContent value="survey">
            <Tabs value={surveyTab} onValueChange={setSurveyTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="prep">Edition 1 Prep Survey</TabsTrigger>
                <TabsTrigger value="masterclass-june30">Edition 2 Prep Survey</TabsTrigger>
                <TabsTrigger value="feedback">Post-Workshop Feedback</TabsTrigger>
                <TabsTrigger value="raiffeisen">Raiffeisen Prep</TabsTrigger>
                <TabsTrigger value="raiffeisen-feedback">Raiffeisen Feedback</TabsTrigger>
              </TabsList>
              <TabsContent value="prep">
                <SurveyAdmin />
              </TabsContent>
              <TabsContent value="masterclass-june30">
                <MasterclassJune30SurveyAdmin />
              </TabsContent>
              <TabsContent value="raiffeisen">
                <RaiffeisenSurveyAdmin />
              </TabsContent>
              <TabsContent value="raiffeisen-feedback">
                <RaiffeisenFeedbackAdmin />
              </TabsContent>
              <TabsContent value="feedback">
                <FeedbackAdmin />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Admin;
