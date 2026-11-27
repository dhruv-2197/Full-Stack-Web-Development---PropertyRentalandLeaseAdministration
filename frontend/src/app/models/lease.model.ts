export type LeaseStatus = 'Active' | 'Pending' | 'Expired' | 'Terminated';

export interface Lease {
  leaseId: number;
  leaseNumber: string;
  unitId: number;
  unitNumber?: string;
  propertyId?: number;
  propertyName?: string;
  tenantId: number;
  tenantCode?: string;
  tenantName?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  leaseStatus: LeaseStatus | string;
}

export interface LeasePayload {
  leaseNumber: string;
  unitId: number;
  tenantId: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  leaseStatus: string;
}
