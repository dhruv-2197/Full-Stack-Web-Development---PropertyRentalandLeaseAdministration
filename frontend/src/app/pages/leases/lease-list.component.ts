import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { extractApiError } from '../../models/api-error.model';
import { Lease } from '../../models/lease.model';
import { LeaseService } from '../../services/lease.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-lease-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    AlertBannerComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    SearchBarComponent,
    StatusBadgeComponent
  ],
  templateUrl: './lease-list.component.html'
})
export class LeaseListComponent implements OnInit {
  private readonly leaseService = inject(LeaseService);

  readonly leases = signal<Lease[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly statusFilter = signal('All');
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly pendingDelete = signal<Lease | null>(null);

  readonly filteredLeases = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.leases().filter((l) => {
      if (status !== 'All' && l.leaseStatus.toLowerCase() !== status.toLowerCase()) return false;
      if (!term) return true;
      return (
        l.leaseNumber.toLowerCase().includes(term) ||
        (l.unitNumber ?? '').toLowerCase().includes(term) ||
        (l.propertyName ?? '').toLowerCase().includes(term) ||
        (l.tenantName ?? '').toLowerCase().includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.loadLeases();
  }

  loadLeases(): void {
    this.loading.set(true);
    this.error.set(null);

    this.leaseService.getAll().subscribe({
      next: (data) => {
        this.leases.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load leases.'));
        this.loading.set(false);
      }
    });
  }

  terminateLease(l: Lease): void {
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
        next: () => {
          this.success.set(`Lease ${l.leaseNumber} terminated. Unit status updated.`);
          this.loadLeases();
        },
        error: (err) => this.error.set(extractApiError(err, 'Failed to terminate lease.'))
      });
  }

  confirmDelete(): void {
    const target = this.pendingDelete();
    if (!target) return;
    this.pendingDelete.set(null);
    this.error.set(null);
    this.success.set(null);

    this.leaseService.delete(target.leaseId).subscribe({
      next: () => {
        this.success.set(`Lease ${target.leaseNumber} deleted successfully.`);
        this.loadLeases();
      },
      error: (err) => this.error.set(extractApiError(err, 'Failed to delete lease.'))
    });
  }
}
