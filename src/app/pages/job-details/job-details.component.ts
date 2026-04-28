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
    <div class="max-w-4xl mx-auto">
      @if (loading()) {
        <div class="text-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading job details...</p>
        </div>
      } @else if (job()) {
        @let jobData = job()!;
        <div class="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ jobData.title }}</h1>
              <p class="text-xl text-blue-600 font-medium mt-1">{{ jobData.companyName }}</p>
            </div>
            <p class="text-2xl font-bold text-green-600">₹{{ jobData.salary | number }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded text-sm text-gray-600">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Location: <span class="font-medium ml-1 text-gray-800">{{ jobData.location }}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Posted: <span class="font-medium ml-1 text-gray-800">{{ jobData.createdAt | date }}</span>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Job Description</h2>
            <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {{ jobData.description }}
            </div>
          </div>

          @if (authService.currentUser$ | async; as user) {
            @if (user.role === 'Candidate') {
              <div class="mt-8 border-t pt-8">
                <h2 class="text-xl font-bold mb-4 text-gray-800">Apply for this Job</h2>
                @if (!applied()) {
                  <div class="space-y-4">
                    <div>
                      <label class="block text-gray-700 mb-2 font-medium">Cover Letter</label>
                      <textarea [(ngModel)]="application.coverLetter" rows="4" class="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Tell the recruiter why you are a good fit..."></textarea>
                    </div>
                    <div>
                      <label class="block text-gray-700 mb-2 font-medium">Upload Resume (PDF only)</label>
                      <input type="file" (change)="onFileSelected($event)" accept=".pdf" class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500">
                      <p class="text-xs text-gray-500 mt-1">Select your resume file to upload.</p>
                    </div>
                    <button (click)="apply()" [disabled]="applying() || !selectedFile" class="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition">
                      {{ applying() ? 'Submitting Application...' : 'Submit Application' }}
                    </button>
                  </div>
                } @else {
                  <div class="bg-green-100 text-green-800 p-4 rounded border border-green-200 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Application submitted successfully!
                  </div>
                }
              </div>
            }
          } @else {
            <div class="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
              <p class="text-blue-800 mb-4 font-medium">Please login as a Candidate to apply for this job.</p>
              <a routerLink="/login" class="inline-block bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">Login Now</a>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-10 bg-white rounded shadow text-gray-500">
          <p class="text-lg font-medium text-red-600 mb-2">Job not found</p>
          <div class="mt-4">
            <a routerLink="/jobs" class="text-blue-600 hover:underline">Back to Job List</a>
          </div>
        </div>
      }
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
    formData.append('coverLetter', this.application.coverLetter);
    formData.append('resume', this.selectedFile);

    this.applicationService.apply(formData).subscribe({
      next: () => {
        this.applying.set(false);
        this.applied.set(true);
      },
      error: (err) => {
        console.error('Error applying:', err);
        this.applying.set(false);
        alert('Failed to submit application.');
      }
    });
  }
}
