import type { Metadata } from "next";
import { InfoPageShell } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy & HIPAA Notice — LOOM Rockland",
  description:
    "How LOOM Rockland protects your health information under HIPAA and keeps your data secure.",
};

export default function PrivacyPage() {
  return (
    <InfoPageShell
      title="Privacy Policy & HIPAA Notice"
      intro="LOOM Rockland is committed to protecting the privacy and security of your personal and health information. This notice describes how your information may be used and disclosed, and how you can access it."
    >
      <h2>Your health information is protected</h2>
      <p>
        The information you share with us — including your name, contact details,
        Medicaid CIN, and any health conditions you choose to disclose — is
        Protected Health Information (PHI). We handle it in accordance with the
        Health Insurance Portability and Accountability Act (HIPAA) and applicable
        New York State privacy laws.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Contact and delivery information (name, address, phone, date of birth).</li>
        <li>Medicaid eligibility information (CIN / Member ID and insurance card images), when you choose to provide it.</li>
        <li>Health-related eligibility categories and any supporting documents you choose to attach.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To verify your eligibility for the program and enroll you in services.</li>
        <li>To coordinate weekly meal-box delivery and support services.</li>
        <li>To contact you by phone or text to complete and confirm your enrollment.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell your information. We share it only with the
        partners and health plans necessary to deliver your benefits, and only as
        permitted or required by law.
      </p>

      <h2>How we protect your information</h2>
      <p>
        Your data is transmitted over encrypted connections and stored on secured,
        access-controlled systems. Uploaded documents and insurance cards are kept
        in restricted storage available only to authorized enrollment staff.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>You may request access to, or a correction of, the information we hold about you.</li>
        <li>Providing health information is optional — you can enroll without disclosing a health condition.</li>
        <li>You may ask us to delete your information, subject to program and legal requirements.</li>
      </ul>

      <h2>Contact us</h2>
      <p>
        For any privacy question or to exercise your rights, email{" "}
        <a href="mailto:support@loomrockland.org">support@loomrockland.org</a> or
        call <a href="tel:+19294809101">(929) 480-9101</a>.
      </p>
    </InfoPageShell>
  );
}
