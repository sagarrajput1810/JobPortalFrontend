import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserNotification {
  id: number;
  userEmail: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notification`;

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<UserNotification[]> {
    return this.http.get<UserNotification[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('NotificationService getNotifications failed:', error);
        return of([]);
      })
    );
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).pipe(
      catchError(error => {
        console.error('NotificationService getUnreadCount failed:', error);
        return of({ count: 0 });
      })
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {}).pipe(
      catchError(error => {
        console.error('NotificationService markAsRead failed:', error);
        return of(undefined);
      })
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all`, {}).pipe(
      catchError(error => {
        console.error('NotificationService markAllAsRead failed:', error);
        return of(undefined);
      })
    );
  }
}
