export interface InsurancePhoto {
  /** Storage path, e.g. submissions/<id>/<filename> */
  path: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface Submission {
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
  medicaidIds: string[]; // CINs
  photos: InsurancePhoto[];
  agentCode: string; // referring agent's code ("" if none)
  agentName: string; // denormalised agent name
  status: string; // contact lifecycle status
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
