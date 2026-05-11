import { Component, OnInit, signal, inject } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700" (dblclick)="toggleTheme()">
      <div class="container mx-auto px-6 py-12 space-y-12">
        <div class="text-left">
          <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">My Applications</h1>
          <p class="text-gray-500 dark:text-gray-400 font-medium mt-2 tracking-wide uppercase text-xs">Track your career progress</p>
        </div>

        @if (loading()) {
          <div class="text-center py-20 flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Loading your applications...</p>
          </div>
        } @else {
          @if (applications().length === 0) {
            <div class="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p class="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">You haven't applied to any jobs yet.</p>
              <a routerLink="/jobs" class="mt-4 inline-block text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Browse Jobs</a>
            </div>
          } @else {
            <div class="grid gap-6">
              @for (app of applications(); track app.id) {
                <div class="group bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                  <div class="space-y-1 text-center md:text-left">
                    <h2 class="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase leading-tight">{{ app.jobTitle || 'Job ID: ' + app.jobId }}</h2>
                    <div class="flex flex-wrap justify-center md:justify-start items-center gap-4 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                      <span>{{ app.companyName }}</span>
                      <span class="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                      <span>Applied on: <span class="text-gray-900 dark:text-white">{{ app.appliedDate | date:'mediumDate' }}</span></span>
                    </div>
                    <div class="pt-2 flex justify-center md:justify-start">
                      <span [class]="getStatusClass(app.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {{ app.status }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-8">
                    @if (app.atsScore) {
                      <div class="text-center md:text-right">
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Match Score</span>
                        <span class="text-3xl font-black" [class.text-green-600]="app.atsScore >= 70" [class.text-yellow-600]="app.atsScore < 70 && app.atsScore >= 40" [class.text-red-600]="app.atsScore < 40">
                          {{ app.atsScore }}%
                        </span>
                      </div>
                    }
                    <a [routerLink]="['/jobs', app.jobId]" class="bg-gray-950 dark:bg-white text-white dark:text-gray-950 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white transition-all transform active:scale-95 shadow-xl shadow-gray-950/20 dark:shadow-none">View Job</a>
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

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }
}
