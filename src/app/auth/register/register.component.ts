import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  userData = {
    email: '',
    password: '',
    fullName: '',
    role: 'Candidate'
  };
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }

  onRegister() {
    const payload = {
      email: this.userData.email,
      password: this.userData.password,
      fullName: this.userData.fullName
    };

    const register$ = this.userData.role === 'Candidate' 
      ? this.authService.registerCandidate(payload) 
      : this.authService.registerRecruiter(payload);

    register$.subscribe({
      next: (res) => {
        this.successMessage.set(res || 'Account created! OTP has been sent to your email. Redirecting...');
        setTimeout(() => this.router.navigate(['/verify-email'], { queryParams: { email: this.userData.email } }), 2000);
      },
      error: (err) => {
        let errorMsg = 'Registration failed. Try again.';

        // Extract the error message string from various response shapes
        let rawMsg = '';
        if (typeof err.error === 'string') {
          rawMsg = err.error;
        } else if (err.error && (err.error.detail || err.error.message)) {
          rawMsg = err.error.detail || err.error.message;
        }

        // If the backend resent an OTP for an unverified account, treat it as a
        // soft-success and redirect to the OTP verification page.
        if (rawMsg.toLowerCase().includes('not verified') || rawMsg.toLowerCase().includes('otp has been sent')) {
          this.successMessage.set('A new OTP has been sent to your email. Redirecting...');
          setTimeout(() => this.router.navigate(['/verify-email'], { queryParams: { email: this.userData.email } }), 2000);
          return;
        }

        if (err.status === 0) {
          errorMsg = 'Could not connect to the backend server. Please ensure it is running.';
        } else if (rawMsg) {
          if (rawMsg.includes('<!DOCTYPE html>')) {
            errorMsg = 'Backend configuration error (HTML response received).';
          } else {
            errorMsg = rawMsg;
          }
        }

        this.errorMessage.set(errorMsg);
        console.error('Registration error details:', err);
      }
    });
  }
}
