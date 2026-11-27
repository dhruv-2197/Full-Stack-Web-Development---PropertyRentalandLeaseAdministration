import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { Lease } from '../../models/lease.model';
import { MaintenanceRequest } from '../../models/maintenance-request.model';
import { RentalUnit } from '../../models/rental-unit.model';
import { LeaseService } from '../../services/lease.service';
import { MaintenanceRequestService } from '../../services/maintenance-request.service';
import { RentalUnitService } from '../../services/rental-unit.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-unit-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, AlertBannerComponent, StatusBadgeComponent],
  templateUrl: './unit-detail.component.html'
})
export class UnitDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly unitService = inject(RentalUnitService);
  private readonly leaseService = inject(LeaseService);
  private readonly maintenanceService = inject(MaintenanceRequestService);

  readonly unit = signal<RentalUnit | null>(null);
  readonly leases = signal<Lease[]>([]);
  readonly requests = signal<MaintenanceRequest[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);

    forkJoin({
      unit: this.unitService.getById(id),
      leases: this.leaseService.getAll(id),
      requests: this.maintenanceService.getAll(id)
    }).subscribe({
      next: ({ unit, leases, requests }) => {
        this.unit.set(unit);
        this.leases.set(leases);
        this.requests.set(requests);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load unit details.'));
        this.loading.set(false);
      }
    });
  }
}
