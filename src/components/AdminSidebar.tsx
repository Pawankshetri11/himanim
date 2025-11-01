import {
  Palette,
  User,
  Mail,
  Code,
  Briefcase,
  FolderKanban,
  FileText,
  Home,
  Layers,
  Tag,
  FolderOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Theme", value: "theme", icon: Palette },
  { title: "Hero & Nav", value: "hero", icon: Home },
  { title: "Profile", value: "profile", icon: User },
  { title: "Contact", value: "contact", icon: Mail },
  { title: "Skills", value: "skills", icon: Code },
  { title: "Tech Stack", value: "techstack", icon: Layers },
  { title: "Experience", value: "experience", icon: Briefcase },
  { title: "Projects", value: "projects", icon: FolderKanban },
  { title: "Project Categories", value: "project-categories", icon: FolderOpen },
  { title: "Resume", value: "resume", icon: FileText },
  { title: "About", value: "about", icon: User },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Admin Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.value)}
                    className={
                      activeTab === item.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/50"
                    }
                  >
                    <item.icon className={isCollapsed ? "" : "mr-2 h-4 w-4"} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
