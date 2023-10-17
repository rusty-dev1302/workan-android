import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-dashboard-my-payments',
  templateUrl: './dashboard-my-payments.component.html',
  styleUrls: ['./dashboard-my-payments.component.css']
})
export class DashboardMyPaymentsComponent implements OnInit {

  constructor(
    private navigationService: NavigationService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

}
