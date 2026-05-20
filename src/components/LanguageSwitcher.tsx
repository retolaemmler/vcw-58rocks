import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const current = i18n.resolvedLanguage?.startsWith("de") ? "DE" : "EN";

  const switchTo = (code: string) => {
    i18n.changeLanguage(code);
    const segments = location.pathname.split("/");
    if (segments[1] === "en" || segments[1] === "de") {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
    }
    const newPath = segments.join("/") || `/${code}`;
    navigate(`${newPath}${location.search}${location.hash}`, { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className} aria-label="Change language">
          <Languages className="w-4 h-4 mr-1" />
          {current}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGS.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => switchTo(l.code)}>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;