import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthGate from "@/components/admin/AuthGate";

/*
  Every real admin screen — dashboard, enquiries, orders, rooms & halls —
  lives under this group, behind AuthGate. /admin/login sits outside it, one
  level up, so it never gets wrapped in the sidebar it exists to gate people
  out of.
*/
export default function DashboardLayout({ children }) {
  return (
    <AuthGate>
      <TooltipProvider>
        <AppShell>{children}</AppShell>
      </TooltipProvider>
    </AuthGate>
  );
}
