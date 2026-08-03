import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BedIcon, MessageCircleIcon, UsersRoundIcon, UtensilsIcon, ArrowRightIcon } from "lucide-react";
import { activityFeed } from "@/lib/dashboardData";

/* The block's demo feed was invented operational signals. This is the real
   enquiry list read as a timeline, with the icon picked from what the visitor
   was asking about. */
const ICONS = {
	"Rooms & Suites": <BedIcon />,
	"A conference or event": <UsersRoundIcon />,
	"The restaurant": <UtensilsIcon />,
	"Something else": <MessageCircleIcon />,
};

function since(iso) {
	const mins = Math.round((Date.now() - new Date(iso)) / 60000);
	if (mins < 60) return `${Math.max(1, mins)} min ago`;
	const hrs = Math.round(mins / 60);
	if (hrs < 24) return `${hrs} hr ago`;
	const days = Math.round(hrs / 24);
	return days === 1 ? "Yesterday" : `${days} days ago`;
}

const items = activityFeed.map((a) => ({
	title: a.title,
	time: since(a.at),
	icon: ICONS[a.kind] ?? <MessageCircleIcon />,
}));

export function SupportActivity({
    className,
    ...props
}) {
	return (
        <Card className={cn("gap-0 shadow-none dark:ring-0", className)} {...props}>
            <CardHeader className="border-b">
				<CardTitle>Recent activity</CardTitle>
				<CardDescription>What guests have been asking about.</CardDescription>
			</CardHeader>
            <CardContent className="px-0">
				<ul className="flex flex-col divide-y divide-border">
					{items.map((item) => (
						<li className="flex h-18 items-center gap-3 px-3" key={item.title}>
							<span
                                aria-hidden="true"
                                className="flex size-10 shrink-0 items-center justify-center [&_svg]:size-4">
								{item.icon}
							</span>
							<div className="min-w-0 flex-1 space-y-1">
								<p className="line-clamp-2 text-pretty text-foreground text-xs leading-snug">
									{item.title}
								</p>
								<p className="text-muted-foreground text-xs tabular-nums">
									{item.time}
								</p>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
            <div className="flex items-center justify-center">
				<Button asChild size="sm" variant="ghost">
					<a href="/#">
						View All
						<ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
					</a>
				</Button>
			</div>
        </Card>
    );
}
