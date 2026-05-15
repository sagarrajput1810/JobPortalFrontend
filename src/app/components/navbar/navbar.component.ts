import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService, UserNotification } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { Subscription, interval, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-[100] w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-colors duration-700">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <a routerLink="/" class="flex items-center space-x-2 group">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
              <span class="text-white font-black text-xl">J</span>
            </div>
            <span class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">JobPortal</span>
          </a>
        </div>

        <!-- Links -->
        <div class="hidden md:flex items-center space-x-8">
          <a routerLink="/jobs" routerLinkActive="text-indigo-600 dark:text-indigo-400" [routerLinkActiveOptions]="{exact: true}" 
            class="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
            Jobs
          </a>
          
          <ng-container *ngIf="authService.currentUser$ | async as user; else guest">
            <a *ngIf="user.role === 'Candidate'" routerLink="/candidate/applications" routerLinkActive="text-indigo-600 dark:text-indigo-400"
              class="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
              Applications
            </a>
            <a *ngIf="user.role === 'Recruiter'" routerLink="/recruiter/jobs" routerLinkActive="text-indigo-600 dark:text-indigo-400"
              class="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
              My Jobs
            </a>

            <a *ngIf="user.role === 'Admin'" routerLink="/admin/dashboard" routerLinkActive="text-indigo-600 dark:text-indigo-400"
              class="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
              Admin Panel
            </a>

            <a routerLink="/profile" routerLinkActive="text-indigo-600 dark:text-indigo-400"
              class="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
              Profile
            </a>
            
            <div class="h-4 w-[1px] bg-gray-200 dark:bg-gray-800"></div>

            <!-- Notifications -->
            <div class="relative">
              <button (click)="toggleNotifications()" class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span *ngIf="unreadCount > 0" class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-white dark:border-gray-950">
                  {{ unreadCount }}
                </span>
              </button>

              <!-- Dropdown -->
              <div *ngIf="showNotifications" class="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[200]">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 class="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Notifications</h3>
                  <button (click)="markAllAsRead()" class="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-tighter">Mark all read</button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div *ngIf="notifications.length === 0" class="p-8 text-center">
                    <p class="text-xs font-bold text-gray-400 uppercase">No notifications</p>
                  </div>
                  <div *ngFor="let n of notifications" 
                    [class.bg-indigo-50]="!n.isRead"
                    [class.dark:bg-indigo-900/10]="!n.isRead"
                    class="p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    (click)="markAsRead(n)">
                    <p class="text-[10px] font-black uppercase tracking-tighter text-indigo-600 mb-1">{{ n.title }}</p>
                    <p class="text-xs font-medium text-gray-700 dark:text-gray-300 leading-snug">{{ n.message }}</p>
                    <p class="text-[9px] font-bold text-gray-400 uppercase mt-2">{{ n.createdAt | date:'shortTime' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <span class="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                {{ user.name || 'User' }}
              </span>
              <button (click)="logout()" class="text-xs font-bold text-red-600 hover:text-red-500 transition-colors uppercase tracking-widest">
                Logout
              </button>
            </div>
          </ng-container>

          <ng-template #guest>
            <a routerLink="/login" class="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
              Login
            </a>
            <a routerLink="/register" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 text-sm uppercase tracking-widest">
              Join
            </a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  notifications: UserNotification[] = [];
  unreadCount = 0;
  showNotifications = false;
  private sub?: Subscription;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.startNotificationPolling();
      } else {
        this.stopNotificationPolling();
      }
    });
  }

  ngOnDestroy() {
    this.stopNotificationPolling();
  }

  startNotificationPolling() {
    this.stopNotificationPolling();
    this.sub = interval(30000).pipe( // Poll every 30 seconds
      startWith(0),
      switchMap(() => this.notificationService.getUnreadCount())
    ).subscribe(res => {
      this.unreadCount = res.count;
    });
  }

  stopNotificationPolling() {
    this.sub?.unsubscribe();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(res => {
      this.notifications = res;
    });
  }

  markAsRead(n: UserNotification) {
    if (!n.isRead) {
      this.notificationService.markAsRead(n.id).subscribe(() => {
        n.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      });
    }
    if (n.relatedUrl) {
      this.showNotifications = false;
      this.router.navigateByUrl(n.relatedUrl);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
