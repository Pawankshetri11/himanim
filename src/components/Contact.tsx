import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage for admin panel
    const submissions = JSON.parse(localStorage.getItem("contact_submissions") || "[]");
    submissions.push({
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });
    localStorage.setItem("contact_submissions", JSON.stringify(submissions));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you soon!",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding bg-surface/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="glow-text text-primary">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-glow mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
            Let's connect! Whether it's about a project, opportunity, or just to say hi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold mb-6">Let's talk about everything!</h3>
              <p className="text-foreground/70 leading-relaxed mb-8">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
                Feel free to reach out through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
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
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border border-primary/20 glow-hover group"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                    </a>

                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border border-primary/20 glow-hover group"
                    >
                      <div className="p-3 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                        <Linkedin className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">Connect with me</p>
                      </div>
                    </a>

                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border border-primary/20 glow-hover group"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Github className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">GitHub</p>
                        <p className="text-sm text-muted-foreground">Check out my code</p>
                      </div>
                    </a>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="bg-card p-8 rounded-xl border border-primary/20 glow-hover space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-surface border-border focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-surface border-border focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project or just say hi..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-surface border-border focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                size="lg"
              >
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
