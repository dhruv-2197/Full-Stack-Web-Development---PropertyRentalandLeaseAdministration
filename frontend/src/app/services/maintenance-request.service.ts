import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MaintenanceRequest, MaintenanceRequestPayload } from '../models/maintenance-request.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceRequestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/maintenance-requests`;

  getAll(unitId?: number, tenantId?: number): Observable<MaintenanceRequest[]> {
    let params = new HttpParams();
    if (unitId) {
      params = params.set('unitId', unitId);
    }
    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }
    return this.http.get<MaintenanceRequest[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<MaintenanceRequest> {
    return this.http.get<MaintenanceRequest>(`${this.baseUrl}/${id}`);
  }

  create(payload: MaintenanceRequestPayload): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(this.baseUrl, payload);
  }

  update(id: number, payload: MaintenanceRequestPayload): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
