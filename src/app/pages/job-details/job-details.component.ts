import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Job, JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700" (dblclick)="toggleTheme()">
      <div class="container mx-auto px-6 py-12 max-w-5xl">
        @if (loading()) {
          <div class="text-center py-20 flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Loading job details...</p>
          </div>
        } @else if (job()) {
          @let jobData = job()!;
          <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <!-- Header Card -->
            <div class="bg-indigo-600 dark:bg-indigo-900/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              
              <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div class="space-y-2">
                  <span class="text-xs font-black uppercase tracking-[0.2em] text-indigo-100 opacity-80">Opportunity</span>
                  <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight">{{ jobData.title }}</h1>
                  <p class="text-xl font-bold text-indigo-100">{{ jobData.companyName }}</p>
                </div>
                <div class="bg-white/10 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/20 text-center">
                  <span class="text-xs font-black uppercase tracking-widest opacity-80 block mb-1">Annual Salary</span>
                  <p class="text-3xl font-black">₹{{ jobData.salary | number }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Main Content -->
              <div class="lg:col-span-2 space-y-8">
                <div class="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                  <h2 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center">
                    <span class="w-8 h-1 bg-indigo-600 mr-4 rounded-full"></span>
                    Job Description
                  </h2>
                  <div class="text-gray-600 dark:text-gray-400 leading-relaxed font-medium whitespace-pre-wrap">
                    {{ jobData.description }}
                  </div>
                </div>
              </div>

              <!-- Sidebar Info -->
              <div class="space-y-6">
                <div class="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6">
                  <div class="space-y-4">
                    <div class="flex items-center text-gray-700 dark:text-gray-300">
                      <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mr-4">
                        <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                      </div>
                      <div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</span>
                        <p class="font-bold">{{ jobData.location }}</p>
                      </div>
                    </div>
                    <div class="flex items-center text-gray-700 dark:text-gray-300">
                      <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mr-4">
                        <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Posted Date</span>
                        <p class="font-bold">{{ jobData.createdAt | date }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Apply Section -->
                  @if (authService.currentUser$ | async; as user) {
                    @if (user.role === 'Candidate') {
                      <div class="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
                        @if (!applied()) {
                          <div class="space-y-4">
                            <div class="space-y-2">
                              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cover Letter</label>
                              <textarea [(ngModel)]="application.coverLetter" rows="4" 
                                class="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-indigo-600 rounded-2xl p-4 text-sm font-medium transition-all outline-none" 
                                placeholder="Why you are a good fit?"></textarea>
                            </div>
                            <div class="space-y-2">
                              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Resume (PDF)</label>
                              <input type="file" (change)="onFileSelected($event)" accept=".pdf" 
                                class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 hover:file:bg-indigo-100">
                            </div>
                            <button (click)="apply()" [disabled]="applying() || !selectedFile" 
                              class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-widest text-xs">
                              {{ applying() ? 'Sending...' : 'Apply Now' }}
                            </button>
                          </div>
                        } @else {
                          <div class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-center space-y-2">
                            <div class="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <p class="text-indigo-900 dark:text-indigo-300 font-black uppercase tracking-widest text-xs">Success!</p>
                            <p class="text-indigo-600 dark:text-indigo-400 text-xs font-bold">You have applied for this job.</p>
                          </div>
                        }
                      </div>
                    }
                  } @else {
                    <div class="pt-6 border-t border-gray-100 dark:border-gray-800">
                      <a routerLink="/login" class="block w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center font-black rounded-2xl uppercase tracking-widest text-xs transition-all active:scale-95">Login to Apply</a>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class JobDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  public authService = inject(AuthService);

  job = signal<Job | null>(null);
  loading = signal(true);
  applying = signal(false);
  applied = signal(false);
  
  selectedFile: File | null = null;
  application = {
    coverLetter: ''
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loading.set(true);
        this.jobService.getJobById(id).subscribe({
          next: (data) => {
            this.job.set(data);
            this.loading.set(false);
            this.checkIfAlreadyApplied(id);
          },
          error: (err) => {
            console.error('API Error:', err);
            this.loading.set(false);
            this.job.set(null);
          }
        });
      }
    });
  }

  checkIfAlreadyApplied(jobId: number): void {
    if (this.authService.isLoggedIn() && this.authService.hasRole('Candidate')) {
      this.applicationService.getMyApplications().subscribe({
        next: (apps) => {
          if (apps.some(a => a.jobId === jobId)) {
            this.applied.set(true);
          }
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  apply(): void {
    const jobData = this.job();
    if (!jobData || !this.selectedFile) {
      alert('Please select a resume file.');
      return;
    }
    
    this.applying.set(true);
    
    // Create FormData instead of JSON
    const formData = new FormData();
    formData.append('jobId', jobData.id.toString());
    formData.append('jobTitle', jobData.title);
    formData.append('companyName', jobData.companyName);
    formData.append('coverLetter', this.application.coverLetter);
    formData.append('resume', this.selectedFile);

    this.applicationService.apply(formData).subscribe({
      next: () => {
        this.applying.set(false);
        this.applied.set(true);
      },
      error: (err) => {
        const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.detail || err.error?.message || 'Failed to submit application.');
        alert(errorMsg);
        this.applying.set(false);
        if (errorMsg.includes('already applied')) {
          this.applied.set(true);
        }
      }
    });
  }

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }
}
