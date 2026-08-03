import { Suspense } from "react";
import LoginPage from "@/components/admin/LoginPage";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  // useSearchParams inside LoginPage needs a Suspense boundary during static
  // generation.
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
