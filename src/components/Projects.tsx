import { useState } from "react";
import { ExternalLink, Github, Brain, School, ShoppingCart, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useProjects } from "@/hooks/useProjects";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { projects: dbProjects, categories: dbCategories } = useProjects();

  const defaultProjects = [
    {
      id: "1",
      title: "Smart Mood Enhancer",
      description: "An AI-based system that analyzes user emotions and recommends personalized content to improve mental well-being. Uses machine learning algorithms for sentiment analysis and mood prediction.",
      technologies: ["Python", "Machine Learning", "AI", "Data Analysis"],
      category: { name: "AI/ML" },
    },
    {
      id: "2",
      title: "School ERP System",
      description: "A comprehensive Enterprise Resource Planning system for educational institutions, managing student records, attendance, grades, and administrative tasks efficiently.",
      technologies: ["Python", "Database", "SQL", "Web Development"],
      category: { name: "Web Development" },
    },
    {
      id: "3",
      title: "Sales & Inventory Management",
      description: "A complete inventory and sales tracking system with real-time analytics, stock management, and automated reporting features for retail businesses.",
      technologies: ["Python", "SQL", "Power BI", "Excel"],
      category: { name: "Data Analysis" },
    },
    {
      id: "4",
      title: "Classic Snake Game",
      description: "A modern implementation of the classic Snake game with smooth controls, scoring system, and progressive difficulty levels built using Python.",
      technologies: ["Python", "Game Development", "Logic Design"],
      category: { name: "Game Development" },
    },
  ];

  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : defaultProjects;

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(projects.map((p: any) => p.category?.name || "Uncategorized")))];

  // Filter projects by category
  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter((p: any) => (p.category?.name || "Uncategorized") === selectedCategory);

  const useCarousel = filteredProjects.length > 3;

  return (
    <section id="projects" className="section-padding bg-surface/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="glow-text text-primary">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-glow mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
            A showcase of my technical capabilities and problem-solving approach
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category: string) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category as string)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : "border-primary/30 hover:border-primary"}
            >
              {category as string}
            </Button>
          ))}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: any, idx: number) => (
            <ProjectCard key={idx} project={project} idx={idx} />
          ))}
        </div>

        {/* Mobile Carousel View with Dots */}
        <div className="md:hidden px-4">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredProjects.map((project: any, idx: number) => (
                <CarouselItem key={idx} className="pl-4">
                  <ProjectCard project={project} idx={idx} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center gap-2 mt-6">
            {filteredProjects.map((_, idx: number) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full bg-primary/30 transition-colors"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, idx }: { project: any; idx: number }) => {
  const icons = [Brain, School, ShoppingCart, Gamepad2];
  const IconComponent = icons[idx % icons.length];
  const colors = ["primary", "secondary"];
  const color = colors[idx % colors.length];
  
  return (
    <div className="bg-card rounded-xl border border-primary/20 overflow-hidden glow-hover group animate-slide-up h-full">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-${color}/10 rounded-lg`}>
            <IconComponent className={`h-6 w-6 text-${color}`} />
          </div>
          {project.category?.name && (
            <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full font-medium">
              {project.category.name}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-foreground/70 leading-relaxed mb-4 text-sm line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.map((tech: string) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 bg-surface rounded-full text-foreground/80 border border-border"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {project.github_url && (
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground glow-hover group/btn flex-1"
              onClick={() => window.open(project.github_url, '_blank')}
            >
              <Github className="mr-2 h-4 w-4" />
              Code
              <ExternalLink className="ml-2 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </Button>
          )}
          {project.live_url && (
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground glow-hover group/btn flex-1"
              onClick={() => window.open(project.live_url, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Live
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
