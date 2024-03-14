import { Component } from '@angular/core';
import { Listing } from 'src/app/common/listing';

@Component({
  selector: 'app-dashboard-listings',
  templateUrl: './dashboard-listings.component.html',
  styleUrls: ['./dashboard-listings.component.css']
})
export class DashboardListingsComponent {
  currentListing!: Listing;
  setCurrentListing(event: any) {
    this.currentListing = event;
  }
}
