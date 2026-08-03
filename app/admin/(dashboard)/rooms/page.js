import ListingsManager from "@/components/admin/ListingsManager";

export const metadata = {
  title: "Rooms & halls",
  robots: { index: false, follow: false },
};

export default function AdminRoomsPage() {
  return (
    <>
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-500">
        Changes here are stored in this browser, not on a server. The shop at
        <code className="mx-1 font-mono text-xs">/book</code> picks them up on
        this device only.
      </p>

      <ListingsManager />
    </>
  );
}
