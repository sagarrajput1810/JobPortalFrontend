import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        const user = this.authService.currentUserValue;
        if (user && user.role === 'Recruiter') {
          this.router.navigate(['/recruiter/jobs']);
        } else {
          this.router.navigate(['/jobs']);
        }
      },
      error: (err) => {
        this.errorMessage.set('Invalid email or password');
        console.error(err);
      }
    });
  }
}
