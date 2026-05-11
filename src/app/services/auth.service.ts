import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.setUserFromToken(token);
      }
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
          this.setUserFromToken(response.token);
        }
      })
    );
  }

  registerCandidate(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/candidate`, userData, { responseType: 'text' });
  }

  registerRecruiter(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/recruiter`, userData, { responseType: 'text' });
  }

  verifyEmail(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { email, otp }, { responseType: 'text' });
  }

  loginWithGoogle(idToken: string, role?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-login`, { idToken, role }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
          this.setUserFromToken(response.token);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setUserFromToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      const user = {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub,
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      };
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
    }
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue && this.currentUserValue.role === role;
  }
}
