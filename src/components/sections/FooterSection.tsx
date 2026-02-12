import { Mail, Phone, Linkedin, Globe } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-16 px-4 bg-foreground text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Vibe Coding Workshop</h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Organized by 58rocks GmbH<br />
              Rotachstrasse 30<br />
              8003 Zürich
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p>Valentin Binnendijk</p>
              <a href="mailto:valentin.binnendijk@pedalix.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" /> valentin.binnendijk@pedalix.com
              </a>
              <a href="tel:+41786878157" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" /> +41 78 687 81 57
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Links</h3>
            <div className="space-y-2 text-sm">
              <a href="https://vibecodefest.ch" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Globe className="w-4 h-4" /> vibecodefest.ch
              </a>
              <a href="https://vibehunt.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Globe className="w-4 h-4" /> vibehunt.me
              </a>
              <a href="#" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
          © 2026 Pedalix GmbH. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
