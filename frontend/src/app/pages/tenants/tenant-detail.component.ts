import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { Lease } from '../../models/lease.model';
import { Tenant } from '../../models/tenant.model';
import { LeaseService } from '../../services/lease.service';
import { TenantService } from '../../services/tenant.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, AlertBannerComponent, StatusBadgeComponent],
  templateUrl: './tenant-detail.component.html'
})
export class TenantDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tenantService = inject(TenantService);
  private readonly leaseService = inject(LeaseService);

  readonly tenant = signal<Tenant | null>(null);
  readonly leases = signal<Lease[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);

    forkJoin({
      tenant: this.tenantService.getById(id),
      leases: this.leaseService.getAll(undefined, id)
    }).subscribe({
      next: ({ tenant, leases }) => {
        this.tenant.set(tenant);
        this.leases.set(leases);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load tenant details.'));
        this.loading.set(false);
      }
    });
  }
}
