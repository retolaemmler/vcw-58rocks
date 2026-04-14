import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Confirmation from "./pages/Confirmation";
import Admin from "./pages/Admin";
import Survey from "./pages/Survey";
import IdeaGenerator from "./pages/IdeaGenerator";
import Edition1Participants from "./pages/Edition1Participants";
import Edition1Slides from "./pages/Edition1Slides";
import Edition2Slides from "./pages/Edition2Slides";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/prepsurvey" element={<Survey />} />
          <Route path="/ideas" element={<IdeaGenerator />} />
          <Route path="/edition1/participants" element={<Edition1Participants />} />
          <Route path="/edition1/slides" element={<Edition1Slides />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
