import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/application`;

  getResumeUrl(relativeUrl: string): string {
    if (!relativeUrl) return '';
    
    // If it's already an absolute URL (e.g., from Azure Blob), return as is
    if (relativeUrl.startsWith('http')) return relativeUrl;

    // Ensure environment.apiUrl is used as the base
    const base = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const path = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;

    return `${base}${path}`;
  }

  constructor(private http: HttpClient) { }

  // Updated to accept FormData for file upload
  apply(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, formData);
  }

  getApplicationsByJob(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/job/${jobId}`).pipe(
      catchError(error => {
        console.error('ApplicationService getApplicationsByJob failed:', error);
        return of([]);
      })
    );
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-applications`).pipe(
      catchError(error => {
        console.error('ApplicationService getMyApplications failed:', error);
        return of([]);
      })
    );
  }

  updateStatus(id: number, status: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, { responseType: 'text' });
  }

  // Admin methods
  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      catchError(error => {
        console.error('ApplicationService getAllApplications failed:', error);
        return of([]);
      })
    );
  }

  deleteApplication(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
