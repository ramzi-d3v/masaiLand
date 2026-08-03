import EnquiriesManager from "@/components/admin/EnquiriesManager";

export const metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

export default function EnquiriesPage() {
  return (
    <>
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-500">
        Submissions from the contact form. Placeholder data, held in this
        tab&rsquo;s memory only — the form does not persist yet, and reloading
        resets read/unread and any deletions.
      </p>

      <EnquiriesManager />
    </>
  );
}
