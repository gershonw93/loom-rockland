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
  createdAt: string; // ISO string (serialised for the client)
}

export interface SubmissionRecord extends Submission {
  id: string;
}
