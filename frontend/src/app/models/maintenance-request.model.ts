export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type MaintenanceStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved';

export interface MaintenanceRequest {
  requestId: number;
  unitId: number;
  unitNumber?: string;
  propertyName?: string;
  tenantId: number;
  tenantCode?: string;
  tenantName?: string;
  requestDate: string;
  issueCategory: string;
  description: string;
  priority: MaintenancePriority | string;
  status: MaintenanceStatus | string;
  resolutionNotes?: string | null;
}

export interface MaintenanceRequestPayload {
  unitId: number;
  tenantId: number;
  requestDate: string;
  issueCategory: string;
  description: string;
  priority: string;
  status: string;
  resolutionNotes: string | null;
}
