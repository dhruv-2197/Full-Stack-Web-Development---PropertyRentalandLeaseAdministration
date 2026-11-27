import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { extractApiError } from '../../models/api-error.model';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    RouterLink,
    AlertBannerComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    SearchBarComponent,
    StatusBadgeComponent
  ],
  templateUrl: './property-list.component.html'
})
export class PropertyListComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);

  readonly properties = signal<Property[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly pendingDelete = signal<Property | null>(null);

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(search = this.searchTerm()): void {
    this.loading.set(true);
    this.error.set(null);

    this.propertyService.getAll(search).subscribe({
      next: (data) => {
        this.properties.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load properties.'));
        this.loading.set(false);
      }
    });
  }

  toggleActive(p: Property): void {
    this.error.set(null);
    this.success.set(null);

    this.propertyService
      .update(p.propertyId, {
        propertyCode: p.propertyCode,
        propertyName: p.propertyName,
        propertyType: p.propertyType,
        address: p.address,
        city: p.city,
        managerName: p.managerName,
        active: !p.active
      })
      .subscribe({
        next: () => {
          this.success.set(`Property ${p.propertyCode} marked as ${!p.active ? 'Active' : 'Inactive'}.`);
          this.loadProperties();
        },
        error: (err) => this.error.set(extractApiError(err, 'Failed to update property status.'))
      });
  }

  confirmDelete(): void {
    const target = this.pendingDelete();
    if (!target) return;
    this.pendingDelete.set(null);
    this.error.set(null);
    this.success.set(null);

    this.propertyService.delete(target.propertyId).subscribe({
      next: () => {
        this.success.set(`Property ${target.propertyCode} deleted successfully.`);
        this.loadProperties();
      },
      error: (err) => this.error.set(extractApiError(err, 'Cannot delete this property.'))
    });
  }
}
