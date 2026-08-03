import { Dashboard } from "@/components/dashboard";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminIndex() {
  return (
    <>
      {/* lib/adminContent.js is placeholder data for a UI-first build: there
          is no analytics pipeline and no enquiries backend yet. That has to be
          on screen, not just in a comment, or these numbers get quoted. */}
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-500">
        Placeholder data. Visits, devices and enquiries below come from
        <code className="mx-1 font-mono text-xs">lib/adminContent.js</code>, not
        from a live source — the site has no analytics pipeline and the contact
        form does not persist submissions yet.
      </p>

      <Dashboard />
    </>
  );
}
