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
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">{{ isEditMode() ? 'Edit Job' : 'Post New Job' }}</h1>
        <a routerLink="/recruiter/jobs" class="text-gray-600 hover:underline text-sm">Cancel</a>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <form (ngSubmit)="saveJob()" #jobForm="ngForm" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-1">Job Title</label>
            <input type="text" [(ngModel)]="job.title" name="title" required class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Senior Backend Developer">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-1">Company Name</label>
              <input type="text" [(ngModel)]="job.companyName" name="companyName" required class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Acme Corp">
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-1">Location</label>
              <input type="text" [(ngModel)]="job.location" name="location" required class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Remote, Mathura">
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Salary (₹ per year)</label>
            <input type="number" [(ngModel)]="job.salary" name="salary" required class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1200000">
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Job Description</label>
            <textarea [(ngModel)]="job.description" name="description" required rows="6" class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500" placeholder="Describe the role, requirements, and benefits..."></textarea>
          </div>

          @if (isEditMode()) {
            <div class="flex items-center">
              <input type="checkbox" [(ngModel)]="job.isActive" name="isActive" id="isActive" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <label for="isActive" class="ml-2 block text-sm text-gray-900 font-medium">Job is Active</label>
            </div>
          }

          <div class="pt-4">
            <button type="submit" [disabled]="!jobForm.form.valid || saving()" class="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition">
              {{ saving() ? 'Saving...' : (isEditMode() ? 'Update Job Posting' : 'Post Job Now') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class JobFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);

  job: any = {
    title: '',
    description: '',
    companyName: '',
    location: '',
    salary: 0,
    isActive: true
  };

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
        this.job = { ...data };
      },
      error: (err) => {
        console.error('Error loading job:', err);
        alert('Failed to load job data.');
      }
    });
  }

  saveJob(): void {
    this.saving.set(true);
    if (this.isEditMode()) {
      this.jobService.updateJob(this.jobId()!, this.job).subscribe({
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
      this.jobService.createJob(this.job).subscribe({
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
}
