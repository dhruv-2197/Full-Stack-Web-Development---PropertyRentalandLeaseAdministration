export interface Tenant {
  tenantId: number;
  tenantCode: string;
  fullName: string;
  phone: string;
  email: string;
  currentAddress?: string | null;
}

export type TenantPayload = Omit<Tenant, 'tenantId'>;
