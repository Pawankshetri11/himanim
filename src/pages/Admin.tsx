import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AboutManagement from "./admin/AboutManagement";
import ExperienceManagement from "./admin/ExperienceManagement";
import ProjectsManagement from "./admin/ProjectsManagement";
import SkillsManagement from "./admin/SkillsManagement";
import HeroNavManagement from "./admin/HeroNavManagement";
import ContactManagement from "./admin/ContactManagement";
import ProfileManagement from "./admin/ProfileManagement";
import ThemeManagement from "./admin/ThemeManagement";
import ProjectCategoriesManagement from "./admin/ProjectCategoriesManagement";
import ResumeManagement from "./admin/ResumeManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("theme");
  const { signOut, user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {activeTab === "theme" && <ThemeManagement />}
            {activeTab === "hero" && <HeroNavManagement />}
            {activeTab === "profile" && <ProfileManagement />}
            {activeTab === "contact" && <ContactManagement />}
            {activeTab === "skills" && <SkillsManagement />}
            {activeTab === "skill-categories" && <SkillsManagement />}
            {activeTab === "techstack" && <SkillsManagement />}
            {activeTab === "experience" && <ExperienceManagement />}
            {activeTab === "projects" && <ProjectsManagement />}
            {activeTab === "project-categories" && <ProjectCategoriesManagement />}
            {activeTab === "resume" && <ResumeManagement />}
            {activeTab === "about" && <AboutManagement />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
