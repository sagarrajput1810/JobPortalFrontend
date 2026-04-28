import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-xl font-bold">JobPortal</a>
        <div class="space-x-4">
          <a routerLink="/jobs" routerLinkActive="text-blue-400" class="hover:text-gray-300">Jobs</a>
          
          <ng-container *ngIf="authService.currentUser$ | async as user; else guest">
            <a *ngIf="user.role === 'Candidate'" routerLink="/candidate/applications" routerLinkActive="text-blue-400" class="hover:text-gray-300">My Applications</a>
            <a *ngIf="user.role === 'Recruiter'" routerLink="/recruiter/jobs" routerLinkActive="text-blue-400" class="hover:text-gray-300">Manage Jobs</a>
            <span class="text-gray-400">|</span>
            <span class="font-medium">{{ user.name || user.email }} ({{ user.role }})</span>
            <button (click)="logout()" class="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">Logout</button>
          </ng-container>

          <ng-template #guest>
            <a routerLink="/login" routerLinkActive="text-blue-400" class="hover:text-gray-300">Login</a>
            <a routerLink="/register" routerLinkActive="text-blue-400" class="hover:text-gray-300">Register</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
