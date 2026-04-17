import { Injectable } from '@angular/core';

import dataJson from '../mocks/billing.json';

import type { BillingData, PlanDetails, PaymentDetails } from '../types/keys';

@Injectable({ providedIn: 'root' })
export class BillingService {
  data: BillingData[] = dataJson.data;
  planDetails: PlanDetails = dataJson.planDetails;
  paymentDetails: PaymentDetails = dataJson.paymentDetails;

  async getBillingData(): Promise<BillingData[]> {
    return new Promise((resolve) => {
      resolve(this.data);
    });
  }

  async getPlanDetails(): Promise<PlanDetails> {
    return new Promise((resolve) => {
      resolve(this.planDetails);
    });
  }

  async getPaymentDetails(): Promise<PaymentDetails> {
    return new Promise((resolve) => {
      resolve(this.paymentDetails);
    });
  }
}
