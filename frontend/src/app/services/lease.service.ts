import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lease, LeasePayload } from '../models/lease.model';

@Injectable({ providedIn: 'root' })
export class LeaseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/leases`;

  getAll(unitId?: number, tenantId?: number): Observable<Lease[]> {
    let params = new HttpParams();
    if (unitId) {
      params = params.set('unitId', unitId);
    }
    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }
    return this.http.get<Lease[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Lease> {
    return this.http.get<Lease>(`${this.baseUrl}/${id}`);
  }

  create(payload: LeasePayload): Observable<Lease> {
    return this.http.post<Lease>(this.baseUrl, payload);
  }

  update(id: number, payload: LeasePayload): Observable<Lease> {
    return this.http.put<Lease>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
