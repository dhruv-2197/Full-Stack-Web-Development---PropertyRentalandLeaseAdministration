export interface Property {
  propertyId: number;
  propertyCode: string;
  propertyName: string;
  propertyType: string;
  address: string;
  city: string;
  managerName: string;
  active: boolean;
}

export type PropertyPayload = Omit<Property, 'propertyId'>;
