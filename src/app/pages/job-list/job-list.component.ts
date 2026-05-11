import { Component, OnInit, signal, inject } from '@angular/core';
import { Job, JobService } from '../../services/job.service';
import { SearchService } from '../../services/search.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DecimalPipe, FormsModule],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-700" (dblclick)="toggleTheme()">
      <div class="container mx-auto px-6 py-12 space-y-12">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div class="text-left">
            <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Available Jobs</h1>
            <p class="text-gray-500 dark:text-gray-400 font-medium mt-2 tracking-wide uppercase text-xs">Find your next career move</p>
          </div>

          <!-- Search Bar -->
          <div class="w-full md:w-auto flex-1 max-w-2xl">
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()"
                placeholder="Search by title, skills, or location..." 
                class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-[2rem] pl-14 pr-32 py-5 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all shadow-lg shadow-gray-200/20 dark:shadow-none">
              <button (click)="onSearch()" 
                class="absolute right-3 top-2 bottom-2 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20">
                Search
              </button>
            </div>
          </div>
        </div>
        
        @if (loading()) {
          <div class="text-center py-20 flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Finding the best jobs for you...</p>
          </div>
        } @else {
          <div class="flex justify-between items-center">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Showing {{ jobs().length }} results {{ searchQuery ? 'for "' + searchQuery + '"' : '' }}
            </p>
            @if (searchQuery) {
              <button (click)="clearSearch()" class="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Clear Search</button>
            }
          </div>

          @if (jobs().length === 0) {
            <div class="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p class="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">No jobs match your search. Try something else!</p>
            </div>
          } @else {
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              @for (job of jobs(); track job.id) {
                <div class="group bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all flex flex-col h-full transform hover:-translate-y-2">
                  <div class="flex-grow space-y-4">
                    <div class="flex justify-between items-start">
                      <div class="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-50 dark:border-indigo-900/30">
                        <img [src]="'https://xsgames.co/randomusers/assets/avatars/pixel/' + (job.id % 50) + '.jpg'" class="w-full h-full object-cover" alt="Company Logo">
                      </div>
                      <span class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800">Verified</span>
                    </div>

                    <div class="space-y-1">
                      <h2 class="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{{ job.title }}</h2>
                      <div class="flex items-center space-x-2">
                        <span class="text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-[10px]">{{ job.companyName }}</span>
                      </div>
                    </div>
                    
                    <div class="flex items-center text-gray-400 dark:text-gray-500 text-[11px] font-bold uppercase tracking-[0.1em]">
                      <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                      {{ job.location }}
                    </div>
                    
                    @if (job.salary) {
                      <div class="py-2">
                        <p class="text-3xl font-black text-indigo-600 dark:text-indigo-400">₹{{ job.salary | number }} <span class="text-[10px] text-gray-400 uppercase font-black tracking-tighter">/ year</span></p>
                      </div>
                    }
                    
                    <p class="text-gray-500 dark:text-gray-400 line-clamp-2 text-xs leading-relaxed font-medium">
                      {{ job.description }}
                    </p>
                  </div>
                  
                  <div class="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <div class="flex flex-col">
                      <span class="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Added</span>
                      <span class="text-xs text-gray-600 dark:text-gray-400 font-bold">{{ (job.createdAt | date:'mediumDate') || 'Recently' }}</span>
                    </div>
                    <a [routerLink]="['/jobs', job.id]" class="bg-indigo-600 dark:bg-white text-white dark:text-indigo-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-indigo-50 transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20">Details</a>
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
export class JobListComponent implements OnInit {
  private jobService = inject(JobService);
  private searchService = inject(SearchService);
  
  jobs = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading.set(true);
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        this.jobs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('JobList: Error', err);
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadJobs();
      return;
    }

    this.loading.set(true);
    this.searchService.searchJobs(this.searchQuery).subscribe({
      next: (data) => {
        this.jobs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.loading.set(false);
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadJobs();
  }

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }
}

