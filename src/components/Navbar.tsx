import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "@/assets/vcw-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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

interface NavbarProps {
  activeTab?: "you" | "company";
}

const Navbar = ({ activeTab }: NavbarProps) => {
  const { t, i18n } = useTranslation();
  const navLinks = [
    { label: t("nav.what"), id: "why" },
    { label: t("nav.schedule"), id: "agenda" },
    { label: t("nav.participants"), id: "audience" },
    { label: t("nav.requirements"), id: "requirements" },
    { label: t("nav.coaches"), id: "coaches" },
    { label: t("nav.tickets"), id: "pricing" },
  ];
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
    const isHome = /^\/(en|de)\/?$/.test(location.pathname) || location.pathname === "/";
    if (!isHome) {
      navigate(`/${i18n.language || "en"}`, { state: { scrollTo: link.id } });
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
        toast({ title: t("newsletter.alreadyTitle"), description: t("newsletter.alreadyDesc") });
        setNlSuccess(true);
      } else {
        toast({ title: t("newsletter.errorTitle"), description: t("newsletter.errorDesc"), variant: "destructive" });
      }
    } else {
      setNlSuccess(true);
      toast({ title: t("newsletter.successToast"), description: t("newsletter.successToastDesc") });
    }
    setNlLoading(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        activeTab === "you" ? "dark" : ""
      } ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => {
          const isHome = /^\/(en|de)\/?$/.test(location.pathname) || location.pathname === "/";
          if (!isHome) navigate(`/${i18n.language || "en"}`);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }} className="flex items-center">
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
          <LanguageSwitcher />
          <Button size="sm" onClick={() => setNewsletterOpen(true)}>
            <Bell className="w-4 h-4 mr-1" />
            {t("nav.newsletter")}
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
            {t("nav.newsletter")}
          </Button>
        </div>
      )}

      <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("newsletter.title")}</DialogTitle>
            <DialogDescription>{t("newsletter.description")}</DialogDescription>
          </DialogHeader>
          {nlSuccess ? (
            <div className="flex items-center gap-2 justify-center text-sm py-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground">{t("newsletter.success")}</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                required
                placeholder={t("newsletter.emailPlaceholder")}
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
              />
              <Input
                placeholder={t("newsletter.namePlaceholder")}
                value={nlName}
                onChange={(e) => setNlName(e.target.value)}
              />
              <Input
                placeholder={t("newsletter.companyPlaceholder")}
                value={nlCompany}
                onChange={(e) => setNlCompany(e.target.value)}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={nlLoading}>
                  {nlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("newsletter.subscribe")}
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
