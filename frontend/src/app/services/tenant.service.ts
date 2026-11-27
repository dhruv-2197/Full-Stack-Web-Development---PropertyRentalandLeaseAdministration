import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tenant, TenantPayload } from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/tenants`;

  getAll(search?: string): Observable<Tenant[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Tenant[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.baseUrl}/${id}`);
  }

  create(payload: TenantPayload): Observable<Tenant> {
    return this.http.post<Tenant>(this.baseUrl, payload);
  }

  update(id: number, payload: TenantPayload): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
