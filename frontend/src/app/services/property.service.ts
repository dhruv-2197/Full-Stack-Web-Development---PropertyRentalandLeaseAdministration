import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Property, PropertyPayload } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/properties`;

  getAll(search?: string): Observable<Property[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Property[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  create(payload: PropertyPayload): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, payload);
  }

  update(id: number, payload: PropertyPayload): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
