import { useLayoutEffect, useRef } from "react";
import i18n from "@/i18n";
import { Navigate, Outlet, useLocation, useParams } from "@/lib/router-compat";
import Feedback from "@/pages/Feedback";
import FeedbackDe from "@/pages/FeedbackDe";
import MasterclassEveningFeedback from "@/pages/MasterclassEveningFeedback";
import MasterclassEveningFeedbackDe from "@/pages/MasterclassEveningFeedbackDe";

export const SUPPORTED_LANGS = ["en", "de"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

const isLang = (value: string | undefined): value is Lang =>
  !!value && (SUPPORTED_LANGS as readonly string[]).includes(value);

const detectLang = (): Lang => {
  const stored = typeof window !== "undefined" ? window.localStorage.getItem("i18nextLng") : null;
  const browser = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "en";
  const candidate = (stored || browser || "en").toLowerCase();
  return candidate.startsWith("de") ? "de" : "en";
};

export const FeedbackByLang = () => {
  const { lang } = useParams<{ lang: string }>();
  return lang === "de" ? <FeedbackDe /> : <Feedback />;
};

export const EveningFeedbackByLang = () => {
  const { lang } = useParams<{ lang: string }>();
  return lang === "de" ? <MasterclassEveningFeedbackDe /> : <MasterclassEveningFeedback />;
};

const useLayoutEffectSafe = typeof window === "undefined" ? () => {} : useLayoutEffect;

export const LangLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const mounted = useRef(false);

  // First render (server render and hydration): set the language before children
  // render (resources are bundled, so this is synchronous) so server and client
  // text match the URL. Later switches happen in an effect to avoid updating
  // other components mid-render.
  if (!mounted.current && isLang(lang) && i18n.language !== lang && typeof i18n.changeLanguage === "function") void i18n.changeLanguage(lang);
  useLayoutEffectSafe(() => {
    mounted.current = true;
    if (isLang(lang) && i18n.language !== lang && typeof i18n.changeLanguage === "function") void i18n.changeLanguage(lang);
  }, [lang]);

  if (isLang(lang)) return <Outlet />;

  // Not a language prefix — treat as a normal path and redirect to detected lang.
  // Route-pattern placeholders like "/:lang/admin" (used by the preview page
  // picker) must have the placeholder segment replaced, not kept.
  const path = lang?.startsWith(":") ? location.pathname.replace(/^\/:[^/]+/, "") : location.pathname;
  return <Navigate to={`/${detectLang()}${path}${location.search}${location.hash}`} replace />;
};

export const RootRedirect = () => {
  const location = useLocation();
  const suffix = location.pathname === "/" ? "" : location.pathname;
  return <Navigate to={`/${detectLang()}${suffix}${location.search}${location.hash}`} replace />;
};
