export interface InsurancePhoto {
  /** Storage path, e.g. submissions/<id>/<filename> */
  path: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface FamilyMember {
  fullName: string;
  relationship: string; // relationship value (e.g. "spouse")
  dob: string; // YYYY-MM-DD
  cin: string; // Medicaid CIN (optional)
}

export interface Submission {
  formNumber: number; // sequential application number (from 860001)
  referredBy: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  eligibility: string[]; // category values
  familyMembers: number;
  members: FamilyMember[]; // additional household members
  medicaidIds: string[]; // CINs
  photos: InsurancePhoto[];
  agentCode: string; // referring agent's code ("" if none)
  agentName: string; // denormalised agent name
  status: string; // contact lifecycle status
  archived: boolean; // hidden from the active view but never deleted
  createdAt: string; // ISO string (serialised for the client)
}

export interface SubmissionRecord extends Submission {
  id: string;
}

export interface Agent {
  id: string; // == code
  code: string;
  name: string;
  active: boolean;
  createdAt: string; // ISO
}
