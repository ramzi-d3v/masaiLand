"use client";;
import { cn } from "@/lib/utils";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { hourlyVisits, peakHour } from "@/lib/dashboardData";

/* Visits by hour of day, from lib/adminContent.js. Every third hour is
   plotted so the axis stays legible at this card's width. */
const chartRows = hourlyVisits
	.filter((_, i) => i % 3 === 0)
	.map((h) => ({ day: h.hour, minutes: h.views }));

const quietest = Math.min(...chartRows.map((r) => r.minutes));
const busiest = Math.max(...chartRows.map((r) => r.minutes));

/** How much busier the peak is than the quietest hour plotted. */
const replyImprovementPct = quietest > 0 ? ((busiest - quietest) / quietest) * 100 : 0;

const chartConfig = {
    minutes: {
		label: "Visits",
		color: "var(--chart-2)",
	}
};

export function FirstReplyTimeChart({
    className,
    ...props
}) {
	return (
        <Card
            className={cn("shadow-none md:col-span-2 dark:ring-0", className)}
            {...props}>
            <CardHeader className="space-y-1">
				<div className="flex flex-wrap items-center gap-2">
					<CardTitle>Visits by hour</CardTitle>
					<Delta value={replyImprovementPct} variant="badge">
						<DeltaIcon variant="trend" />
						<DeltaValue />
					</Delta>
				</div>
				<CardDescription>
					{`Visits per hour across the day. Busiest at ${peakHour.hour}.`}
				</CardDescription>
			</CardHeader>
            <CardContent>
				<ChartContainer className="aspect-video w-full" config={chartConfig}>
					<LineChart
                        accessibilityLayer
                        data={chartRows}
                        margin={{ top: 24, left: 20, right: 12, bottom: 8 }}>
						<CartesianGrid className="stroke-border" vertical={false} />
						<XAxis
                            axisLine={false}
                            dataKey="day"
                            interval={0}
                            tickFormatter={(value) => String(value).slice(0, 3)}
                            tickLine={false}
                            tickMargin={8} />
						<ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
						<Line
                            activeDot={{ r: 6 }}
                            dataKey="minutes"
                            dot={{ fill: "var(--color-minutes)" }}
                            stroke="var(--color-minutes)"
                            strokeWidth={2}
                            type="natural">
							<LabelList
                                className="fill-foreground"
                                dataKey="minutes"
                                fontSize={12}
                                formatter={(label) => {
									const n = Number(label);
									return Number.isFinite(n)
										? `${n.toFixed(1)}m`
										: String(label ?? "");
								}}
                                offset={12}
                                position="top" />
						</Line>
					</LineChart>
				</ChartContainer>
			</CardContent>
        </Card>
    );
}
