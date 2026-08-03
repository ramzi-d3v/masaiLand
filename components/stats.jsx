"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { currency } from "@/lib/catalogue";
import { summariseEarnings } from "@/lib/earnings";
import { readOrders } from "@/lib/orders";
import { dashboardStats } from "@/lib/dashboardData";

/*
  The top row. The first three cards are worked out from the bookings actually
  taken through the checkout — earnings, how many, and what the average one is
  worth — each measured against the same window a week earlier. The fourth
  stays on the admin area's own analytics summary.

  A trend needs something to compare against. On a demo there usually is not
  one, so a card with no prior week says "first this week" rather than showing
  a made-up percentage.
*/

function Trend({ change, footnote }) {
	if (change.basis === "period") {
		return (
			<div className="flex items-center gap-1 text-xs">
				<Delta value={change.delta}>
					<DeltaIcon />
					<DeltaValue />
				</Delta>
				<span className="text-muted-foreground">{footnote}</span>
			</div>
		);
	}

	return (
		<p className="text-muted-foreground text-xs">
			{change.basis === "new" ? "First this week" : "Nothing booked yet"}
		</p>
	);
}

export function DashboardStats() {
	// Orders live in this browser, so they arrive after mount. Until then the
	// cards show a dash rather than a zero that would read as real.
	const [orders, setOrders] = useState(null);

	useEffect(() => {
		setOrders(readOrders());
	}, []);

	const summary = summariseEarnings(orders ?? []);
	const enquiries = dashboardStats.find((s) => s.label === "Enquiries received");
	const waiting = orders === null;

	const cards = [
		{
			label: "Earnings",
			value: waiting ? "—" : currency(summary.all.revenue),
			change: summary.revenue,
		},
		{
			label: "Bookings",
			value: waiting ? "—" : String(summary.all.count),
			change: summary.bookings,
		},
		{
			label: "Average booking",
			value: waiting ? "—" : currency(Math.round(summary.avg)),
			change: summary.average,
		},
	];

	return (
        <>
            {cards.map((s) => (
				<Card className={cn("shadow-none dark:ring-0")} key={s.label}>
					<CardHeader>
						<CardTitle className="font-normal text-muted-foreground text-xs">
							{s.label}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<p className="font-semibold text-2xl tabular-nums">{s.value}</p>
						<Trend change={s.change} footnote={`vs prior ${summary.days} days`} />
					</CardContent>
				</Card>
			))}

            {enquiries && (
				<Card className={cn("shadow-none dark:ring-0")}>
					<CardHeader>
						<CardTitle className="font-normal text-muted-foreground text-xs">
							{enquiries.label}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<p className="font-semibold text-2xl tabular-nums">{enquiries.value}</p>
						<div className="flex items-center gap-1 text-xs">
							<Delta value={enquiries.delta}>
								<DeltaIcon />
								<DeltaValue />
							</Delta>
							<span className="text-muted-foreground">{enquiries.footnote}</span>
						</div>
					</CardContent>
				</Card>
			)}
        </>
    );
}
