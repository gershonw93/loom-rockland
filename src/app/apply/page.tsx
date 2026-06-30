import Link from "next/link";
import { EnrollmentForm } from "@/components/EnrollmentForm";
import { Brand } from "@/components/Brand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const metadata = {
  title: "Apply — LOOM Rockland",
};

export default function ApplyPage() {
  return (
    <main>
      <header className="site-header">
        <Link href="/">
          <Brand height={30} />
        </Link>
        <div className="right">
          <LanguageSwitcher />
        </div>
      </header>
      <div className="apply-main">
        <EnrollmentForm />
      </div>
    </main>
  );
}
