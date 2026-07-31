import type { Metadata } from "next";
import { InfoPageShell } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Our Services — LOOM Rockland",
  description:
    "1115 Waiver support services from LOOM Rockland: nutrition, housing, care coordination, and more for eligible Medicaid members.",
};

export default function ServicesPage() {
  return (
    <InfoPageShell
      title="Our Services"
      intro="Through New York State's 1115 Medicaid Waiver, LOOM Rockland connects eligible members to Health-Related Social Needs (HRSN) services — starting with food, and extending to the supports that help you stay healthy."
    >
      <h2>Nutrition</h2>
      <ul>
        <li>Free weekly fresh meal boxes delivered to your door.</li>
        <li>Medically tailored food for pregnancy, postpartum, and chronic conditions.</li>
        <li>Nutrition support that does <strong>not</strong> affect your SNAP / Food Stamps benefits.</li>
      </ul>

      <h2>Housing support</h2>
      <ul>
        <li>Housing navigation and application assistance.</li>
        <li>Connection to tenancy-sustaining and stability services.</li>
      </ul>

      <h2>Care coordination</h2>
      <ul>
        <li>Help understanding and using your Medicaid benefits.</li>
        <li>Referrals and warm hand-offs to health and social service partners.</li>
      </ul>

      <h2>Who qualifies</h2>
      <p>
        These services are available to New York residents enrolled in Medicaid who
        meet certain health or social-need criteria — such as pregnancy, postpartum,
        a chronic condition, or other qualifying circumstances. Not sure if you
        qualify? <a href="/apply">Start an application</a> and our team will help you
        find out.
      </p>

      <h2>Learn more</h2>
      <p>
        Email <a href="mailto:support@loomrockland.org">support@loomrockland.org</a>{" "}
        or call <a href="tel:+19294809101">(929) 480-9101</a>.
      </p>
    </InfoPageShell>
  );
}
