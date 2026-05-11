import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700" (dblclick)="toggleTheme()">
      <div class="container mx-auto px-6 py-12 max-w-3xl space-y-12">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <a routerLink="/recruiter/jobs" class="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors border border-gray-100 dark:border-gray-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </a>
            <div>
              <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">{{ isEditMode() ? 'Edit Job' : 'Post New Job' }}</h1>
              <p class="text-gray-500 dark:text-gray-400 font-medium mt-2 tracking-wide uppercase text-xs">Define the requirements and salary</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
          <form (ngSubmit)="saveJob()" #jobForm="ngForm" class="space-y-8">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Job Title</label>
              <input type="text" [(ngModel)]="job().title" name="title" required 
                class="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-indigo-600 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white transition-all outline-none shadow-sm" 
                placeholder="e.g. Senior Backend Developer">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Company Name</label>
                <input type="text" [(ngModel)]="job().companyName" name="companyName" required 
                  class="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-indigo-600 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white transition-all outline-none shadow-sm" 
                  placeholder="e.g. Acme Corp">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                <input type="text" [(ngModel)]="job().location" name="location" required 
                  class="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-indigo-600 rounded-2xl p-4 text-sm font-bold text-gray-900 dark:text-white transition-all outline-none shadow-sm" 
                  placeholder="e.g. Remote, Mathura">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Salary (Annual ₹)</label>
              <input type="number" [(ngModel)]="job().salary" name="salary" required 
                class="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-indigo-600 rounded-2xl p-4 text-xl font-black text-indigo-600 dark:text-indigo-400 transition-all outline-none shadow-sm" 
                placeholder="e.g. 1200000">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Detailed Description</label>
              <textarea [(ngModel)]="job().description" name="description" required rows="8" 
                class="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-indigo-600 rounded-2xl p-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all outline-none shadow-sm leading-relaxed" 
                placeholder="Describe the role, requirements, and benefits..."></textarea>
            </div>

            @if (isEditMode()) {
              <div class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <input type="checkbox" [(ngModel)]="job().isActive" name="isActive" id="isActive" 
                  class="w-5 h-5 text-indigo-600 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 cursor-pointer">
                <label for="isActive" class="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest cursor-pointer">Job is currently Active</label>
              </div>
            }

            <div class="pt-6">
              <button type="submit" [disabled]="!jobForm.form.valid || saving()" 
                class="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] shadow-2xl shadow-indigo-500/30 disabled:opacity-50 transition-all transform active:scale-95 uppercase tracking-[0.2em] text-sm">
                {{ saving() ? 'Processing...' : (isEditMode() ? 'Update Opportunity' : 'Launch Opportunity') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class JobFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);

  job = signal<any>({
    title: '',
    description: '',
    companyName: '',
    location: '',
    salary: 0,
    isActive: true
  });

  isEditMode = signal(false);
  saving = signal(false);
  jobId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.jobId.set(Number(id));
      this.loadJobData(Number(id));
    }
  }

  loadJobData(id: number): void {
    this.jobService.getJobById(id).subscribe({
      next: (data) => {
        this.job.set({ ...data });
      },
      error: (err) => {
        console.error('Error loading job:', err);
        alert('Failed to load job data.');
      }
    });
  }

  saveJob(): void {
    this.saving.set(true);
    const jobData = this.job();
    
    if (this.isEditMode()) {
      this.jobService.updateJob(this.jobId()!, jobData).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/recruiter/jobs']);
        },
        error: (err) => {
          console.error('Error updating job:', err);
          this.saving.set(false);
          alert('Failed to update job.');
        }
      });
    } else {
      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/recruiter/jobs']);
        },
        error: (err) => {
          console.error('Error creating job:', err);
          this.saving.set(false);
          alert('Failed to create job.');
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
