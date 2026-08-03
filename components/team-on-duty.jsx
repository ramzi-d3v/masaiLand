"use client";;
import { cn } from "@/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "@/components/indicator";
import { EllipsisIcon, SendIcon, ListChecksIcon } from "lucide-react";
import { bookableSpaces } from "@/lib/dashboardData";

/* The block used this slot for teammates on shift. The lodge has no staff
   roster in the data, but it does have the thing an owner actually wants at a
   glance: every bookable space, its rate and what it takes. The room
   photograph stands in for the avatar. */
const INITIAL_TEAMMATES = bookableSpaces.map((space) => ({
	id: space.id,
	name: space.name,
	status: space.status,
	open: space.detail,
	capacity: space.capacity,
	image: space.image,
	href: space.href,
}));

function getInitials(name) {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("");
}

export function TeamOnDuty({
    className,
    ...props
}) {
	const teammates = INITIAL_TEAMMATES;

	return (
        <Card className={cn("shadow-none dark:ring-0", className)} {...props}>
            <CardHeader className="border-b">
				<CardTitle>Rooms &amp; halls</CardTitle>
				<CardDescription>Everything bookable, and what it goes for</CardDescription>
			</CardHeader>
            <CardContent className="p-0">
				<ul className="flex flex-col divide-y divide-border">
					{teammates.map((t) => (
						<li
                            className="flex items-center gap-2 p-3 first:pt-0 last:pb-0 sm:gap-3"
                            key={t.id}>
							<Avatar className="size-8">
								<AvatarImage alt={t.name} src={t.image} />
								<AvatarFallback>{getInitials(t.name)}</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1 pr-1">
								<p className="truncate font-medium text-foreground text-sm leading-snug">
									{t.name}
								</p>
								<p className="flex items-center gap-2 text-[10px] leading-snug">
									<span className="flex min-w-0 items-center gap-1 truncate">
										<StatusIndicator
                                            color={t.status === "Rooms & Suites" ? "emerald" : "amber"}
                                            pulse={false} />
										{t.capacity}
									</span>
									<span className="inline-flex size-1 rounded-full bg-foreground/80" />
									<span className="shrink-0 whitespace-nowrap tabular-nums">{t.open}</span>
								</p>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button aria-label={`Actions for ${t.name}`} size="icon-xs" variant="ghost">
										<EllipsisIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="min-w-52">
									<DropdownMenuLabel className="font-normal text-muted-foreground text-xs">
										{t.name}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild className="gap-2">
										<a href={t.href}>
											<SendIcon className="size-4 opacity-70" />
											Open booking page
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem asChild className="gap-2">
										<a href="/admin/enquiries">
											<ListChecksIcon className="size-4 opacity-70" />
											Enquiries about it
										</a>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					))}
				</ul>
			</CardContent>
        </Card>
    );
}
