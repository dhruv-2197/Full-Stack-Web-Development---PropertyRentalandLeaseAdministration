import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { extractApiError } from '../../models/api-error.model';
import { MaintenanceRequest } from '../../models/maintenance-request.model';
import { MaintenanceRequestService } from '../../services/maintenance-request.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AlertBannerComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    SearchBarComponent,
    StatusBadgeComponent
  ],
  templateUrl: './maintenance-list.component.html'
})
export class MaintenanceListComponent implements OnInit {
  private readonly maintenanceService = inject(MaintenanceRequestService);

  readonly requests = signal<MaintenanceRequest[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly statusFilter = signal('All');
  readonly priorityFilter = signal('All');
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly pendingDelete = signal<MaintenanceRequest | null>(null);

  readonly filteredRequests = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    return this.requests().filter((r) => {
      if (status !== 'All' && r.status.toLowerCase() !== status.toLowerCase()) return false;
      if (priority !== 'All' && r.priority.toLowerCase() !== priority.toLowerCase()) return false;
      if (!term) return true;
      return (
        r.issueCategory.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        (r.unitNumber ?? '').toLowerCase().includes(term) ||
        (r.propertyName ?? '').toLowerCase().includes(term) ||
        (r.tenantName ?? '').toLowerCase().includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading.set(true);
    this.error.set(null);

    this.maintenanceService.getAll().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load maintenance requests.'));
        this.loading.set(false);
      }
    });
  }

  getNextStatus(current: string): string | null {
    switch (current.toLowerCase()) {
      case 'open':
        return 'Assigned';
      case 'assigned':
        return 'In Progress';
      case 'in progress':
        return 'Resolved';
      default:
        return null;
    }
  }

  advanceStatus(req: MaintenanceRequest): void {
    const next = this.getNextStatus(req.status);
    if (!next) return;
    this.error.set(null);
    this.success.set(null);

    const notes =
      next === 'Resolved' && !req.resolutionNotes
        ? 'Issue inspected and resolved by maintenance team.'
        : (req.resolutionNotes ?? null);

    this.maintenanceService
      .update(req.requestId, {
        unitId: req.unitId,
        tenantId: req.tenantId,
        requestDate: req.requestDate,
        issueCategory: req.issueCategory,
        description: req.description,
        priority: req.priority,
        status: next,
        resolutionNotes: notes
      })
      .subscribe({
        next: () => {
          this.success.set(`Request #${req.requestId} moved to ${next}.`);
          this.loadRequests();
        },
        error: (err) => this.error.set(extractApiError(err, 'Failed to update status.'))
      });
  }

  confirmDelete(): void {
    const target = this.pendingDelete();
    if (!target) return;
    this.pendingDelete.set(null);
    this.error.set(null);
    this.success.set(null);

    this.maintenanceService.delete(target.requestId).subscribe({
      next: () => {
        this.success.set(`Maintenance request #${target.requestId} deleted.`);
        this.loadRequests();
      },
      error: (err) => this.error.set(extractApiError(err, 'Failed to delete maintenance request.'))
    });
  }
}
