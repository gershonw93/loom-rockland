import type { Metadata } from "next";
import { InfoPageShell } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "About Us — LOOM Rockland",
  description:
    "LOOM Rockland delivers weekly meal boxes and support services to Medicaid members across Rockland County and New York.",
};

export default function AboutPage() {
  return (
    <InfoPageShell
      title="About LOOM Rockland"
      intro="LOOM Rockland is the local enrollment portal of the LOOM Social Care Network, connecting eligible Medicaid members with free weekly meal boxes and wraparound support services."
    >
      <h2>Who we are</h2>
      <p>
        We are a community-focused social care team serving Rockland County and the
        surrounding New York region. As part of the LOOM Social Care Network, we
        help residents access nutrition and support benefits available through New
        York State&apos;s Medicaid programs — at no cost to the people we serve.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>Deliver nutritious, fresh meal boxes to your door every week.</li>
        <li>Help you apply, confirm your eligibility, and complete enrollment.</li>
        <li>Connect you to additional support services such as housing and care coordination.</li>
      </ul>

      <h2>Our mission</h2>
      <p>
        We believe access to healthy food and dependable support should be simple
        and dignified. Our enrollment officers walk with you from the first form to
        your first delivery, and stay available whenever you need help.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:support@loomrockland.org">support@loomrockland.org</a> or
        call <a href="tel:+19294809101">(929) 480-9101</a>.
      </p>
    </InfoPageShell>
  );
}
