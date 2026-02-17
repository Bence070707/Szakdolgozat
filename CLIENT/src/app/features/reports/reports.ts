import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { ReportsService } from '../../core/services/reports-service';



@Component({
  selector: 'app-reports',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports{
protected reportsService = inject(ReportsService);

}
