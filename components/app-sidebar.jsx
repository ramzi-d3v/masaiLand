import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { LatestChange } from "@/components/latest-change";
import { PlusIcon, SearchIcon } from "lucide-react";

export function AppSidebar() {
	return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="h-16 justify-center">
				{/* The property's real wordmark carries its own name, so no text
				    label rides alongside it — just the mark, sized to the icon
				    rail so it still reads when the sidebar collapses. */}
				<SidebarMenuButton asChild className="h-12">
					<a href="/admin">
						<Image
                            alt="Masailand Safari & Lodge"
                            className="h-10 w-auto shrink-0 object-contain group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                            height={189}
                            src="/brand/logo-masailand.png"
                            width={300} />
					</a>
				</SidebarMenuButton>
			</SidebarHeader>
            <SidebarContent>
				<SidebarGroup>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
                            asChild
                            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                            tooltip="New booking">
							<a href="/book">
								<PlusIcon />
								<span>New booking</span>
							</a>
						</SidebarMenuButton>
						<Button
                            aria-label="Search enquiries"
                            className="size-8 group-data-[collapsible=icon]:opacity-0"
                            size="icon"
                            variant="outline">
							<SearchIcon />
							<span className="sr-only">Search enquiries</span>
						</Button>
					</SidebarMenuItem>
				</SidebarGroup>
				{navGroups.map((group, index) => (
					<NavGroup key={`sidebar-group-${index}`} {...group} />
				))}
			</SidebarContent>
            <SidebarFooter>
				<LatestChange />
				<SidebarMenu className="mt-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
                                asChild
                                className="text-muted-foreground"
                                isActive={item.isActive}
                                size="sm">
								<a href={item.path}>
									{item.icon}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarFooter>
        </Sidebar>
    );
}
