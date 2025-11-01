import { Heart, Mail, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-primary/20 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center">
          <p className="text-foreground/70 flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" /> by Himani Singwal © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
