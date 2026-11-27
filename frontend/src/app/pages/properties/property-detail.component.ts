import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { Property } from '../../models/property.model';
import { RentalUnit } from '../../models/rental-unit.model';
import { PropertyService } from '../../services/property.service';
import { RentalUnitService } from '../../services/rental-unit.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, AlertBannerComponent, StatusBadgeComponent],
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyService = inject(PropertyService);
  private readonly unitService = inject(RentalUnitService);

  readonly property = signal<Property | null>(null);
  readonly units = signal<RentalUnit[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);

    forkJoin({
      property: this.propertyService.getById(id),
      units: this.unitService.getAll(id)
    }).subscribe({
      next: ({ property, units }) => {
        this.property.set(property);
        this.units.set(units);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to load property details.'));
        this.loading.set(false);
      }
    });
  }
}
