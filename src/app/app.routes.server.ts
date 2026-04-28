import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'jobs/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'recruiter/jobs/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'recruiter/jobs/:id/applicants',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
