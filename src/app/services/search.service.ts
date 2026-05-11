import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SearchResult {
  id: number;
  title: string;
  companyName: string;
  location: string;
  description: string;
  // Note: Search results might have fewer fields than the full Job model
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) { }

  searchJobs(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(this.apiUrl, { params: { query } });
  }
}
