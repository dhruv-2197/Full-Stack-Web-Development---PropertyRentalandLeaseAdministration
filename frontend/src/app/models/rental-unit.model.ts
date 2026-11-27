export type UnitStatus = 'Vacant' | 'Occupied' | 'Maintenance' | 'Inactive';

export interface RentalUnit {
  unitId: number;
  propertyId: number;
  propertyCode?: string;
  propertyName?: string;
  city?: string;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  monthlyRent: number;
  unitStatus: UnitStatus | string;
}

export interface RentalUnitPayload {
  propertyId: number;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  monthlyRent: number;
  unitStatus: string;
}
