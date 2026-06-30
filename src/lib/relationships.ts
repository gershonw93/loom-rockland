/** Relationship options for additional household members. */
export const RELATIONSHIPS: { value: string; key: string; en: string }[] = [
  { value: "spouse", key: "rel.spouse", en: "Spouse" },
  { value: "child", key: "rel.child", en: "Child" },
  { value: "parent", key: "rel.parent", en: "Parent" },
  { value: "sibling", key: "rel.sibling", en: "Sibling" },
  { value: "grandparent", key: "rel.grandparent", en: "Grandparent" },
  { value: "grandchild", key: "rel.grandchild", en: "Grandchild" },
  { value: "other", key: "rel.other", en: "Other" },
];

const EN = new Map(RELATIONSHIPS.map((r) => [r.value, r.en]));
export function relationshipEn(value: string): string {
  return EN.get(value) ?? value;
}
