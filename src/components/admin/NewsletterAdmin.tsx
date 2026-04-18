import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Bell, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignup {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  preferred_dates: string[] | null;
  created_at: string;
}

const formatPreferredDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-CH", { day: "2-digit", month: "short", year: "numeric" });
};

const NewsletterAdmin = () => {
  const [signups, setSignups] = useState<NewsletterSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSignups();
  }, []);

  const loadSignups = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("newsletter_signups")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSignups(data as NewsletterSignup[]);
    setLoading(false);
  };

  const deleteSignup = async (id: string) => {
    if (!window.confirm("Remove this signup?")) return;
    const { error } = await supabase.from("newsletter_signups").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } else {
      setSignups((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Removed" });
    }
  };

  const copyAllEmails = () => {
    const emails = signups.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast({ title: "Copied!", description: `${signups.length} emails copied` });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Newsletter Signups
            <Badge variant="secondary">{signups.length}</Badge>
          </CardTitle>
          {signups.length > 0 && (
            <Button variant="outline" size="sm" onClick={copyAllEmails}>
              <Copy className="w-4 h-4 mr-1" /> Copy All Emails
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(s.created_at).toLocaleDateString("de-CH")}
                    </TableCell>
                    <TableCell className="text-sm">{s.email}</TableCell>
                    <TableCell className="text-sm">{s.name || "—"}</TableCell>
                    <TableCell className="text-sm">{s.company || "—"}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSignup(s.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {signups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No signups yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterAdmin;
