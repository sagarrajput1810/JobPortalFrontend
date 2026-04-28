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

  onRegister() {
    const register$ = this.userData.role === 'Candidate' 
      ? this.authService.registerCandidate(this.userData) 
      : this.authService.registerRecruiter(this.userData);

    register$.subscribe({
      next: (res) => {
        this.successMessage.set('Registration successful! Please login.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage.set('Registration failed. Try again.');
        console.error(err);
      }
    });
  }
}
