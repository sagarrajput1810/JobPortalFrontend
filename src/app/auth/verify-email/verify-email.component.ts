import { Component, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './verify-email.html'
})
export class VerifyEmailComponent implements OnInit {
  email = '';
  otp = '';
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      if (!this.email) {
        this.errorMessage.set('Email is missing. Please register again.');
      }
    });
  }

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }

  onVerify() {
    if (!this.otp) {
      this.errorMessage.set('Please enter the OTP.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.verifyEmail(this.email, this.otp).subscribe({
      next: (res) => {
        this.successMessage.set('Email verified successfully! Redirecting to login...');
        this.isLoading.set(false);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.detail || err.error?.message || 'Verification failed. Invalid OTP or expired.');
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }
}
