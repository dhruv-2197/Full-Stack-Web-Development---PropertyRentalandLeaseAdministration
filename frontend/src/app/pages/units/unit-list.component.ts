import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { Property } from '../../models/property.model';
import { RentalUnit } from '../../models/rental-unit.model';
import { PropertyService } from '../../services/property.service';
import { RentalUnitService } from '../../services/rental-unit.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-unit-list',
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
  templateUrl: './unit-list.component.html'
})
export class UnitListComponent implements OnInit {
  private readonly unitService = inject(RentalUnitService);
  private readonly propertyService = inject(PropertyService);

  readonly units = signal<RentalUnit[]>([]);
  readonly properties = signal<Property[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly propertyFilter = signal<number>(0);
  readonly statusFilter = signal('All');
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly pendingDelete = signal<RentalUnit | null>(null);

  readonly filteredUnits = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const propId = Number(this.propertyFilter());
    const status = this.statusFilter();

    return this.units().filter((u) => {
      if (propId > 0 && u.propertyId !== propId) return false;
      if (status !== 'All' && u.unitStatus.toLowerCase() !== status.toLowerCase()) return false;
      if (!term) return true;
      return (
        u.unitNumber.toLowerCase().includes(term) ||
        (u.propertyName ?? '').toLowerCase().includes(term) ||
        (u.city ?? '').toLowerCase().includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      units: this.unitService.getAll(),
      properties: this.propertyService.getAll()
    }).subscribe({
      next: ({ units, properties }) => {
        this.units.set(units);
        this.properties.set(properties);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load rental units.'));
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

    this.unitService.delete(target.unitId).subscribe({
      next: () => {
        this.success.set(`Unit ${target.unitNumber} deleted successfully.`);
        this.loadAll();
      },
      error: (err) => this.error.set(extractApiError(err, 'Cannot delete this unit.'))
    });
  }
}
