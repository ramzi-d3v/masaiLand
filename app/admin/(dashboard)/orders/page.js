import OrdersTable from "@/components/admin/OrdersTable";

export const metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return (
    <>
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-500">
        No payment was taken for any booking below. The checkout is a
        simulation, and orders are stored in this browser only — there is no
        server, so this list is per device and clearing site data erases it.
      </p>

      <OrdersTable />
    </>
  );
}
