"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavGroup({
    label,
    items
}) {
	const pathname = usePathname();
	/* "/admin" must not light up while you are on "/admin/orders", so an exact
	   match, or a match on a path segment boundary. */
	const isCurrent = (path) =>
		!!path && (pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)));

	return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
				{items.map((item) => (
					<Collapsible
                        asChild
                        className="group/collapsible"
                        defaultOpen={
							!!isCurrent(item.path) ||
							item.subItems?.some((i) => !!isCurrent(i.path))
						}
                        key={item.title}>
						<SidebarMenuItem>
							{item.subItems?.length ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton isActive={isCurrent(item.path)}>
											{item.icon}
											<span>{item.title}</span>
											<ChevronRightIcon
                                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.subItems?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild isActive={isCurrent(subItem.path)}>
														<a href={subItem.path}>
															{subItem.icon}
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								<SidebarMenuButton asChild isActive={isCurrent(item.path)}>
									<a href={item.path}>
										{item.icon}
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
        </SidebarGroup>
    );
}
