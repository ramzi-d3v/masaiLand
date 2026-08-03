"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isSignedIn } from "@/lib/adminAuth";

/*
  Wraps the real admin screens. Checked client-side on mount — there is no
  server session to consult — so the very first paint has to assume signed
  out and show nothing rather than flash the dashboard before redirecting.
*/
export default function AuthGate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (isSignedIn()) {
      setStatus("in");
    } else {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      setStatus("out");
    }
    // Re-check whenever the route changes within the protected group, so
    // signing out in another tab is caught on the next navigation here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (status !== "in") return null;
  return children;
}
