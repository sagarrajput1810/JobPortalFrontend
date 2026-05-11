import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CandidateProfile {
  id?: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  bio?: string;
  profilePictureUrl?: string;
  resumeUrl?: string;
  skills: string[];
}

export interface RecruiterProfile {
  id?: string;
  userId: string;
  companyName: string;
  profilePictureUrl?: string;
  companyWebsite?: string;
  industry?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private candidateUrl = `${environment.apiUrl}/candidate`;
  private recruiterUrl = `${environment.apiUrl}/recruiter`;

  constructor(private http: HttpClient) { }

  // Candidate Profile Methods
  getCandidateProfile(userId: string): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.candidateUrl}/user/${userId}`);
  }

  createCandidateProfile(profile: CandidateProfile): Observable<CandidateProfile> {
    return this.http.post<CandidateProfile>(this.candidateUrl, profile);
  }

  updateCandidateProfile(id: string, profile: CandidateProfile): Observable<void> {
    return this.http.put<void>(`${this.candidateUrl}/${id}`, profile);
  }

  // Recruiter Profile Methods
  getRecruiterProfile(userId: string): Observable<RecruiterProfile> {
    return this.http.get<RecruiterProfile>(`${this.recruiterUrl}/user/${userId}`);
  }

  createRecruiterProfile(profile: RecruiterProfile): Observable<RecruiterProfile> {
    return this.http.post<RecruiterProfile>(this.recruiterUrl, profile);
  }

  updateRecruiterProfile(id: string, profile: RecruiterProfile): Observable<void> {
    return this.http.put<void>(`${this.recruiterUrl}/${id}`, profile);
  }
}
