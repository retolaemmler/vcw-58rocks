import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/vcw-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Bell } from "lucide-react";

const navLinks = [
  { label: "What", id: "why" },
  
  { label: "Schedule", id: "agenda" },
  { label: "Participants", id: "audience" },
  { label: "Requirements", id: "requirements" },
  { label: "Coaches", id: "coaches" },
  { label: "Tickets", id: "pricing" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlName, setNlName] = useState("");
  const [nlCompany, setNlCompany] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlSuccess, setNlSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (link: typeof navLinks[0]) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: link.id } });
    } else {
      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail.trim()) return;
    setNlLoading(true);
    const { error } = await supabase.from("newsletter_signups").insert({
      email: nlEmail.trim().toLowerCase(),
      name: nlName.trim() || null,
      company: nlCompany.trim() || null,
    });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already signed up!", description: "You're already on the list." });
        setNlSuccess(true);
      } else {
        toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    } else {
      setNlSuccess(true);
      toast({ title: "You're on the list! 🎉", description: "We'll keep you posted." });
    }
    setNlLoading(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => { if (location.pathname !== "/") navigate("/"); else window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link)}
              className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
          <Button size="sm" onClick={() => setNewsletterOpen(true)}>
            <Bell className="w-4 h-4 mr-1" />
            Newsletter
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50 px-4 pb-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link)}
              className="block w-full text-left py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button size="sm" className="mt-2 w-full" onClick={() => { setMobileOpen(false); setNewsletterOpen(true); }}>
            <Bell className="w-4 h-4 mr-1" />
            Newsletter
          </Button>
        </div>
      )}

      <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to our Newsletter</DialogTitle>
            <DialogDescription>
              Get updates about upcoming workshops and news.
            </DialogDescription>
          </DialogHeader>
          {nlSuccess ? (
            <div className="flex items-center gap-2 justify-center text-sm py-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground">You're on the list — we'll keep you posted!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                required
                placeholder="Email *"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
              />
              <Input
                placeholder="Name"
                value={nlName}
                onChange={(e) => setNlName(e.target.value)}
              />
              <Input
                placeholder="Company"
                value={nlCompany}
                onChange={(e) => setNlCompany(e.target.value)}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={nlLoading}>
                  {nlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
