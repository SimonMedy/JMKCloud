import * as React from "react";
import {
  Cloud,
  LayoutDashboard,
  FolderOpen,
  User,
  CreditCard,
  BookOpen,
  Settings,
  LogOut,
  MoreHorizontal,
  Cloud as CloudIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Tableau de bord", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Mes fichiers", icon: FolderOpen, url: "/files" },
  { title: "Mon compte", icon: User, url: "/account" },
  { title: "Achat de stockage", icon: CreditCard, url: "/storage" },
  { title: "Documentation", icon: BookOpen, url: "/docs" },
  { title: "Paramètres", icon: Settings, url: "/settings" },
];

export function SidebarLayout() {
  const [activeItem, setActiveItem] = React.useState(navItems[0]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="w-full justify-start gap-2 px-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <Cloud className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">JMK Cloud</span>
                  <span className="truncate text-xs">Stockage sécurisé</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    onClick={() => setActiveItem(item)}
                    className={
                      activeItem === item ? "bg-orange-100 text-orange-700" : ""
                    }
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <item.icon className="mr-2 size-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <div className="mt-auto px-4 py-4 group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
            <SidebarMenu>
              <SidebarMenuButton
                asChild
                tooltip="Espace de stockage"
                onClick={() =>
                  setActiveItem({
                    title: "Espace de stockage",
                    icon: CloudIcon,
                    url: "/storage",
                  })
                }
                className={
                  activeItem.title === "Espace de stockage"
                    ? "bg-orange-100 text-orange-700"
                    : ""
                }
              >
                <Button variant="ghost" className="w-full justify-start mb-2">
                  <CloudIcon className="mr-2 size-4" />
                  <span>Espace de stockage</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenu>
            <div className="space-y-4">
              <div className="">
                <Progress value={16.67} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  2,5 Go utilisés sur 20 Go
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full text-primary"
                size="lg"
              >
                Acheter du stockage
              </Button>
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="w-full justify-start gap-2 px-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs">john@example.com</span>
                    </div>
                    <MoreHorizontal className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  align="end"
                  side="right"
                  sideOffset={8}
                >
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}
