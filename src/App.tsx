import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import Confirmation from "./pages/Confirmation";
import Admin from "./pages/Admin";
import Survey from "./pages/Survey";
import Feedback from "./pages/Feedback";
import IdeaGenerator from "./pages/IdeaGenerator";
import Edition1Participants from "./pages/Edition1Participants";
import UpdateDates from "./pages/UpdateDates";
import RaiffeisenSurvey from "./pages/RaiffeisenSurvey";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const SUPPORTED_LANGS = ["en", "de"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const LangLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang as Lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!lang || !SUPPORTED_LANGS.includes(lang as Lang)) {
    return <Navigate to="/en" replace />;
  }
  return <Outlet />;
};

const RootRedirect = () => {
  const location = useLocation();
  const stored =
    typeof window !== "undefined" ? window.localStorage.getItem("i18nextLng") : null;
  const browser =
    typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "en";
  const candidate = (stored || browser || "en").toLowerCase();
  const lang: Lang = candidate.startsWith("de") ? "de" : "en";
  const suffix = location.pathname === "/" ? "" : location.pathname;
  return <Navigate to={`/${lang}${suffix}${location.search}${location.hash}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/:lang" element={<LangLayout />}>
            <Route index element={<Index />} />
            <Route path="confirmation" element={<Confirmation />} />
            <Route path="admin" element={<Admin />} />
            <Route path="survey" element={<Survey />} />
            <Route path="prepsurvey" element={<Survey />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="postsurvey" element={<Feedback />} />
            <Route path="ideas" element={<IdeaGenerator />} />
            <Route path="edition1/participants" element={<Edition1Participants />} />
            <Route path="dates" element={<UpdateDates />} />
            <Route path="raiffeisen-prep" element={<RaiffeisenSurvey />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Redirect any non-prefixed path to the detected language */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
