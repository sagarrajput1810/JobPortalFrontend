import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    // Use the base API URL instead of hardcoded localhost
    return `${environment.apiUrl.replace('/gateway', '')}:5243${relativeUrl}`;
  }

  constructor(private http: HttpClient) { }

  // Updated to accept FormData for file upload
  apply(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, formData);
  }

  getApplicationsByJob(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/job/${jobId}`);
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-applications`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}
