export type UserRole = "patient" | "pharmacist";
export type VerificationStatus = "authentic" | "suspicious" | "counterfeit" | "expired" | "unregistered";
export type SubscriptionPlan  = "basic" | "professional" | "enterprise";
export type ReportType        = "fake_packaging" | "wrong_appearance" | "no_effect" | "bad_reaction";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  pharmacyName?: string;
  pcnLicence?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionExpiry?: string;
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  email:  string;
  role:   UserRole;
}

export interface DrugResult {
  id:               string;
  nafdacNumber:     string;
  batchNumber:      string;
  brandName:        string;
  genericName:      string;
  category:         string;
  strength:         string;
  form:             string;
  manufacturer:     string;
  countryOfOrigin:  string;
  expiryDate:       string;
  status:           VerificationStatus;
  nafdacRegistered: boolean;
  databaseMatch:    string;
  recallStatus:     string;
  qrIntegrity:      number;
  priceRangeNGN:    string;
  verifiedAt:       string;
}

export interface Report {
  id:           string;
  userId:       string;
  drugName:     string;
  batchNumber:  string;
  nafdacNumber?: string;
  location:     string;
  reportType:   ReportType;
  details?:     string;
  status:       "pending" | "reviewed" | "escalated" | "closed";
  refCode:      string;
  createdAt:    string;
}

export interface ScanRecord {
  id:           string;
  userId:       string;
  drugName:     string;
  batchNumber:  string;
  nafdacNumber: string;
  status:       VerificationStatus;
  scannedAt:    string;
}

export interface Pharmacy {
  id:          string;
  name:        string;
  address:     string;
  state:       string;
  verified:    boolean;
  pcnLicence?: string;
  trustScore:  number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?:   T;
  error?:  string;
  message?: string;
}
