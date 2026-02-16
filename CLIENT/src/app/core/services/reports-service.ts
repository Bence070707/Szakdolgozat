import { inject, Injectable, signal } from '@angular/core';
import { ReportType } from '../../../types/ReportType';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Report } from '../../../types/Report';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  report = signal<Report | null>(null);
  reportType = signal<ReportType>('daily');

  loadReport(type: ReportType, from: Date){
    let params = new HttpParams();

    params = params.append('type', type);
    params = params.append('from', from.toISOString());

    return this.http.get<Report>(this.url + 'reports', { params }).subscribe({
      next: response => {
        this.report.set(response);      
      }, 
      error: err => {
        console.log(err);
        
      }
    });
  }
}
