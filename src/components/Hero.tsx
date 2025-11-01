import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Mail, Linkedin, Github } from "lucide-react";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Load customizable content from admin
  const getHeroData = () => {
    const saved = localStorage.getItem("admin_hero_nav");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error parsing hero/nav data:", error);
      }
    }
    return {
      welcomeText: "Welcome to my portfolio",
      greeting: "Hi, I'm",
      name: "Himani Singwal",
      title1: "Data Analyst",
      title2: "IT Professional",
      description: "BCA Graduate specializing in Data Science, currently working as an IT Executive. Passionate about transforming data into actionable insights through analytics and visualization.",
    };
  };

  const heroData = getHeroData();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium tracking-wider uppercase">{heroData.welcomeText}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {heroData.greeting} <span className="glow-text text-primary">{heroData.name}</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-muted-foreground font-light">
            <span className="text-primary font-medium">{heroData.title1}</span> | 
            <span className="text-secondary font-medium"> {heroData.title2}</span>
          </h2>
          
          <p className="text-lg text-foreground/70 leading-relaxed max-w-xl">
            {heroData.description}
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-4 pt-4">
            {(() => {
              const contactInfo = localStorage.getItem('admin_contact_info');
              const contact = contactInfo ? JSON.parse(contactInfo) : {
                email: 'himani.singwal@example.com',
                linkedin: 'https://linkedin.com/in/himani-singwal',
                github: 'https://github.com/himanisingwal'
              };
              return (
                <>
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-3 bg-surface rounded-lg hover:bg-primary/10 transition-colors group border border-primary/20"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors" />
                  </a>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-surface rounded-lg hover:bg-secondary/10 transition-colors group border border-secondary/20"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-foreground/70 group-hover:text-secondary transition-colors" />
                  </a>
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-surface rounded-lg hover:bg-primary/10 transition-colors group border border-primary/20"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors" />
                  </a>
                </>
              );
            })()}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              onClick={() => scrollToSection("#projects")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow group"
              size="lg"
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollToSection("#contact")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground glow-hover"
              size="lg"
            >
              Get in Touch
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center animate-fade-in">
          {localStorage.getItem("admin_hero_image") ? (
            <img 
              src={localStorage.getItem("admin_hero_image") || ""} 
              alt="Himani Singwal" 
              className="w-full max-w-md h-64 md:h-80 rounded-2xl object-cover border-4 border-primary shadow-glow-lg"
            />
          ) : (
            <div className="w-full max-w-md h-64 md:h-80 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-6xl font-bold shadow-glow-lg border-4 border-primary">
              HS
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
