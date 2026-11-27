import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { RentalUnitService } from '../../services/rental-unit.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { FieldErrorComponent } from '../../shared/components/field-error/field-error.component';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertBannerComponent, FieldErrorComponent],
  templateUrl: './unit-form.component.html'
})
export class UnitFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly unitService = inject(RentalUnitService);
  private readonly propertyService = inject(PropertyService);

  readonly unitId = signal<number | null>(null);
  readonly properties = signal<Property[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    propertyId: [0, [Validators.required, Validators.min(1)]],
    unitNumber: ['', [Validators.required, Validators.maxLength(30)]],
    floor: [1, [Validators.required, Validators.min(0)]],
    bedrooms: [1, [Validators.required, Validators.min(0)]],
    monthlyRent: [1200, [Validators.required, Validators.min(1)]],
    unitStatus: ['Vacant', [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    this.unitId.set(id);
    const queryPropId = Number(this.route.snapshot.queryParamMap.get('propertyId') || 0);

    this.loading.set(true);
    if (id) {
      forkJoin({
        properties: this.propertyService.getAll(),
        unit: this.unitService.getById(id)
      }).subscribe({
        next: ({ properties, unit }) => {
          this.properties.set(properties);
          this.form.patchValue({
            propertyId: unit.propertyId,
            unitNumber: unit.unitNumber,
            floor: unit.floor,
            bedrooms: unit.bedrooms,
            monthlyRent: unit.monthlyRent,
            unitStatus: unit.unitStatus
          });
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractApiError(err, 'Failed to load rental unit.'));
          this.loading.set(false);
        }
      });
    } else {
      this.propertyService.getAll().subscribe({
        next: (properties) => {
          this.properties.set(properties.filter((p) => p.active));
          if (queryPropId > 0) {
            this.form.patchValue({ propertyId: queryPropId });
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractApiError(err, 'Failed to load properties.'));
          this.loading.set(false);
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    const val = this.form.getRawValue();
    const payload = {
      propertyId: Number(val.propertyId),
      unitNumber: val.unitNumber.trim(),
      floor: Number(val.floor),
      bedrooms: Number(val.bedrooms),
      monthlyRent: Number(val.monthlyRent),
      unitStatus: val.unitStatus
    };

    const id = this.unitId();
    const req$ = id ? this.unitService.update(id, payload) : this.unitService.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/units']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to save rental unit.'));
        this.saving.set(false);
      }
    });
  }
}
