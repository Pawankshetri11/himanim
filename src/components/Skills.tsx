import { Code2, Database, BarChart3, Cloud, Github } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import excelLogo from "@/assets/excel-logo.svg";
import { useSkills } from "@/hooks/useSkills";

const Skills = () => {
  const { skills: dbSkills, categories: dbCategories } = useSkills();

  const defaultCategories = [
    {
      id: "1",
      title: "Python & Libraries",
      icon: "Code2",
      color: "text-primary",
      order_index: 0,
    },
    {
      id: "2",
      title: "SQL & Databases",
      icon: "Database",
      color: "text-secondary",
      order_index: 1,
    },
    {
      id: "3",
      title: "Cloud & BI Tools",
      icon: "Cloud",
      color: "text-primary",
      order_index: 2,
    },
  ];

  const defaultSkills = [
    { id: "1", name: "Python", level: "Expert", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", category_id: "1" },
    { id: "2", name: "NumPy", level: "Expert", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg", category_id: "1" },
    { id: "3", name: "Pandas", level: "Expert", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg", category_id: "1" },
    { id: "4", name: "Matplotlib", level: "Intermediate", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg", category_id: "1" },
    { id: "5", name: "MySQL", level: "Expert", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", category_id: "2" },
    { id: "6", name: "PostgreSQL", level: "Expert", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", category_id: "2" },
    { id: "7", name: "Google Cloud", level: "Intermediate", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", category_id: "3" },
    { id: "8", name: "Power BI", level: "Expert", logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg", category_id: "3" },
    { id: "9", name: "Excel", level: "Expert", logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg", category_id: "3" },
  ];

  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : defaultCategories;
  const skills = dbSkills && dbSkills.length > 0 ? dbSkills : defaultSkills;

  const getIconComponent = (iconName: string) => {
    const icons: any = { Code2, Database, Cloud };
    return icons[iconName] || Code2;
  };

  const skillCategories = categories.map(cat => ({
    ...cat,
    icon: getIconComponent(cat.icon || "Code2"),
    skills: skills.filter(s => s.category_id === cat.id)
  }));

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="glow-text text-primary">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-glow mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit for data analysis, visualization, and deriving actionable business insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {skillCategories.map((category, idx) => (
            <div
              key={category.title}
              className="bg-card p-8 rounded-xl border border-primary/20 glow-hover animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <TooltipProvider key={skill.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            {skill.name === "Excel" ? (
                              <img src={excelLogo} alt={skill.name} className="w-8 h-8" />
                            ) : skill.name === "GitHub" ? (
                              <Github className="w-8 h-8 text-foreground" />
                            ) : (
                              <img src={skill.logo_url} alt={skill.name} className="w-8 h-8" />
                            )}
                            <span className="font-medium">{skill.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{skill.level}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Proficiency: {skill.level}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Icons */}
        <div className="bg-card/50 p-8 rounded-xl border border-primary/20 animate-fade-in">
          <h3 className="text-2xl font-semibold text-center mb-8">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {skills.map((tech) => (
              <TooltipProvider key={tech.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2 p-4 bg-surface/50 rounded-lg hover:scale-110 transition-transform cursor-pointer">
                      {tech.name === "Excel" ? (
                        <img src={excelLogo} alt={tech.name} className="w-12 h-12" />
                      ) : tech.name === "GitHub" ? (
                        <Github className="w-12 h-12 text-foreground" />
                      ) : (
                        <img src={tech.logo_url} alt={tech.name} className="w-12 h-12" />
                      )}
                      <span className="text-sm font-medium">{tech.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tech.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
