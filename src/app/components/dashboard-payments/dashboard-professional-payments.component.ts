import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-dashboard-payments',
  templateUrl: './dashboard-payments.component.html',
  styleUrls: ['./dashboard-payments.component.css']
})
export class DashboardPaymentsComponent implements OnInit {

  constructor(
    private navigationService: NavigationService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

}
