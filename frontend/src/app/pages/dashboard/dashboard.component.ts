import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { Lease } from '../../models/lease.model';
import { MaintenanceRequest } from '../../models/maintenance-request.model';
import { Property } from '../../models/property.model';
import { RentalUnit } from '../../models/rental-unit.model';
import { Tenant } from '../../models/tenant.model';
import { LeaseService } from '../../services/lease.service';
import { MaintenanceRequestService } from '../../services/maintenance-request.service';
import { PropertyService } from '../../services/property.service';
import { RentalUnitService } from '../../services/rental-unit.service';
import { TenantService } from '../../services/tenant.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, AlertBannerComponent, DataTableComponent, StatusBadgeComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);
  private readonly unitService = inject(RentalUnitService);
  private readonly tenantService = inject(TenantService);
  private readonly leaseService = inject(LeaseService);
  private readonly maintenanceService = inject(MaintenanceRequestService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly properties = signal<Property[]>([]);
  readonly units = signal<RentalUnit[]>([]);
  readonly tenants = signal<Tenant[]>([]);
  readonly leases = signal<Lease[]>([]);
  readonly maintenanceRequests = signal<MaintenanceRequest[]>([]);

  readonly occupiedUnitsCount = computed(
    () => this.units().filter((u) => u.unitStatus.toLowerCase() === 'occupied').length
  );
  readonly vacantUnits = computed(
    () => this.units().filter((u) => u.unitStatus.toLowerCase() === 'vacant')
  );
  readonly occupancyPercent = computed(() => {
    const total = this.units().length;
    if (total === 0) return 0;
    return Math.round((this.occupiedUnitsCount() / total) * 100);
  });
  readonly monthlyRentRoll = computed(() =>
    this.leases()
      .filter((l) => l.leaseStatus.toLowerCase() === 'active')
      .reduce((sum, l) => sum + Number(l.monthlyRent || 0), 0)
  );
  readonly openMaintenanceCount = computed(
    () => this.maintenanceRequests().filter((m) => m.status.toLowerCase() !== 'resolved').length
  );

  readonly expiringSoonLeases = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + 45);

    return this.leases()
      .filter((l) => {
        if (l.leaseStatus.toLowerCase() !== 'active') return false;
        const end = new Date(l.endDate + 'T00:00:00');
        return end >= today && end <= cutoff;
      })
      .sort((a, b) => a.endDate.localeCompare(b.endDate));
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      properties: this.propertyService.getAll(),
      units: this.unitService.getAll(),
      tenants: this.tenantService.getAll(),
      leases: this.leaseService.getAll(),
      maintenanceRequests: this.maintenanceService.getAll()
    }).subscribe({
      next: (res) => {
        this.properties.set(res.properties);
        this.units.set(res.units);
        this.tenants.set(res.tenants);
        this.leases.set(res.leases);
        this.maintenanceRequests.set(res.maintenanceRequests);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load dashboard.'));
        this.loading.set(false);
      }
    });
  }

  daysRemaining(endDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate + 'T00:00:00');
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
}
