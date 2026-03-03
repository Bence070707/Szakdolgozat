import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportType } from '../../../../types/ReportType';
import { ReportsService } from '../../../core/services/reports-service';
import { CommonModule } from '@angular/common';
import { ReportTypePipe } from '../../../core/pipes/report-type-pipe';
import { AdminService } from '../../../core/services/admin-service';
import { ManagedUser } from '../../../../types/User';

@Component({
  selector: 'app-detailed-report',
  imports: [CommonModule, ReportTypePipe],
  templateUrl: './detailed-report.html',
  styleUrl: './detailed-report.css',
})
export class DetailedReport implements OnInit {
  protected value = signal<Date>(new Date());
  protected to = signal<Date>(new Date());
  protected users = signal<ManagedUser[]>([]);
  protected selectedUserId = signal<string>('');
  protected reportsService = inject(ReportsService);
  protected adminService = inject(AdminService);
  private route = inject(ActivatedRoute)
  type = signal<ReportType>('daily');
  today = new Date().toISOString().split('T')[0];

  constructor() {
    effect(() => {
      if(this.type() === 'fromto'){
        this.reportsService.loadReportFromTo(this.type(), this.value(), this.to());
        return;
      }

      if (this.type() === 'user') {
        const userId = this.selectedUserId();

        if (!userId) {
          this.reportsService.report.set(null);
          return;
        }

        this.reportsService.loadMonthlyUserReport(this.value(), userId);
        return;
      }

        this.reportsService.loadReport(this.type(), this.value());
    });
  }

  valueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const parsedValue = this.type() === 'user' && input.value.length === 7
      ? new Date(`${input.value}-01`)
      : new Date(input.value);

    this.value.set(parsedValue);
    if(this.type() === 'fromto'){
      this.reportsService.loadReportFromTo(this.type(), this.value(), this.to());
    }
    else if(this.type() === 'user'){
      if (this.selectedUserId()) {
        this.reportsService.loadMonthlyUserReport(this.value(), this.selectedUserId());
      }
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

  userChange(event: Event) {
    const input = event.target as HTMLSelectElement;
    this.selectedUserId.set(input.value);

    if (this.type() === 'user' && input.value) {
      this.reportsService.loadMonthlyUserReport(this.value(), input.value);
    }
  }

  loadUsers() {
    this.adminService.getUserRoles(false).subscribe({
      next: response => {
        this.users.set(response);

        if (!this.selectedUserId() && response.length > 0) {
          this.selectedUserId.set(response[0].id);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    this.route.paramMap.subscribe(params => {
      const type = params.get("reportType");

      if (type === 'daily' || type === 'weekly' || type === 'monthly' || type === 'yearly' || type === 'fromto' || type === 'user') {
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
      case 'user':
        this.value.set(new Date(current.getFullYear(), current.getMonth() + 1, current.getDate()));
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
      case 'user':
        this.value.set(new Date(currentValue.getFullYear(), currentValue.getMonth() - 1, currentValue.getDate()));
        break;
    }
  }
}
