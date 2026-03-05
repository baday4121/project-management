import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/Components/ui/sidebar";
import { Link, router, usePage } from "@inertiajs/react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    prefetch?: boolean;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      prefetch?: boolean;
    }[];
  }[];
}) {
  const { state } = useSidebar();
  const { url: currentUrl } = usePage();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60 mb-2">
        Menu Navigasi
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Cek apakah item ini atau sub-itemnya sedang aktif
          const isParentActive = item.isActive || currentUrl.startsWith(item.url);
          
          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`transition-colors duration-200 hover:bg-primary/5 ${
                      isParentActive ? "text-primary font-semibold" : ""
                    }`}
                    onClick={() => {
                      if (state === "collapsed") {
                        router.visit(item.url, { preserveState: true });
                      }
                    }}
                  >
                    {item.icon && (
                      <item.icon className={`h-5 w-5 ${isParentActive ? "text-primary" : "text-muted-foreground"}`} />
                    )}
                    <span className="text-sm">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 h-4 w-4" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-in fade-in slide-in-from-top-1 duration-300">
                  <SidebarMenuSub className="border-l-2 border-primary/10 ml-4 pl-2">
                    {item.items.map((subItem) => {
                      const isSubActive = currentUrl === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link 
                              href={subItem.url} 
                              prefetch={subItem.prefetch}
                              className={`transition-all duration-200 ${
                                isSubActive 
                                  ? "text-primary font-medium translate-x-1" 
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                className={`transition-colors duration-200 hover:bg-primary/5 ${
                  isParentActive ? "bg-primary/5 text-primary font-semibold" : ""
                }`}
              >
                <Link href={item.url} prefetch={item.prefetch}>
                  {item.icon && (
                    <item.icon className={`h-5 w-5 ${isParentActive ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                  <span className="text-sm">{item.title}</span>
                  {isParentActive && (
                    <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}