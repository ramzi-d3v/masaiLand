/*
  A login screen for the admin area, and nothing more than that.

  There is no user database and no server to check a password against, so
  this is a single shared passcode compared in the browser and a flag written
  to sessionStorage. That is a UI gate, not security: the passcode ships in
  the client bundle, anyone can read it in devtools, and clearing storage or
  disabling JS walks straight past it. It keeps the admin screens off by
  default for a casual visitor and nothing stronger.

  What it is guarding is, today, all placeholder or per-browser demo data —
  invented analytics, a static enquiries list, localStorage bookings — so the
  stakes of that weakness are low. They stop being low the moment anything
  real sits behind /admin. Before that happens this file needs to become a
  real session, issued and checked by a server: NextAuth, Clerk, or a
  hand-rolled cookie session with a hashed password, not this.
*/

export const DEMO_PASSCODE = "masailand2026";

const KEY = "masailand.admin.session";

export function isSignedIn() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function signIn(passcode) {
  if (passcode !== DEMO_PASSCODE) return false;
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* Private mode or storage disabled — the gate just stays open for the
       rest of this render, which is the safe direction to fail in for a
       UI-only gate. */
  }
  return true;
}

export function signOut() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* Nothing to do. */
  }
}
