export const metadata = {
  robots: { index: false, follow: false },
};

/*
  Root layout for everything under /admin, including the login page — which is
  why it stays minimal. The sidebar, header and the sign-in check moved one
  level down to (dashboard)/layout.js, a route group that adds nothing to the
  URL, so /admin/login can render on its own rather than inside the shell it
  is there to gate.
*/
export default function AdminLayout({ children }) {
  return children;
}
