import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminUser, AdminStats } from '../../services/admin.service';
import { JobService, Job } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private router = inject(Router);

  stats: AdminStats | null = null;
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  applications: any[] = [];
  
  isLoading = true;
  actionMessage = '';
  actionError = '';
  
  // Tabs
  activeTab: 'overview' | 'users' | 'jobs' = 'overview';
  
  // User Filters
  searchQuery = '';
  filterRole = 'All';

  // Job Filters
  jobSearchQuery = '';

  // Expanded User View
  expandedUserId: string | null = null;
  expandedUserJobs: Job[] = [];
  expandedUserApps: any[] = [];

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    this.adminService.getStats().subscribe({
      next: (s) => (this.stats = s),
      error: () => (this.stats = null)
    });

    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
      this.applyFilter();
      
      this.jobService.getAllJobs().subscribe(jobs => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        
        this.applicationService.getAllApplications().subscribe(apps => {
          this.applications = apps;
          this.isLoading = false;
        });
      });
    });
  }

  // --- Users Tab Logic ---
  applyFilter() {
    let result = this.users;
    if (this.filterRole !== 'All') {
      result = result.filter(u => u.role === this.filterRole);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    this.filteredUsers = result;
  }

  toggleUserDetails(user: AdminUser) {
    if (this.expandedUserId === user.id) {
      this.expandedUserId = null;
      return;
    }
    this.expandedUserId = user.id;
    if (user.role === 'Recruiter') {
      this.expandedUserJobs = this.jobs.filter(j => j.recruiterId === user.id);
    } else if (user.role === 'Candidate') {
      this.expandedUserApps = this.applications.filter(a => a.candidateId === user.id);
    }
  }

  blockUser(user: AdminUser) {
    if (!confirm(`Block "${user.fullName}"? They won't be able to login.`)) return;
    this.adminService.blockUser(user.id).subscribe({
      next: () => {
        user.isEmailVerified = false;
        this.showSuccess('User blocked successfully.');
        this.loadAllData();
      },
      error: () => this.showError('Failed to block user.')
    });
  }

  unblockUser(user: AdminUser) {
    this.adminService.unblockUser(user.id).subscribe({
      next: () => {
        user.isEmailVerified = true;
        this.showSuccess('User unblocked successfully.');
        this.loadAllData();
      },
      error: () => this.showError('Failed to unblock user.')
    });
  }

  deleteUser(user: AdminUser) {
    if (!confirm(`Permanently delete "${user.fullName}"? This cannot be undone!`)) return;
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.showSuccess('User deleted successfully.');
        this.loadAllData();
      },
      error: () => this.showError('Failed to delete user.')
    });
  }

  changeRole(user: AdminUser, newRole: string) {
    if (user.role === newRole) return;
    if (!confirm(`Change "${user.fullName}"'s role to ${newRole}?`)) return;
    this.adminService.changeRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
        this.showSuccess(`Role changed to ${newRole}.`);
        this.loadAllData(); // reload to reset tabs data
      },
      error: () => this.showError('Failed to change role.')
    });
  }

  // --- Jobs Tab Logic ---
  applyJobFilter() {
    let result = this.jobs;
    if (this.jobSearchQuery.trim()) {
      const q = this.jobSearchQuery.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q)
      );
    }
    this.filteredJobs = result;
  }

  getJobPoster(recruiterId: string): string {
    const user = this.users.find(u => u.id === recruiterId);
    return user ? user.fullName : 'Unknown Recruiter';
  }

  getJobApplicantCount(jobId: number): number {
    return this.applications.filter(a => a.jobId === jobId).length;
  }

  editJob(jobId: number) {
    // Navigate to recruiter edit job path (Admin has bypass now via guard)
    this.router.navigate(['/recruiter/jobs/edit', jobId]);
  }

  viewJob(jobId: number) {
    this.router.navigate(['/jobs', jobId]);
  }

  viewApplicants(jobId: number) {
    this.router.navigate(['/recruiter/jobs', jobId, 'applicants']);
  }

  deleteJob(jobId: number) {
    if (!confirm(`Are you sure you want to delete this job? This cannot be undone.`)) return;
    this.jobService.deleteJob(jobId).subscribe({
      next: () => {
        this.showSuccess('Job deleted successfully.');
        this.loadAllData();
      },
      error: () => this.showError('Failed to delete job.')
    });
  }

  // --- Utils ---
  getJobTitle(jobId: number): string {
    const job = this.jobs.find(j => j.id === jobId);
    return job ? job.title : 'Deleted Job';
  }

  showSuccess(msg: string) {
    this.actionMessage = msg;
    this.actionError = '';
    setTimeout(() => (this.actionMessage = ''), 3000);
  }

  showError(msg: string) {
    this.actionError = msg;
    this.actionMessage = '';
    setTimeout(() => (this.actionError = ''), 3000);
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'Admin') return 'badge-admin';
    if (role === 'Recruiter') return 'badge-recruiter';
    return 'badge-candidate';
  }
}
