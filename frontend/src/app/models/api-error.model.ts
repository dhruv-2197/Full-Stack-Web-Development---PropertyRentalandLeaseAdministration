import { HttpErrorResponse } from '@angular/common/http';

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

export function extractApiError(err: unknown, fallback = 'Request failed. Please try again.'): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'Cannot connect to the Spring Boot server at http://localhost:8080. Please check that the backend is running.';
    }
    const body = err.error as ApiErrorBody | string | null;
    if (body && typeof body === 'object') {
      if (body.fieldErrors && Object.keys(body.fieldErrors).length > 0) {
        const details = Object.entries(body.fieldErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join('; ');
        return body.message ? `${body.message} (${details})` : details;
      }
      if (body.message) {
        return body.message;
      }
      if (body.error) {
        return `${body.error} (HTTP ${err.status})`;
      }
    }
    if (typeof body === 'string' && body.trim().length > 0) {
      return body;
    }
    return `Server returned HTTP ${err.status} (${err.statusText || 'Error'}).`;
  }
  return fallback;
}
