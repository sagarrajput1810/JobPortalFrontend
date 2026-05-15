import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  blockedUsers: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  blockUser(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/block`, {}, { responseType: 'text' });
  }

  unblockUser(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/unblock`, {}, { responseType: 'text' });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' });
  }

  changeRole(id: string, newRole: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/role`, { newRole }, { responseType: 'text' });
  }
}
