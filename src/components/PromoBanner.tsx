import { Gift } from "lucide-react";

const PromoBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] gradient-bg text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm">
        <Gift className="w-4 h-4 flex-shrink-0" />
        <p>
          Buy a ticket until <span className="font-semibold">March 20</span> and receive a{" "}
          <a href="https://www.vibecodefest.ch" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity">Free Vibe Code Fest Ticket</a>{" "}
          <span className="opacity-80">(CHF 75 Value)</span>
        </p>
      </div>
    </div>);

};

export default PromoBanner;