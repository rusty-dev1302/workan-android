import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-dashboard-professional-payments',
  templateUrl: './dashboard-professional-payments.component.html',
  styleUrls: ['./dashboard-professional-payments.component.css']
})
export class DashboardProfessionalPaymentsComponent implements OnInit {

  constructor(
    private navigationService: NavigationService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

}
