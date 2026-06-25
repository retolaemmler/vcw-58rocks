import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeedbackLangToggle = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const current = lang === "de" ? "de" : "en";

  const switchTo = (target: "en" | "de") => {
    if (target === current) return;
    const rest = location.pathname.replace(/^\/(en|de)/, "");
    navigate(`/${target}${rest}${location.search}${location.hash}`);
  };

  return (
    <div className="flex justify-end mb-4">
      <div className="inline-flex rounded-md border border-border bg-background p-0.5">
        {(["en", "de"] as const).map((l) => (
          <Button
            key={l}
            type="button"
            size="sm"
            variant={current === l ? "default" : "ghost"}
            className="h-7 px-3 text-xs uppercase"
            onClick={() => switchTo(l)}
          >
            {l}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FeedbackLangToggle;