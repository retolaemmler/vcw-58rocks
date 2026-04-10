import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/vcw-logo.png";

const navLinks = [
  { label: "Build", id: "why" },
  { label: "Schedule", id: "agenda" },
  { label: "Participants", id: "audience" },
  { label: "Requirements", id: "requirements" },
  { label: "Coaches", id: "coaches" },
  { label: "Tickets", id: "pricing" },
  { label: "Ideas", id: "ideas", href: "/ideas" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (link: typeof navLinks[0]) => {
    setMobileOpen(false);
    if (link.href) {
      navigate(link.href);
    } else if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: link.id } });
    } else {
      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
    }
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
              className={`text-sm font-medium transition-colors ${
                link.href && location.pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
