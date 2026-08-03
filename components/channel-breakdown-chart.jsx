"use client";;
import { cn } from "@/lib/utils";
import { LabelList, Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { deviceShare } from "@/lib/dashboardData";

/* Device split from lib/adminContent.js, in place of the block's demo
   channel mix. */
const chartData = deviceShare;

const chartConfig = {
    share: {
		label: "Share",
	},

    mobile: {
		label: "Mobile",
		color: "var(--chart-2)",
	},

    desktop: {
		label: "Desktop",
		color: "var(--chart-4)",
	},

    tablet: {
		label: "Tablet",
		color: "var(--chart-5)",
	}
};

export function ChannelBreakdownChart({
    className,
    ...props
}) {
	return (
        <Card
            className={cn("flex flex-col shadow-none dark:ring-0", className)}
            {...props}>
            <CardHeader className="items-center space-y-1 pb-0 sm:items-start">
				<div
                    className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
					<CardTitle>Visits by device</CardTitle>
					<Delta value={2.4} variant="badge">
						<DeltaIcon variant="trend" />
						<DeltaValue suffix="pp" />
					</Delta>
				</div>
				<CardDescription>
					Share of visits by device, last 30 days
				</CardDescription>
			</CardHeader>
            <CardContent className="my-auto">
				<ChartContainer className="mx-auto aspect-square max-h-72 w-full" config={chartConfig}>
					<PieChart accessibilityLayer>
						<Pie
                            cornerRadius={8}
                            data={chartData}
                            dataKey="share"
                            innerRadius={36}
                            nameKey="device"
                            outerRadius="88%"
                            stroke="var(--card)"
                            strokeWidth={4}>
							<LabelList
                                className="fill-background font-medium"
                                dataKey="share"
                                fill="currentColor"
                                fontWeight={500}
                                formatter={(label) => {
									const n = Number(label);
									return Number.isFinite(n) ? `${n}%` : String(label ?? "");
								}}
                                position="inside"
                                stroke="none" />
						</Pie>
						<ChartLegend content={<ChartLegendContent nameKey="device" />} />
					</PieChart>
				</ChartContainer>
			</CardContent>
        </Card>
    );
}
