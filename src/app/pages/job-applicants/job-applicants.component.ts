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
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <a routerLink="/recruiter/jobs" class="text-blue-600 hover:underline flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Jobs
        </a>
        <h1 class="text-3xl font-bold">Job Applicants</h1>
      </div>

      @if (loading()) {
        <div class="text-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading applicants...</p>
        </div>
      } @else {
        @if (applicants().length === 0) {
          <div class="bg-white p-10 rounded shadow text-center text-gray-500 border border-gray-100">
            No applications received for this job yet.
          </div>
        } @else {
          <div class="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ATS Score</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resume</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                @for (app of applicants(); track app.id) {
                  <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                      <div class="font-medium text-gray-900">{{ app.candidateName }}</div>
                      <div class="text-sm text-gray-500">{{ app.candidateEmail }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="getStatusClass(app.status)" class="px-2 py-1 rounded-full text-xs font-bold uppercase">
                        {{ app.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      {{ app.appliedDate | date:'mediumDate' }}
                    </td>
                    <td class="px-6 py-4">
                      @if (app.atsScore !== null && app.atsScore !== undefined) {
                        <span class="font-bold" [class.text-green-600]="app.atsScore >= 70" [class.text-yellow-600]="app.atsScore < 70 && app.atsScore >= 40" [class.text-red-600]="app.atsScore < 40">
                          {{ app.atsScore }}%
                        </span>
                      } @else {
                        <span class="text-gray-400 italic text-xs">Processing...</span>
                      }
                    </td>
                    <td class="px-6 py-4">
                      @if (app.resumeUrl) {
                        <a [href]="app.resumeUrl" target="_blank" class="text-blue-600 hover:underline text-sm font-medium flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          View Resume
                        </a>
                      }
                    </td>
                    <td class="px-6 py-4 text-right">
                      <select (change)="updateStatus(app.id, $any($event.target).value)" [value]="app.status" class="text-sm border rounded p-1 focus:ring-2 focus:ring-blue-500">
                        <option value="Applied">Applied</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </div>
  `,
  styles: []
})
export class JobApplicantsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private applicationService = inject(ApplicationService);

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
}
