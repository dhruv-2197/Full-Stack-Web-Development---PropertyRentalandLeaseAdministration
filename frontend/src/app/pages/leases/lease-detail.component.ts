import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { extractApiError } from '../../models/api-error.model';
import { Lease } from '../../models/lease.model';
import { LeaseService } from '../../services/lease.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-lease-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, AlertBannerComponent, StatusBadgeComponent],
  templateUrl: './lease-detail.component.html'
})
export class LeaseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly leaseService = inject(LeaseService);

  readonly lease = signal<Lease | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLease(id);
  }

  loadLease(id: number): void {
    this.loading.set(true);
    this.leaseService.getById(id).subscribe({
      next: (data) => {
        this.lease.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load lease details.'));
        this.loading.set(false);
      }
    });
  }

  terminate(): void {
    const l = this.lease();
    if (!l) return;
    this.error.set(null);
    this.success.set(null);

    this.leaseService
      .update(l.leaseId, {
        leaseNumber: l.leaseNumber,
        unitId: l.unitId,
        tenantId: l.tenantId,
        startDate: l.startDate,
        endDate: l.endDate,
        monthlyRent: l.monthlyRent,
        depositAmount: l.depositAmount,
        leaseStatus: 'Terminated'
      })
      .subscribe({
        next: (updated) => {
          this.lease.set(updated);
          this.success.set(`Lease ${updated.leaseNumber} terminated and unit availability refreshed.`);
        },
        error: (err) => this.error.set(extractApiError(err, 'Failed to terminate lease.'))
      });
  }
}
