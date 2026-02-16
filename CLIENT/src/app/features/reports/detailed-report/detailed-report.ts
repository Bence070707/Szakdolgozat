import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportType } from '../../../../types/ReportType';
import { ReportsService } from '../../../core/services/reports-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detailed-report',
  imports: [CommonModule],
  templateUrl: './detailed-report.html',
  styleUrl: './detailed-report.css',
})
export class DetailedReport implements OnInit{
  protected value = new Date();
  protected reportsService = inject(ReportsService);
  private route = inject(ActivatedRoute)
  type = signal<ReportType>('daily');

  valueChange(event: Event){
    const input = event.target as HTMLInputElement;
    this.value = new Date(input.value);
    this.reportsService.loadReport(this.type(), this.value);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get("reportType");

      if (type === 'daily' || type === 'weekly' || type === 'monthly' || type === 'yearly') {
        this.type.set(type as ReportType);
        this.reportsService.loadReport(type, this.value)
        this.reportsService.reportType.set(type);
        
      } else {
        this.reportsService.loadReport('daily', new Date());
      }
    });
  }
}
