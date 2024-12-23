"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BotIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  PlusIcon,
  PresentationIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProjectAvatar } from "./project-avatar";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";

const items = [
  {
    title: "仪表盘",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "AI 对话",
    url: "/qa",
    icon: BotIcon,
  },
  {
    title: "会议列表",
    url: "/meetings",
    icon: PresentationIcon,
  },
  {
    title: "充值套餐",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();

  const { projects, projectId, setProjectId } = useProject();

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-none">
      <SidebarHeader className="h-[61px]"></SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>应用程序</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="px-2" key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn("text-neutral-800 transition", {
                      "bg-[#ebebeb] text-neutral-800 hover:bg-[#ebebeb]":
                        pathname === item.url,
                    })}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>你的项目</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => (
                <SidebarMenuItem className="pl-1" key={project.name}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "cursor-pointer text-neutral-800 transition",
                      {
                        "bg-[#ebebeb] text-neutral-800 hover:bg-[#ebebeb]":
                          project.id === projectId,
                      },
                    )}
                  >
                    <div
                      onClick={() => {
                        setProjectId(project.id);
                      }}
                    >
                      <ProjectAvatar
                        className=""
                        isActive={project.id === projectId}
                        name={project.name}
                      />
                      <span>{project.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {open && (
                <SidebarMenuItem>
                  <Link href="/create">
                    <Button size="sm" variant="outline" className="mt-2 w-fit">
                      <PlusIcon />
                      创建项目
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
