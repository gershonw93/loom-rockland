/**
 * Health-condition eligibility options shown on the form.
 * `value` is the stable key stored in the database; `label` is the English
 * label used as a fallback and in the admin / CSV.
 */
export const ELIGIBILITY_CATEGORIES: { value: string; label: string }[] = [
  { value: "pregnant", label: "Pregnant" },
  { value: "miscarriage", label: "Had a Miscarriage" },
  { value: "postpartum", label: "Postpartum (Last 12 months)" },
  { value: "substance_use", label: "Substance Use Disorder" },
  { value: "hiv_aids", label: "HIV / AIDS" },
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension" },
  { value: "smi", label: "Serious Mental Illness (SMI)" },
  { value: "chronic", label: "Chronic Condition" },
  { value: "other", label: "Other" },
];

// Labels for retired values so older submissions still display readable text.
const LEGACY_LABELS: Record<string, string> = {
  pregnancy: "Pregnancy",
  food_insecurity: "Food Insecurity",
  housing_insecurity: "Housing Insecurity",
  heart_conditions: "Heart Conditions",
  obesity: "Obesity",
  mental_health: "Mental Health Challenges",
  developmental_disabilities: "Developmental Disabilities",
  physical_disabilities: "Physical Disabilities",
  medicaid_membership: "Medicaid Membership",
  public_assistance: "Public Assistance",
};

const LABEL_BY_VALUE = new Map<string, string>([
  ...ELIGIBILITY_CATEGORIES.map((c) => [c.value, c.label] as [string, string]),
  ...Object.entries(LEGACY_LABELS),
]);

export function eligibilityLabel(value: string): string {
  return LABEL_BY_VALUE.get(value) ?? value;
}
