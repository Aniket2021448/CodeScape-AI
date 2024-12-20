'use client'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import {cn} from "@/lib/utils"
import { Button } from "@/components/ui/button";
import Image from "next/image";

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard

    },
    {
        title: 'Q&A',
        url: '/qa',
        icon: Bot

    },
    {
        title: 'Meetings',
        url: '/meetings',
        icon: Presentation
    },
    {
        title: 'Billing',
        url: '/billing',
        icon: CreditCard
    }
]

const projects = [
    {
        title: 'Project 1'
    },
    {
        title: 'Project 2'
    },
    {
        title: 'Project 3'
    }
]


export function AppSideBar(){
    const pathname = usePathname()
    const { open } = useSidebar()
    return (
        <Sidebar collapsible = "icon" variant = "floating">
            <SidebarHeader>
                {open && <div className="flex items-center gap-1">
                    <Image src='/codescape-logo-2.png' alt={"codescape-logo"} width={200} height={40}/>
                </div>}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>

                    <SidebarMenu>
                        {items.map(item => {
                            return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                <Link
                                    href={item.url}
                                    className={cn(
                                    { '!bg-primary !text-white': pathname === item.url },
                                    'list-none')}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>



                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        Projects
                    </SidebarGroupLabel>
                    <SidebarContent>
                        <SidebarMenu>
                            {projects.map(project =>{
                                return (
                                    <SidebarMenuItem key={project.title}>
                                        <SidebarMenuButton asChild>
                                            <div>
                                                <div className={cn('rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-priamry', 
                                                {
                                                    'bg-primary text-white': false
                                                    // 'bg-primary text-white': project.title === selectedProject?.title
                                                    // Toggle the icon color when managing the actual projects fetched from the database,
                                                }
                                                )}>
                                                    {project.title.charAt(0)}
                                                    
                                                </div>
                                                <span>{project.title}</span>
                                                
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}

                            <div className="h-2"></div>
                            {open && <SidebarMenuItem>
                                <Link href={'\create'}>
                                    <Button size = 'sm' variant = {"outline"} className="w-fit">
                                        <Plus />
                                        Create Project
                                    </Button>
                                </Link>
                            </SidebarMenuItem>}
                        </SidebarMenu>
                    </SidebarContent>
                </SidebarGroup>


            </SidebarContent>
        </Sidebar>
    )
}