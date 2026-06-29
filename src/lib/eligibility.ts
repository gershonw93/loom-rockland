/**
 * Eligibility categories — mirror the LOOM enrollment form exactly.
 * `value` is the stable key stored in the database; `label` is shown to users
 * and used as the CSV column header value.
 */
export const ELIGIBILITY_CATEGORIES: { value: string; label: string }[] = [
  { value: "pregnancy", label: "Pregnancy – Expecting mothers" },
  {
    value: "postpartum",
    label: "Postpartum – New mothers (typically up to 1 year after birth)",
  },
  {
    value: "food_insecurity",
    label: "Food Insecurity – Difficulty affording or accessing nutritious food",
  },
  {
    value: "housing_insecurity",
    label:
      "Housing Insecurity – At risk of eviction, homelessness, or struggle to pay rent",
  },
  { value: "diabetes", label: "Diabetes – Managing blood sugar through diet" },
  {
    value: "hypertension",
    label: "Hypertension – High blood pressure requiring healthy nutrition",
  },
  {
    value: "heart_conditions",
    label: "Heart Conditions – Chronic heart disease support",
  },
  {
    value: "obesity",
    label: "Obesity – Need for nutritional support for weight management",
  },
  {
    value: "mental_health",
    label:
      "Mental Health Challenges – Depression, anxiety, or other mental health struggles",
  },
  {
    value: "developmental_disabilities",
    label:
      "Developmental Disabilities – Autism, Down syndrome, or other delays",
  },
  {
    value: "physical_disabilities",
    label: "Physical Disabilities – Mobility issues affecting food access",
  },
  {
    value: "substance_use",
    label: "Substance Use Disorder – Support for those in recovery",
  },
  {
    value: "medicaid_membership",
    label: "Medicaid Membership – Holders of Healthfirst, Fidelis, United, etc.",
  },
  {
    value: "public_assistance",
    label: "Public Assistance – Individuals receiving SNAP, WIC, SSI, or TANF",
  },
];

const LABEL_BY_VALUE = new Map(
  ELIGIBILITY_CATEGORIES.map((c) => [c.value, c.label])
);

export function eligibilityLabel(value: string): string {
  return LABEL_BY_VALUE.get(value) ?? value;
}
