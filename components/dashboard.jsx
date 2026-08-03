import { ChannelBreakdownChart } from "@/components/channel-breakdown-chart";
import { ConversationVolumeChart } from "@/components/conversation-volume-chart";
import { FirstReplyTimeChart } from "@/components/first-reply-time-chart";
import { RecentConversations } from "@/components/recent-conversations";
import { RevenueGauge } from "@/components/revenue-gauge";
import { DashboardStats } from "@/components/stats";
import { SupportActivity } from "@/components/support-activity";
import { TeamOnDuty } from "@/components/team-on-duty";

export function Dashboard() {
	return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStats />
            <ConversationVolumeChart />
            <RevenueGauge className="row-span-2 lg:col-span-1" />
            <ChannelBreakdownChart />
            <FirstReplyTimeChart />
            <TeamOnDuty />
            <RecentConversations />
            <SupportActivity />
        </div>
    );
}
