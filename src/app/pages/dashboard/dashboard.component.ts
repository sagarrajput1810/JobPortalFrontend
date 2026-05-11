import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-700" (dblclick)="toggleTheme()">
      <!-- Video Background Section -->
      <div class="absolute inset-0 z-0 h-[85vh]">
        <video 
          autoplay 
          muted 
          loop 
          playsinline
          class="w-full h-full object-cover opacity-80 dark:opacity-40 grayscale-[20%] dark:grayscale-[50%] transition-opacity duration-1000">
          <source src="https://static.videezy.com/system/resources/previews/000/041/113/original/Modern_Corporate_Office_Spaces.mp4" type="video/mp4">
        </video>
        <!-- Sophisticated Overlays -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white dark:via-gray-950/40 dark:to-gray-950"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-transparent"></div>
      </div>

      <!-- Hero Section -->
      <div class="relative z-10 flex flex-col pt-20 md:pt-32 pb-20 items-center text-center px-6">
        <div class="inline-flex items-center space-x-2 bg-indigo-600/10 dark:bg-indigo-400/10 px-4 py-2 rounded-full mb-8 border border-indigo-600/20 animate-in fade-in zoom-in duration-1000">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">AI-Powered Matching Live</span>
        </div>

        <h1 class="text-6xl md:text-9xl font-black text-gray-900 dark:text-white mb-8 leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700">
          SHAPE THE <br/>
          <span class="text-indigo-600 dark:text-indigo-400 drop-shadow-2xl">FUTURE.</span>
        </h1>
        
        <p class="max-w-2xl text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-400 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          Where elite talent meets world-class opportunities. Build your team or your career with AI-driven precision.
        </p>

        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full max-w-lg animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <a routerLink="/jobs" class="flex-1 py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black rounded-3xl shadow-2xl shadow-indigo-500/40 transition-all transform hover:-translate-y-2 active:scale-95 uppercase tracking-widest">
            Find Work
          </a>
          <a routerLink="/register" class="flex-1 py-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-black rounded-3xl border-2 border-gray-100 dark:border-gray-800 hover:border-indigo-600 transition-all transform hover:-translate-y-2 active:scale-95 uppercase tracking-widest shadow-xl shadow-gray-200/20 dark:shadow-none">
            Hire Talent
          </a>
        </div>
      </div>

      <!-- Features Section -->
      <section class="relative z-10 container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="group p-10 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:border-indigo-600 transition-all duration-500">
          <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4 tracking-tighter">AI Scoring</h3>
          <p class="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Our proprietary AI analyzes every resume against job descriptions to provide instant match scores.</p>
        </div>

        <div class="group p-10 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:border-indigo-600 transition-all duration-500">
          <div class="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355l-.343-.133L7 19.312m10-2.312l.343.133L12 21.355z"></path></svg>
          </div>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4 tracking-tighter">Verified</h3>
          <p class="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Security is our priority. Every candidate and company profile is verified through email and OTP.</p>
        </div>

        <div class="group p-10 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:border-indigo-600 transition-all duration-500">
          <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4 tracking-tighter">Visibility</h3>
          <p class="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Real-time dashboards for both recruiters and candidates to track every stage of the application.</p>
        </div>
      </section>

      <!-- Stats -->
      <div class="relative z-10 border-y border-gray-100 dark:border-gray-900 py-16 bg-gray-50/50 dark:bg-gray-900/30">
        <div class="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p class="text-4xl font-black text-indigo-600 dark:text-indigo-400">10k+</p>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Jobs Posted</p>
          </div>
          <div>
            <p class="text-4xl font-black text-indigo-600 dark:text-indigo-400">5k+</p>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Companies</p>
          </div>
          <div>
            <p class="text-4xl font-black text-indigo-600 dark:text-indigo-400">20k+</p>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Candidates</p>
          </div>
          <div>
            <p class="text-4xl font-black text-indigo-600 dark:text-indigo-400">95%</p>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Match Rate</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  toggleTheme() {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark');
    }
  }
}
