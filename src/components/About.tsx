import { GraduationCap, Briefcase, Target } from "lucide-react";
import { useAbout } from "@/hooks/useAbout";

const About = () => {
  const { about } = useAbout();

  // Default content if no data in database
  const defaultContent = {
    intro: "I'm a passionate data professional on a mission to bridge the gap between data and decision-making. As a BCA graduate with specialization in Data Science, I bring a strong foundation in analytics, programming, and data visualization.",
    current: "Currently working as an IT Executive at Franciscan Solutions Pvt. Ltd., I've gained hands-on experience in managing technical operations and supporting digital transformation initiatives. My journey has equipped me with a unique blend of technical expertise and practical problem-solving skills.",
    goals: "I'm actively preparing for a career as a Data Analyst, where I can leverage my analytical mindset, technical skills, and passion for data-driven insights to help organizations make informed decisions."
  };

  const sections = [
    {
      icon: GraduationCap,
      iconColor: "primary",
      title: "Education",
      description: "Bachelor of Computer Applications (BCA)\nSpecialization: Data Science\nStrong foundation in programming, databases, and analytics"
    },
    {
      icon: Briefcase,
      iconColor: "secondary",
      title: "Current Role",
      description: "IT Executive\nFranciscan Solutions Pvt. Ltd. (2024 - Present)\nManaging IT operations and technical support"
    },
    {
      icon: Target,
      iconColor: "primary",
      title: "Career Goals",
      description: "Pursuing excellence in Data Analysis and Business Intelligence\nCommitted to continuous learning and professional growth\nPassionate about leveraging data to drive strategic decisions"
    }
  ];

  // Use database content if available, otherwise use defaults
  const aboutSections = about && about.length > 0 ? about : sections.map((s, i) => ({
    id: `default-${i}`,
    title: s.title,
    description: s.description,
    order_index: i
  }));

  return (
    <section id="about" className="section-padding bg-surface/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="glow-text text-primary">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-glow mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <p className="text-lg text-foreground/80 leading-relaxed">{defaultContent.intro}</p>
            <p className="text-lg text-foreground/80 leading-relaxed">{defaultContent.current}</p>
            <p className="text-lg text-foreground/80 leading-relaxed">{defaultContent.goals}</p>
          </div>

          <div className="space-y-6">
            {aboutSections.slice(0, 3).map((section, idx) => {
              const defaultSection = sections[idx];
              const IconComponent = defaultSection?.icon || GraduationCap;
              const iconColor = defaultSection?.iconColor || "primary";
              
              return (
                <div 
                  key={section.id || idx}
                  className="bg-card p-6 rounded-xl border border-primary/20 glow-hover animate-slide-up" 
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-${iconColor}/10 rounded-lg`}>
                      <IconComponent className={`h-6 w-6 text-${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                      <p className="text-foreground/70 whitespace-pre-line">{section.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
