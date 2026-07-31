import type { Metadata } from "next";
import { InfoPageShell } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "FAQ — LOOM Rockland",
  description:
    "Answers to common questions about LOOM Rockland eligibility, Medicaid, SNAP, and how the free meal-box program works.",
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Who is eligible for the program?",
    a: (
      <>
        The program is for New York residents enrolled in Medicaid who have a
        qualifying health or social need — such as pregnancy, postpartum, a chronic
        condition, or other circumstances. If you&apos;re unsure,{" "}
        <a href="/apply">apply</a> and our team will help you check.
      </>
    ),
  },
  {
    q: "Does this cost anything?",
    a: <>No. The weekly meal boxes and support services are 100% free for eligible Medicaid members.</>,
  },
  {
    q: "Will this affect my SNAP / Food Stamps?",
    a: (
      <>
        No. This is a Medicaid-funded nutrition benefit and does{" "}
        <strong>not</strong> reduce or affect your SNAP / Food Stamps (EBT)
        benefits.
      </>
    ),
  },
  {
    q: "Do I need to provide my Medicaid CIN to apply?",
    a: (
      <>
        No — it&apos;s optional. Providing your Medicaid CIN or a photo of your
        insurance card helps us approve you faster, but you can submit your
        application without it and an enrollment officer will collect the details
        during your call.
      </>
    ),
  },
  {
    q: "What happens after I apply?",
    a: (
      <>
        You&apos;ll receive an application number right away. An enrollment officer
        from the LOOM office will call you within 48 hours to verify your
        information and finalize your enrollment — so please keep your phone handy.
      </>
    ),
  },
  {
    q: "Can I apply for my whole household?",
    a: <>Yes. During the application you can add additional family members in your household.</>,
  },
  {
    q: "What areas do you serve?",
    a: <>We serve Rockland County and the surrounding New York region.</>,
  },
];

export default function FaqPage() {
  return (
    <InfoPageShell
      title="Frequently Asked Questions"
      intro="Answers to the questions we hear most about eligibility, Medicaid, and how LOOM Rockland works."
    >
      {FAQS.map((f, i) => (
        <div className="faq-item" key={i}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </div>
      ))}

      <h2>Still have questions?</h2>
      <p>
        Email <a href="mailto:support@loomrockland.org">support@loomrockland.org</a>{" "}
        or call <a href="tel:+19294809101">(929) 480-9101</a>.
      </p>
    </InfoPageShell>
  );
}
