import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing } from 'src/app/common/listing';
import { DashboardListingsFormComponent } from '../dashboard-listings-form/dashboard-listings-form.component';


@Component({
  selector: 'app-dashboard-listings',
  templateUrl: './dashboard-listings.component.html',
  styleUrls: ['./dashboard-listings.component.css'],
  standalone: true,
  imports: [RouterLink, DashboardListingsFormComponent, NgClass, NgIf]
})
export class DashboardListingsComponent {
  currentListing!: Listing;
  menuItem: number = 0;

  portfolioComplete: boolean = false;
  documentsComplete: boolean = false;
  scheduleComplete: boolean = false;

  setMenu(num: number) {
    this.menuItem = num;
  }
  setCurrentListing(event: any) {
    this.currentListing = event;
  }
  setPortfolioComplete(event: any) {
    this.portfolioComplete = event;
  }
  setDocumentsComplete(event: any) {
    this.documentsComplete = event;
  }
  setScheduleComplete(event: any) {
    this.scheduleComplete = event;
  }
}
