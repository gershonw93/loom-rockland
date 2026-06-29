import { EnrollmentForm } from "@/components/EnrollmentForm";
import { LoomMark } from "@/components/LoomMark";

export default function Home() {
  return (
    <main>
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <LoomMark size={20} />
          </div>
          <h1>
            LOOM — Social Care Network
            <br />
            Official Enrollment Portal
          </h1>
          <p className="sub">Weekly Free Meal Boxes &amp; Support Services</p>
          <p className="meta">Serving Rockland County, NY</p>
        </div>
      </header>

      <div className="page">
        <EnrollmentForm />
        <p className="footer">
          Your information is submitted securely to the LOOM Care Team.
        </p>
      </div>
    </main>
  );
}
