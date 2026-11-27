import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { extractApiError } from '../../models/api-error.model';
import { PropertyService } from '../../services/property.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { FieldErrorComponent } from '../../shared/components/field-error/field-error.component';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertBannerComponent, FieldErrorComponent],
  templateUrl: './property-form.component.html'
})
export class PropertyFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  readonly propertyId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    propertyCode: ['', [Validators.required, Validators.maxLength(30)]],
    propertyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    propertyType: ['Residential', [Validators.required, Validators.maxLength(50)]],
    address: ['', [Validators.required, Validators.maxLength(255)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    managerName: ['', [Validators.required, Validators.maxLength(120)]],
    active: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.propertyId.set(id);
      this.loading.set(true);
      this.propertyService.getById(id).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractApiError(err, 'Failed to load property.'));
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
      ...val,
      propertyCode: val.propertyCode.trim(),
      propertyName: val.propertyName.trim(),
      propertyType: val.propertyType.trim(),
      address: val.address.trim(),
      city: val.city.trim(),
      managerName: val.managerName.trim()
    };

    const id = this.propertyId();
    const req$ = id ? this.propertyService.update(id, payload) : this.propertyService.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/properties']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to save property.'));
        this.saving.set(false);
      }
    });
  }
}
