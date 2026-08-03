import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MailIcon, MessageCircleIcon, ArrowRightIcon } from "lucide-react";
import { recentEnquiries } from "@/lib/dashboardData";

/* The admin area's own enquiries, newest first. Everything arrives by the
   contact form, so the channel column is "email" throughout — kept because the
   moment a second route in exists (phone, WhatsApp) it has a home. */
const rows = recentEnquiries.slice(0, 4).map((e) => ({
	customer: e.customer,
	subject: e.subject,
	channel: "email",
	receivedAt: e.receivedAt,
	state: e.state,
}));

function formatWaitTime(minutes) {
	if (minutes <= 0) {
		return "Just now";
	}
	if (minutes === 1) {
		return "1 minute";
	}
	if (minutes < 55) {
		return `${minutes} minutes`;
	}
	if (minutes < 60) {
		return "Almost an hour";
	}
	if (minutes < 75) {
		return "About an hour";
	}
	if (minutes < 120) {
		return "Over an hour";
	}
	const hours = Math.round(minutes / 60);
	if (hours < 24) {
		return hours === 1 ? "About an hour" : `About ${hours} hours`;
	}
	const days = Math.round(hours / 24);
	return days === 1 ? "Yesterday" : `${days} days`;
}

function statusVariant(state) {
	return state === "unread" ? "destructive" : "secondary";
}

function statusLabel(state) {
	return state === "unread" ? "Unread" : "Read";
}

function channelIcon(channel) {
	if (channel === "email") {
		return (<MailIcon className="size-3.5 shrink-0" />);
	}
	return (<MessageCircleIcon className="size-3.5 shrink-0" />);
}

export function RecentConversations({
    className,
    ...props
}) {
	return (
        <Card
            className={cn("gap-0 shadow-none md:col-span-2 dark:ring-0", className)}
            {...props}>
            <CardHeader className="border-b">
				<CardTitle>Recent enquiries</CardTitle>
				<CardDescription>Latest 4 from the contact form</CardDescription>
			</CardHeader>
            <CardContent className="p-0">
				<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="pl-6">Customer</TableHead>
							<TableHead className="hidden sm:table-cell">Topic</TableHead>
							<TableHead>Channel</TableHead>
							<TableHead className="text-right">Age</TableHead>
							<TableHead className="pr-6 text-right">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((r) => {
							return (
                                <TableRow className="h-14 hover:bg-transparent" key={`${r.customer}-${r.subject}`}>
                                    <TableCell className="max-w-36 truncate pl-6 font-medium">
										{r.customer}
									</TableCell>
                                    <TableCell className="hidden max-w-32 sm:table-cell">
										<span className="line-clamp-1 text-muted-foreground text-sm">
											{r.subject}
										</span>
									</TableCell>
                                    <TableCell>
										<span className="inline-flex items-center gap-2 font-medium text-sm capitalize">
											{channelIcon(r.channel)}
											{r.channel}
										</span>
									</TableCell>
                                    <TableCell className="text-right text-muted-foreground text-sm">
										{formatWaitTime(Math.round((Date.now() - new Date(r.receivedAt)) / 60000))}
									</TableCell>
                                    <TableCell className="pr-6 text-right">
										<Badge variant={statusVariant(r.state)}>
											{statusLabel(r.state)}
										</Badge>
									</TableCell>
                                </TableRow>
                            );
						})}
					</TableBody>
				</Table>
				</div>
				<div className="flex justify-center border-t py-3">
					<Button asChild size="sm" variant="ghost">
						<a href="/admin/enquiries">
							View all enquiries
							<ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
						</a>
					</Button>
				</div>
			</CardContent>
        </Card>
    );
}
