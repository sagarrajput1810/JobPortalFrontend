import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';

export interface Job {
  id: number;
  title: string;
  description: string;
  companyName: string;
  location: string;
  salary: number;
  recruiterId: string;
  createdAt: string;
  isActive: boolean;
}

import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/job`;
  private readonly TIMEOUT_MS = 10000; // 10 seconds

  constructor(private http: HttpClient) { }

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  getJobsByRecruiter(recruiterId: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/recruiter/${recruiterId}`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  createJob(job: any): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  updateJob(id: number, job: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, job).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('JobService error:', error);
    return throwError(() => error);
  }
}
