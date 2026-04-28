import { Component, OnInit, signal, inject } from '@angular/core';
import { Job, JobService } from '../../services/job.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DecimalPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">Available Jobs</h1>
      
      @if (loading()) {
        <div class="text-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Finding the best jobs for you...</p>
        </div>
      } @else {
        @if (jobs().length === 0) {
          <div class="text-center py-10 text-gray-500 bg-white rounded-lg shadow border border-gray-100">
            No jobs available at the moment. Check back later!
          </div>
        } @else {
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (job of jobs(); track job.id) {
              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full">
                <div class="flex-grow">
                  <h2 class="text-xl font-bold text-blue-800 mb-1">{{ job.title }}</h2>
                  <p class="text-gray-600 font-medium mb-2">{{ job.companyName }}</p>
                  
                  <div class="flex items-center text-gray-500 text-sm mb-3">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {{ job.location }}
                  </div>
                  
                  <p class="text-green-700 font-bold text-lg mb-3">₹{{ job.salary | number }}</p>
                  
                  <p class="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4">
                    {{ job.description }}
                  </p>
                </div>
                
                <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span class="text-xs text-gray-400 font-medium">Posted: {{ job.createdAt | date }}</span>
                  <a [routerLink]="['/jobs', job.id]" class="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">View Details</a>
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
export class JobListComponent implements OnInit {
  private jobService = inject(JobService);
  
  jobs = signal<Job[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading.set(true);
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        console.log('JobList: Jobs loaded', data);
        this.jobs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('JobList: Error', err);
        this.loading.set(false);
      }
    });
  }
}
