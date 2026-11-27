import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LeaseDetailComponent } from './pages/leases/lease-detail.component';
import { LeaseFormComponent } from './pages/leases/lease-form.component';
import { LeaseListComponent } from './pages/leases/lease-list.component';
import { MaintenanceFormComponent } from './pages/maintenance/maintenance-form.component';
import { MaintenanceListComponent } from './pages/maintenance/maintenance-list.component';
import { PropertyDetailComponent } from './pages/properties/property-detail.component';
import { PropertyFormComponent } from './pages/properties/property-form.component';
import { PropertyListComponent } from './pages/properties/property-list.component';
import { TenantDetailComponent } from './pages/tenants/tenant-detail.component';
import { TenantFormComponent } from './pages/tenants/tenant-form.component';
import { TenantListComponent } from './pages/tenants/tenant-list.component';
import { UnitDetailComponent } from './pages/units/unit-detail.component';
import { UnitFormComponent } from './pages/units/unit-form.component';
import { UnitListComponent } from './pages/units/unit-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'properties', component: PropertyListComponent },
  { path: 'properties/new', component: PropertyFormComponent },
  { path: 'properties/:id', component: PropertyDetailComponent },
  { path: 'properties/:id/edit', component: PropertyFormComponent },

  { path: 'units', component: UnitListComponent },
  { path: 'units/new', component: UnitFormComponent },
  { path: 'units/:id', component: UnitDetailComponent },
  { path: 'units/:id/edit', component: UnitFormComponent },

  { path: 'tenants', component: TenantListComponent },
  { path: 'tenants/new', component: TenantFormComponent },
  { path: 'tenants/:id', component: TenantDetailComponent },
  { path: 'tenants/:id/edit', component: TenantFormComponent },

  { path: 'leases', component: LeaseListComponent },
  { path: 'leases/new', component: LeaseFormComponent },
  { path: 'leases/:id', component: LeaseDetailComponent },
  { path: 'leases/:id/edit', component: LeaseFormComponent },

  { path: 'maintenance', component: MaintenanceListComponent },
  { path: 'maintenance/new', component: MaintenanceFormComponent },
  { path: 'maintenance/:id/edit', component: MaintenanceFormComponent },

  { path: '**', redirectTo: 'dashboard' }
];
