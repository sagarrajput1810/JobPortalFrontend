import { Component, OnInit, signal, inject } from '@angular/core';
import { Job, JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DecimalPipe],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Manage Jobs</h1>
        <a routerLink="/recruiter/jobs/new" class="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">+ Post New Job</a>
      </div>

      @if (loading()) {
        <div class="text-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">Loading your jobs...</p>
        </div>
      } @else {
        @if (jobs().length === 0) {
          <div class="bg-white p-10 rounded shadow text-center text-gray-500">
            You haven't posted any jobs yet.
          </div>
        } @else {
          <div class="grid gap-6">
            @for (job of jobs(); track job.id) {
              <div class="bg-white p-6 rounded-lg shadow border border-gray-100 flex justify-between items-center">
                <div>
                  <h2 class="text-xl font-bold text-gray-800">{{ job.title }}</h2>
                  <p class="text-gray-500 text-sm">Location: {{ job.location }} | Salary: ₹{{ job.salary | number }}</p>
                  <p class="text-gray-400 text-xs mt-1">Posted on: {{ job.createdAt | date }}</p>
                </div>
                <div class="flex space-x-3">
                  <a [routerLink]="['/recruiter/jobs', job.id, 'applicants']" class="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition">View Applicants</a>
                  <a [routerLink]="['/recruiter/jobs/edit', job.id]" class="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm font-medium hover:bg-blue-200 transition">Edit</a>
                  <button (click)="deleteJob(job.id)" class="bg-red-50 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-100 transition">Delete</button>
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
export class RecruiterDashboardComponent implements OnInit {
  private jobService = inject(JobService);
  private authService = inject(AuthService);

  jobs = signal<Job[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.id) {
      this.loading.set(true);
      this.jobService.getJobsByRecruiter(user.id).subscribe({
        next: (data) => {
          console.log('RecruiterDashboard New: Jobs received', data);
          this.jobs.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('RecruiterDashboard New: Error', err);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.jobs.set(this.jobs().filter(j => j.id !== id));
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          alert('Failed to delete job.');
        }
      });
    }
  }
}
