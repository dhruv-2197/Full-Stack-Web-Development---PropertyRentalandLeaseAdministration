import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { RentalUnit } from '../../models/rental-unit.model';
import { Tenant } from '../../models/tenant.model';
import { LeaseService } from '../../services/lease.service';
import { RentalUnitService } from '../../services/rental-unit.service';
import { TenantService } from '../../services/tenant.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { FieldErrorComponent } from '../../shared/components/field-error/field-error.component';

function leaseDateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if (start && end && end < start) {
    return { dateRange: true };
  }
  return null;
}

@Component({
  selector: 'app-lease-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertBannerComponent, FieldErrorComponent],
  templateUrl: './lease-form.component.html'
})
export class LeaseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leaseService = inject(LeaseService);
  private readonly unitService = inject(RentalUnitService);
  private readonly tenantService = inject(TenantService);

  readonly leaseId = signal<number | null>(null);
  readonly units = signal<RentalUnit[]>([]);
  readonly tenants = signal<Tenant[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      leaseNumber: ['', [Validators.required, Validators.maxLength(30)]],
      unitId: [0, [Validators.required, Validators.min(1)]],
      tenantId: [0, [Validators.required, Validators.min(1)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      monthlyRent: [1500, [Validators.required, Validators.min(1)]],
      depositAmount: [3000, [Validators.required, Validators.min(0)]],
      leaseStatus: ['Active', [Validators.required]]
    },
    { validators: leaseDateRangeValidator }
  );

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    this.leaseId.set(id);

    const queryUnitId = Number(this.route.snapshot.queryParamMap.get('unitId') || 0);
    const queryTenantId = Number(this.route.snapshot.queryParamMap.get('tenantId') || 0);

    this.form.controls.unitId.valueChanges.subscribe((unitId) => {
      if (!this.leaseId()) {
        const selected = this.units().find((u) => u.unitId === Number(unitId));
        if (selected) {
          this.form.patchValue({
            monthlyRent: selected.monthlyRent,
            depositAmount: selected.monthlyRent * 2
          });
        }
      }
    });

    this.loading.set(true);
    if (id) {
      forkJoin({
        units: this.unitService.getAll(),
        tenants: this.tenantService.getAll(),
        lease: this.leaseService.getById(id)
      }).subscribe({
        next: ({ units, tenants, lease }) => {
          this.units.set(units);
          this.tenants.set(tenants);
          this.form.patchValue({
            leaseNumber: lease.leaseNumber,
            unitId: lease.unitId,
            tenantId: lease.tenantId,
            startDate: lease.startDate,
            endDate: lease.endDate,
            monthlyRent: lease.monthlyRent,
            depositAmount: lease.depositAmount,
            leaseStatus: lease.leaseStatus
          });
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractApiError(err, 'Failed to load lease.'));
          this.loading.set(false);
        }
      });
    } else {
      forkJoin({
        units: this.unitService.getAll(),
        tenants: this.tenantService.getAll()
      }).subscribe({
        next: ({ units, tenants }) => {
          this.units.set(units);
          this.tenants.set(tenants);
          if (queryUnitId > 0) {
            this.form.patchValue({ unitId: queryUnitId });
          }
          if (queryTenantId > 0) {
            this.form.patchValue({ tenantId: queryTenantId });
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractApiError(err, 'Failed to load units and tenants.'));
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
      leaseNumber: val.leaseNumber.trim(),
      unitId: Number(val.unitId),
      tenantId: Number(val.tenantId),
      startDate: val.startDate,
      endDate: val.endDate,
      monthlyRent: Number(val.monthlyRent),
      depositAmount: Number(val.depositAmount),
      leaseStatus: val.leaseStatus
    };

    const id = this.leaseId();
    const req$ = id ? this.leaseService.update(id, payload) : this.leaseService.create(payload);

    req$.subscribe({
      next: (saved) => this.router.navigate(['/leases', saved.leaseId || id || '']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Lease request rejected by server.'));
        this.saving.set(false);
      }
    });
  }
}
