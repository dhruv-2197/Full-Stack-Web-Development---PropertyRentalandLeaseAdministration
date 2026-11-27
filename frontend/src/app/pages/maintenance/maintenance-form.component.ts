import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { extractApiError } from '../../models/api-error.model';
import { RentalUnit } from '../../models/rental-unit.model';
import { Tenant } from '../../models/tenant.model';
import { MaintenanceRequestService } from '../../services/maintenance-request.service';
import { RentalUnitService } from '../../services/rental-unit.service';
import { TenantService } from '../../services/tenant.service';
import { AlertBannerComponent } from '../../shared/components/alert-banner/alert-banner.component';
import { FieldErrorComponent } from '../../shared/components/field-error/field-error.component';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertBannerComponent, FieldErrorComponent],
  templateUrl: './maintenance-form.component.html'
})
export class MaintenanceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly maintenanceService = inject(MaintenanceRequestService);
  private readonly unitService = inject(RentalUnitService);
  private readonly tenantService = inject(TenantService);

  readonly requestId = signal<number | null>(null);
  readonly units = signal<RentalUnit[]>([]);
  readonly tenants = signal<Tenant[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  private readonly today = new Date().toISOString().slice(0, 10);

  readonly form = this.fb.nonNullable.group({
    unitId: [0, [Validators.required, Validators.min(1)]],
    tenantId: [0, [Validators.required, Validators.min(1)]],
    requestDate: [this.today, [Validators.required]],
    issueCategory: ['Plumbing', [Validators.required, Validators.maxLength(80)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    priority: ['Medium', [Validators.required]],
    status: ['Open', [Validators.required]],
    resolutionNotes: ['', [Validators.maxLength(255)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    this.requestId.set(id);

    this.loading.set(true);
    if (id) {
      forkJoin({
        units: this.unitService.getAll(),
        tenants: this.tenantService.getAll(),
        request: this.maintenanceService.getById(id)
      }).subscribe({
        next: ({ units, tenants, request }) => {
          this.units.set(units);
          this.tenants.set(tenants);
          this.form.patchValue({
            unitId: request.unitId,
            tenantId: request.tenantId,
            requestDate: request.requestDate,
            issueCategory: request.issueCategory,
            description: request.description,
            priority: request.priority,
            status: request.status,
            resolutionNotes: request.resolutionNotes ?? ''
          });
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractApiError(err, 'Failed to load maintenance request.'));
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
      unitId: Number(val.unitId),
      tenantId: Number(val.tenantId),
      requestDate: val.requestDate,
      issueCategory: val.issueCategory.trim(),
      description: val.description.trim(),
      priority: val.priority,
      status: val.status,
      resolutionNotes: val.resolutionNotes.trim() || null
    };

    const id = this.requestId();
    const req$ = id ? this.maintenanceService.update(id, payload) : this.maintenanceService.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/maintenance']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Failed to save maintenance request.'));
        this.saving.set(false);
      }
    });
  }
}
