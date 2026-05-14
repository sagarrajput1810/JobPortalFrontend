import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-applicants',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700" (dblclick)="toggleTheme()">
      <div class="container mx-auto px-6 py-12 space-y-12">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="flex items-center space-x-6">
            <a routerLink="/recruiter/jobs" class="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors border border-gray-100 dark:border-gray-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </a>
            <div>
              <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Job Applicants</h1>
              <p class="text-gray-500 dark:text-gray-400 font-medium mt-2 tracking-wide uppercase text-xs">Review and track candidate profiles</p>
            </div>
          </div>
        </div>

        @if (loading()) {
          <div class="text-center py-20 flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Loading applicants...</p>
          </div>
        } @else {
          @if (applicants().length === 0) {
            <div class="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p class="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">No applications received for this job yet.</p>
            </div>
          } @else {
            <div class="grid gap-6">
              @for (app of applicants(); track app.id) {
                <div class="group bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all">
                  <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <!-- Candidate Info -->
                    <div class="flex items-center space-x-6">
                      <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                        <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase">{{ app.candidateName.substring(0,1) }}</span>
                      </div>
                      <div>
                        <h2 class="text-2xl font-black text-gray-900 dark:text-white">{{ app.candidateName }}</h2>
                        <p class="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">{{ app.candidateEmail }}</p>
                        <div class="flex items-center mt-2 space-x-4">
                          <span [class]="getStatusClass(app.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {{ app.status }}
                          </span>
                          <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Applied on {{ app.appliedDate | date:'mediumDate' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- ATS & Score -->
                    <div class="flex flex-col items-center lg:items-end space-y-2 min-w-[200px]">
                      <div class="text-right">
                        @if (app.atsScore !== null && app.atsScore !== undefined) {
                          <div class="flex items-center justify-end space-x-3">
                            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Match Score</span>
                            <span class="text-3xl font-black" [class.text-green-600]="app.atsScore >= 70" [class.text-yellow-600]="app.atsScore < 70 && app.atsScore >= 40" [class.text-red-600]="app.atsScore < 40">
                              {{ app.atsScore }}%
                            </span>
                          </div>
                          @if (app.aiSummary) {
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 italic max-w-[250px] leading-relaxed text-right mt-2 font-medium">
                              "{{ app.aiSummary }}"
                            </p>
                          }
                        } @else {
                          <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600 animate-pulse">Analyzing...</span>
                        }
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center space-x-4 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50 dark:border-gray-800">
                      @if (app.resumeUrl) {
                        <a [href]="applicationService.getResumeUrl(app.resumeUrl)" target="_blank" rel="noopener noreferrer"
                          class="flex-1 lg:flex-none text-center bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                          View Resume
                        </a>
                      }
                      <select (change)="updateStatus(app.id, $any($event.target).value)" [value]="app.status" 
                        class="flex-1 lg:flex-none bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-indigo-700 transition-all appearance-none text-center">
                        <option value="Applied">Status: Applied</option>
                        <option value="Reviewing">Status: Reviewing</option>
                        <option value="Shortlisted">Status: Shortlisted</option>
                        <option value="Rejected">Status: Rejected</option>
                      </select>
                    </div>
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
export class JobApplicantsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public applicationService = inject(ApplicationService);

  applicants = signal<any[]>([]);
  loading = signal(true);
  jobId = signal<number | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.jobId.set(id);
        this.loadApplicants(id);
      }
    });
  }

  loadApplicants(id: number): void {
    this.loading.set(true);
    this.applicationService.getApplicationsByJob(id).subscribe({
      next: (data) => {
        console.log('JobApplicants New: Data', data);
        this.applicants.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('JobApplicants New: Error', err);
        this.loading.set(false);
      }
    });
  }

  updateStatus(id: number, status: string): void {
    this.applicationService.updateStatus(id, status).subscribe({
      next: () => {
        const updated = this.applicants().map(a => a.id === id ? { ...a, status } : a);
        this.applicants.set(updated);
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Failed to update status.');
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

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }
}
