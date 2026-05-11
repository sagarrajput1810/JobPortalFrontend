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
    <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700" (dblclick)="toggleTheme()">
      <div class="container mx-auto px-6 py-12 space-y-12">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Management Console</h1>
            <p class="text-gray-500 dark:text-gray-400 font-medium mt-2 tracking-wide uppercase text-xs">Track and manage your live job postings</p>
          </div>
          <a routerLink="/recruiter/jobs/new" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform active:scale-95 text-xs uppercase tracking-widest">+ Create Listing</a>
        </div>

        <!-- Dashboard Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div class="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Total Postings</span>
            <p class="text-4xl font-black text-indigo-600 dark:text-indigo-400">{{ jobs().length }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Live Status</span>
            <p class="text-4xl font-black text-green-600">Active</p>
          </div>
          <div class="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-500/20 text-white">
            <span class="text-[10px] font-black uppercase tracking-widest opacity-80 block mb-2">AI Premium</span>
            <p class="text-4xl font-black italic">Gemini Pro</p>
          </div>
        </div>

        @if (loading()) {
          <div class="text-center py-20 flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Loading your jobs...</p>
          </div>
        } @else {
          @if (jobs().length === 0) {
            <div class="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p class="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">You haven't posted any jobs yet.</p>
              <a routerLink="/recruiter/jobs/new" class="mt-4 inline-block text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Get started now</a>
            </div>
          } @else {
            <div class="grid gap-6">
              @for (job of jobs(); track job.id) {
                <div class="group bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                  <div class="space-y-1 text-center md:text-left">
                    <h2 class="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ job.title }}</h2>
                    <div class="flex flex-wrap justify-center md:justify-start items-center gap-4 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                      <span>Location: <span class="text-gray-900 dark:text-white">{{ job.location }}</span></span>
                      <span class="hidden md:inline">|</span>
                      <span>Salary: <span class="text-indigo-600 dark:text-indigo-400 font-black">₹{{ job.salary | number }}</span></span>
                    </div>
                    <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest pt-2">Posted on: {{ job.createdAt | date:'mediumDate' }}</p>
                  </div>
                  
                  <div class="flex flex-wrap justify-center items-center gap-3">
                    <a [routerLink]="['/recruiter/jobs', job.id, 'applicants']" class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Applicants</a>
                    <a [routerLink]="['/recruiter/jobs/edit', job.id]" class="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Edit</a>
                    <button (click)="deleteJob(job.id)" class="bg-red-50 dark:bg-red-900/10 text-red-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Delete</button>
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>
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

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }
}
