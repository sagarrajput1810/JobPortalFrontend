import { Component, OnInit, signal, inject } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">My Applications</h1>

      @if (loading()) {
        <div class="text-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      } @else {
        @if (applications().length === 0) {
          <div class="bg-white p-10 rounded shadow text-center text-gray-500 border border-gray-100">
            <p class="text-lg">You haven't applied to any jobs yet.</p>
            <a routerLink="/jobs" class="text-blue-600 hover:underline mt-2 inline-block">Browse Jobs</a>
          </div>
        } @else {
          <div class="grid gap-4">
            @for (app of applications(); track app.id) {
              <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                <div>
                  <h2 class="text-xl font-bold text-gray-800">Job ID: {{ app.jobId }}</h2>
                  <p class="text-sm text-gray-500">Applied on: {{ app.appliedDate | date }}</p>
                  <div class="mt-2">
                    <span [class]="getStatusClass(app.status)" class="px-2 py-1 rounded-full text-xs font-bold uppercase">
                      {{ app.status }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  @if (app.atsScore) {
                    <div class="text-sm font-medium text-gray-500 mb-1">ATS Score</div>
                    <div class="text-2xl font-bold" [class.text-green-600]="app.atsScore >= 70" [class.text-yellow-600]="app.atsScore < 70 && app.atsScore >= 40" [class.text-red-600]="app.atsScore < 40">
                      {{ app.atsScore }}%
                    </div>
                  }
                  <a [routerLink]="['/jobs', app.jobId]" class="text-blue-600 hover:underline text-sm block mt-2">View Job</a>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: []
})
export class CandidateDashboardComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  
  applications = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading.set(true);
    this.applicationService.getMyApplications().subscribe({
      next: (data) => {
        console.log('CandidateDashboard: Data received', data);
        this.applications.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('CandidateDashboard: Error', err);
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Shortlisted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Reviewing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
