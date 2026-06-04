"use client";

import * as React from "react";
import { useUser } from "@/features/auth/hooks/useUser";
import { useProjects } from "@/features/projects/hooks/useProjects";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  LayoutDashboard,
  Folder,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const { projects } = useProjects();

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <Folder className="size-4" />,
    },
  ];

  const sidebarProjects = projects.map((project) => ({
    name: project.name,
    url: `/projects/${project.id}`,
    icon: <Folder className="size-4" />,
  }));

  const navUserData = user
    ? {
        name: user.name || user.username || "User",
        email: user.email || "",
        avatar: "",
      }
    : {
        name: "Loading...",
        email: "",
        avatar: "",
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-16 items-center justify-center border-b px-4">
        <div className="flex w-full items-center gap-2 font-semibold text-sidebar-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            RBAC Manager
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {sidebarProjects.length > 0 && (
          <NavProjects projects={sidebarProjects} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUserData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
