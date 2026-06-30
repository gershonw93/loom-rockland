/** Relationship options shown in the household-member dropdown. */
export const RELATIONSHIPS: { value: string; key: string; en: string }[] = [
  { value: "child", key: "rel.child", en: "Child" },
  { value: "husband", key: "rel.husband", en: "Husband" },
  { value: "wife", key: "rel.wife", en: "Wife" },
  { value: "mother", key: "rel.mother", en: "Mother" },
  { value: "other", key: "rel.other", en: "Other" },
];

// Include legacy values so older submissions still display a readable label.
const EN = new Map<string, string>([
  ...RELATIONSHIPS.map((r) => [r.value, r.en] as [string, string]),
  ["spouse", "Spouse"],
  ["parent", "Parent"],
  ["sibling", "Sibling"],
  ["grandparent", "Grandparent"],
  ["grandchild", "Grandchild"],
]);

export function relationshipEn(value: string): string {
  return EN.get(value) ?? value;
}
