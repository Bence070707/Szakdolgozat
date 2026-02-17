import { Component, effect, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportType } from '../../../../types/ReportType';
import { ReportsService } from '../../../core/services/reports-service';
import { CommonModule } from '@angular/common';
import { ReportTypePipe } from '../../../core/pipes/report-type-pipe';

@Component({
  selector: 'app-detailed-report',
  imports: [CommonModule, ReportTypePipe],
  templateUrl: './detailed-report.html',
  styleUrl: './detailed-report.css',
})
export class DetailedReport implements OnInit {
  protected value = signal<Date>(new Date());
  protected to = signal<Date>(new Date());
  protected reportsService = inject(ReportsService);
  private route = inject(ActivatedRoute)
  type = signal<ReportType>('daily');
  today = new Date().toISOString().split('T')[0];

  constructor() {
    effect(() => {
      if(this.type() !== 'fromto'){

        this.reportsService.loadReport(this.type(), this.value());
      }
      else{
        this.reportsService.loadReportFromTo(this.type(), this.value(), this.to());
      }
    });
  }

  valueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(new Date(input.value));
    if(this.type() === 'fromto'){
      this.reportsService.loadReportFromTo(this.type(), this.value(), this.to());
    }
    else{
      this.reportsService.loadReport(this.type(), this.value());
    }
  }

  toChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.to.set(new Date(input.value));
    if(this.type() === 'fromto'){
      this.reportsService.loadReportFromTo(this.type(), this.value(), this.to());
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get("reportType");

      if (type === 'daily' || type === 'weekly' || type === 'monthly' || type === 'yearly' || type === 'fromto') {
        this.type.set(type);
        this.reportsService.reportType.set(type);

      } else {
        this.reportsService.loadReport('daily', new Date());
      }
    });
  }

  nextPeriod() {
    const current = this.value();

    switch (this.type()) {
      case 'daily':
        this.value.set(new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1));
        break;
      case 'weekly':
        this.value.set(new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7));
        break;
      case 'monthly':
        this.value.set(new Date(current.getFullYear(), current.getMonth() + 1, current.getDate()));
        break;
      case 'yearly':
        this.value.set(new Date(current.getFullYear() + 1, current.getMonth(), current.getDate()));
        break;
    }
  }


  previousPeriod() {
    const currentValue = this.value();
    switch (this.type()) {
      case 'daily':
        this.value.set(new Date(currentValue.getFullYear(), currentValue.getMonth(), currentValue.getDate() - 1));
        break;
      case 'weekly':
        this.value.set(new Date(currentValue.getFullYear(), currentValue.getMonth(), currentValue.getDate() - 7));
        break;
      case 'monthly':
        this.value.set(new Date(currentValue.getFullYear(), currentValue.getMonth() - 1, currentValue.getDate()));
        break;
      case 'yearly':
        this.value.set(new Date(currentValue.getFullYear() - 1, currentValue.getMonth(), currentValue.getDate()));
        break;
    }
    this.reportsService.loadReport(this.type(), this.value());
  }
}
