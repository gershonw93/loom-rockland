import Link from "next/link";
import { EnrollmentForm } from "@/components/EnrollmentForm";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Apply — LOOM Rockland",
};

export default function ApplyPage() {
  return (
    <main>
      <header className="site-header">
        <Link href="/">
          <Logo variant="mark" height={30} className="mark" />
        </Link>
        <Link href="/" className="btn-ghost" style={{ padding: "9px 18px" }}>
          ← Home
        </Link>
      </header>
      <div className="apply-main">
        <EnrollmentForm />
      </div>
    </main>
  );
}
