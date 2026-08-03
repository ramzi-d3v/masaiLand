"use client";;
import { cn } from "@/lib/utils";
import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	formatChartAxisTick,
	formatChartTooltipDate,
	parseIsoCalendarDate,
} from "@/components/formater";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { visitsTimeline } from "@/lib/dashboardData";

/* Site visits per day for the last 30 days, from the admin area's own
   analytics timeline rather than the block's demo series. */
const chartData = visitsTimeline.map((row) => ({ date: row.date, conversations: row.visits }));

const lastChartRow = chartData.at(-1);
if (lastChartRow === undefined) {
	throw new Error("ConversationVolumeChart: chartData must include at least one row");
}
const volumeChartReferenceDate = parseIsoCalendarDate(lastChartRow.date);

const chartConfig = {
    conversations: {
		label: "Visits",
		color: "var(--chart-2)",
	}
};

export function ConversationVolumeChart({
    className,
    ...props
}) {
	const chartUid = useId().replace(/:/g, "");
	const idAreaGradient = `conversation-volume-area-grad-${chartUid}`;

	const [periodDays, setPeriodDays] = useState(30);

	const chartRows = useMemo(() => {
		const startDate = new Date(volumeChartReferenceDate);
		startDate.setDate(startDate.getDate() - periodDays);
		return chartData.filter((item) => parseIsoCalendarDate(item.date) >= startDate);
	}, [periodDays]);

	const growthPctNum = useMemo(() => {
		const first = chartRows[0];
		if (!first) {
			return 0;
		}
		const last = chartRows.at(-1);
		if (!last) {
			return 0;
		}
		const a = first.conversations;
		const b = last.conversations;
		if (!a) {
			return 0;
		}
		return ((b - a) / a) * 100;
	}, [chartRows]);

	let xAxisMinTickGap;
	if (periodDays <= 7) {
		xAxisMinTickGap = undefined;
	} else if (periodDays >= 60) {
		xAxisMinTickGap = 20;
	} else {
		xAxisMinTickGap = 28;
	}

	return (
        <Card
            className={cn("shadow-none md:col-span-2 lg:col-span-3 dark:ring-0", className)}
            {...props}>
            <CardHeader
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<CardTitle>Site visits</CardTitle>
						<Delta value={growthPctNum} variant="badge">
							<DeltaIcon variant="trend" />
							<DeltaValue />
						</Delta>
					</div>
					<CardDescription>
						Visits per day for the selected window.
					</CardDescription>
				</div>
				<Select
                    onValueChange={(v) => {
						const n = Number(v);
						setPeriodDays(n);
					}}
                    value={String(periodDays)}>
					<SelectTrigger
                        aria-label="Site visits time range"
                        className="w-full min-w-36 sm:w-fit"
                        size="sm">
						<SelectValue placeholder="Range" />
					</SelectTrigger>
					<SelectContent align="end">
						<SelectItem value="7">Last 7 days</SelectItem>
						<SelectItem value="30">Last 30 days</SelectItem>
						<SelectItem value="60">Last 60 days</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
            <CardContent>
				<ChartContainer className="aspect-22/8 w-full" config={chartConfig}>
					<AreaChart
                        accessibilityLayer
                        data={chartRows}
                        margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
						<defs>
							<linearGradient id={idAreaGradient} x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="var(--color-conversations)" stopOpacity={0.45} />
								<stop offset="55%" stopColor="var(--color-conversations)" stopOpacity={0.12} />
								<stop offset="100%" stopColor="var(--color-conversations)" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid className="stroke-border" vertical={false} />
						<XAxis
                            axisLine={false}
                            dataKey="date"
                            interval={periodDays <= 7 ? 0 : "preserveStartEnd"}
                            minTickGap={xAxisMinTickGap}
                            tickFormatter={(value) =>
								formatChartAxisTick(String(value), periodDays)
							}
                            tickLine={false}
                            tickMargin={8} />
						<YAxis
                            axisLine={false}
                            tick={{ className: "tabular-nums" }}
                            tickLine={false}
                            tickMargin={8}
                            width={36} />
						<ChartTooltip
                            content={
								<ChartTooltipContent
                                    className="min-w-34"
                                    indicator="line"
                                    labelFormatter={(_, payload) => {
										const row = payload?.[0]?.payload;
										if (!row?.date) {
											return "";
										}
										return formatChartTooltipDate(row.date, "long");
									}} />
							}
                            cursor={false} />
						<Area
                            dataKey="conversations"
                            dot={false}
                            fill={`url(#${idAreaGradient})`}
                            stroke="var(--color-conversations)"
                            strokeWidth={2}
                            type="natural" />
					</AreaChart>
				</ChartContainer>
			</CardContent>
        </Card>
    );
}
