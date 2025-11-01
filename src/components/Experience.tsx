import { Briefcase, Calendar, MapPin } from "lucide-react";
import { useExperiences } from "@/hooks/useExperiences";
import { format } from "date-fns";

const Experience = () => {
  const { experiences, isLoading } = useExperiences();

  if (isLoading) {
    return (
      <section id="experience" className="section-padding bg-gradient-to-b from-background to-surface/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="section-padding bg-gradient-to-b from-background to-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences?.map((exp) => (
            <div 
              key={exp.id}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                {exp.logo_url ? (
                  <img src={exp.logo_url} alt={exp.company} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{exp.position}</h3>
                  <p className="text-sm text-primary font-medium">{exp.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(exp.start_date), 'MMM yyyy')} - {exp.is_current ? 'Present' : format(new Date(exp.end_date!), 'MMM yyyy')}
                  </span>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>
              
              {exp.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {!experiences?.length && (
          <div className="text-center text-muted-foreground">
            <p>No experience added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
