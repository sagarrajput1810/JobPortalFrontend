import { Component, signal, OnInit, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = signal('');

  constructor(
    private authService: AuthService, 
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      (window as any).handleGoogleLogin = (response: any) => {
        this.ngZone.run(() => {
          this.handleCredentialResponse(response);
        });
      };

      google.accounts.id.initialize({
        client_id: '464569036160-ou01hvopmpl9a0kd6ndqm3flq9s42e66.apps.googleusercontent.com',
        callback: (window as any).handleGoogleLogin,
        auto_select: false,
        context: 'signin'
      });
    }
  }

  showRoleSelection = signal(false);
  pendingIdToken = '';

  handleCredentialResponse(response: any) {
    this.pendingIdToken = response.credential;
    this.authService.loginWithGoogle(this.pendingIdToken).subscribe({
      next: (res) => {
        if (res.isNewUser) {
          this.showRoleSelection.set(true);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage.set('Google Login failed');
        console.error(err);
      }
    });
  }

  selectRole(role: string) {
    this.authService.loginWithGoogle(this.pendingIdToken, role).subscribe({
      next: (res) => {
        this.showRoleSelection.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage.set('Role selection failed');
        console.error(err);
      }
    });
  }

  onGoogleLogin() {
    google.accounts.id.prompt();
  }

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        let errorMsg = 'Invalid email or password';
        
        if (err.status === 0) {
          errorMsg = 'Could not connect to the backend server. Please ensure it is running.';
        } else if (typeof err.error === 'string') {
          if (err.error.includes('<!DOCTYPE html>')) {
            errorMsg = 'Backend configuration error (HTML response received).';
          } else {
            errorMsg = err.error;
          }
        } else if (err.error && (err.error.detail || err.error.message)) {
          errorMsg = err.error.detail || err.error.message;
        }

        if (errorMsg.includes('Email not verified')) {
          this.errorMessage.set('Email not verified. Redirecting to verification page...');
          setTimeout(() => this.router.navigate(['/verify-email'], { queryParams: { email: this.credentials.email } }), 2000);
        } else {
          this.errorMessage.set(errorMsg);
        }
        console.error('Login error details:', err);
      }
    });
  }
}
