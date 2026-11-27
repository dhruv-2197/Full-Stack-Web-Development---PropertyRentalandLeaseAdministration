import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RentalUnit, RentalUnitPayload } from '../models/rental-unit.model';

@Injectable({ providedIn: 'root' })
export class RentalUnitService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/units`;

  getAll(propertyId?: number): Observable<RentalUnit[]> {
    let params = new HttpParams();
    if (propertyId) {
      params = params.set('propertyId', propertyId);
    }
    return this.http.get<RentalUnit[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<RentalUnit> {
    return this.http.get<RentalUnit>(`${this.baseUrl}/${id}`);
  }

  create(payload: RentalUnitPayload): Observable<RentalUnit> {
    return this.http.post<RentalUnit>(this.baseUrl, payload);
  }

  update(id: number, payload: RentalUnitPayload): Observable<RentalUnit> {
    return this.http.put<RentalUnit>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
