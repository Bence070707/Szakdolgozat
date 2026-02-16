import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ReportsService } from '../../core/services/reports-service';



@Component({
  selector: 'app-reports',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports{
protected reportsService = inject(ReportsService);

}
