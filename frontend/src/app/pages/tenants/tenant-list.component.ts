import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { extractApiError } from '../../models/api-error.model';
import { Tenant } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [RouterLink, AlertBannerComponent, ConfirmDialogComponent, DataTableComponent, SearchBarComponent],
  templateUrl: './tenant-list.component.html'
})
export class TenantListComponent implements OnInit {
  private readonly tenantService = inject(TenantService);

  readonly tenants = signal<Tenant[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly pendingDelete = signal<Tenant | null>(null);

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(search = this.searchTerm()): void {
    this.loading.set(true);
    this.error.set(null);

    this.tenantService.getAll(search).subscribe({
      next: (data) => {
        this.tenants.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load tenants.'));
        this.loading.set(false);
      }
    });
  }

  confirmDelete(): void {
    const target = this.pendingDelete();
    if (!target) return;
    this.pendingDelete.set(null);
    this.error.set(null);
    this.success.set(null);

    this.tenantService.delete(target.tenantId).subscribe({
      next: () => {
        this.success.set(`Tenant ${target.tenantCode} deleted successfully.`);
        this.loadTenants();
      },
      error: (err) => this.error.set(extractApiError(err, 'Cannot delete this tenant.'))
    });
  }
}
