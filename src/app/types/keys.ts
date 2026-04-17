export interface ApiKey {
  name: string;
  key: string;
  product: string;
  createdAt: string;
  lastUsedAt: string;
  overallUsage: number;
  usage: { date: string; count: number }[];
}

export interface BillingData {
  date: string;
  description: string;
  amount: string;
  used: string;
  status: string;
}

export interface PlanDetails {
  currentPlan: string;
  unitsPerPlan: string;
  pay: string;
}

export interface PaymentDetails {
  cardType: string;
  cardNumber: string;
  expiryDate: string;
}
