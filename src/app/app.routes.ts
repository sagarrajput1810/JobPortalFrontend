import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { JobListComponent } from './pages/job-list/job-list.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { CandidateDashboardComponent } from './pages/candidate-dashboard/candidate-dashboard.component';
import { RecruiterDashboardComponent } from './pages/recruiter-dashboard/recruiter-dashboard.component';
import { JobFormComponent } from './pages/job-form/job-form.component';
import { JobApplicantsComponent } from './pages/job-applicants/job-applicants.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailsComponent },

  // Candidate routes
  { 
    path: 'candidate/applications', 
    component: CandidateDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Candidate' }
  },

  // Recruiter routes
  { 
    path: 'recruiter/jobs', 
    component: RecruiterDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Recruiter' }
  },
  { 
    path: 'recruiter/jobs/new', 
    component: JobFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Recruiter' }
  },
  { 
    path: 'recruiter/jobs/edit/:id', 
    component: JobFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Recruiter' }
  },
  { path: 'recruiter/jobs/:id/applicants', 
    component: JobApplicantsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Recruiter' }
  },

  { path: '**', redirectTo: '' }
  ];
