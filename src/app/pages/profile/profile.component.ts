import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, CandidateProfile, RecruiterProfile } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any;
  loading = signal(true);
  saving = signal(false);
  isNewProfile = false;

  // Form Models
  candidateModel: CandidateProfile = {
    userId: '',
    fullName: '',
    phoneNumber: '',
    skills: []
  };

  recruiterModel: RecruiterProfile = {
    userId: '',
    companyName: ''
  };

  newSkill = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    if (this.user.role === 'Candidate') {
      this.profileService.getCandidateProfile(this.user.id).subscribe({
        next: (profile) => {
          this.candidateModel = profile;
          this.loading.set(false);
        },
        error: (err) => {
          if (err.status === 404) {
            this.isNewProfile = true;
            this.candidateModel.userId = this.user.id;
            this.candidateModel.fullName = this.user.name || '';
          }
          this.loading.set(false);
        }
      });
    } else {
      this.profileService.getRecruiterProfile(this.user.id).subscribe({
        next: (profile) => {
          this.recruiterModel = profile;
          this.loading.set(false);
        },
        error: (err) => {
          if (err.status === 404) {
            this.isNewProfile = true;
            this.recruiterModel.userId = this.user.id;
          }
          this.loading.set(false);
        }
      });
    }
  }

  saveProfile() {
    this.saving.set(true);
    if (this.user.role === 'Candidate') {
      if (this.isNewProfile) {
        this.profileService.createCandidateProfile(this.candidateModel).subscribe({
          next: (profile) => {
            this.candidateModel = profile;
            this.isNewProfile = false;
            this.saving.set(false);
            alert('Profile created successfully!');
          },
          error: () => this.saving.set(false)
        });
      } else {
        this.profileService.updateCandidateProfile(this.candidateModel.id!, this.candidateModel).subscribe({
          next: () => {
            this.saving.set(false);
            alert('Profile updated successfully!');
          },
          error: () => this.saving.set(false)
        });
      }
    } else {
      if (this.isNewProfile) {
        this.profileService.createRecruiterProfile(this.recruiterModel).subscribe({
          next: (profile) => {
            this.recruiterModel = profile;
            this.isNewProfile = false;
            this.saving.set(false);
            alert('Profile created successfully!');
          },
          error: () => this.saving.set(false)
        });
      } else {
        this.profileService.updateRecruiterProfile(this.recruiterModel.id!, this.recruiterModel).subscribe({
          next: () => {
            this.saving.set(false);
            alert('Profile updated successfully!');
          },
          error: () => this.saving.set(false)
        });
      }
    }
  }

  addSkill() {
    if (this.newSkill.trim()) {
      if (!this.candidateModel.skills) this.candidateModel.skills = [];
      this.candidateModel.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(index: number) {
    this.candidateModel.skills.splice(index, 1);
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }
}
