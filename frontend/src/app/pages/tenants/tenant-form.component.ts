import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { extractApiError } from '../../models/api-error.model';
import { TenantService } from '../../services/tenant.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { FieldErrorComponent } from '../../shared/components/field-error/field-error.component';

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertBannerComponent, FieldErrorComponent],
  templateUrl: './tenant-form.component.html'
})
export class TenantFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tenantService = inject(TenantService);

  readonly tenantId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    tenantCode: ['', [Validators.required, Validators.maxLength(30)]],
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,20}$/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    currentAddress: ['', [Validators.maxLength(255)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.tenantId.set(id);
      this.loading.set(true);
      this.tenantService.getById(id).subscribe({
        next: (t) => {
          this.form.patchValue({
            tenantCode: t.tenantCode,
            fullName: t.fullName,
            phone: t.phone,
            email: t.email,
            currentAddress: t.currentAddress ?? ''
          });
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractApiError(err, 'Failed to load tenant.'));
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
      tenantCode: val.tenantCode.trim(),
      fullName: val.fullName.trim(),
      phone: val.phone.trim(),
      email: val.email.trim(),
      currentAddress: val.currentAddress.trim() || null
    };

    const id = this.tenantId();
    const req$ = id ? this.tenantService.update(id, payload) : this.tenantService.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/tenants']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to save tenant.'));
        this.saving.set(false);
      }
    });
  }
}
