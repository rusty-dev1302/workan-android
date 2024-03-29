import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing } from 'src/app/common/listing';
import { DashboardListingsFormComponent } from '../dashboard-listings-form/dashboard-listings-form.component';


@Component({
    selector: 'app-dashboard-listings',
    templateUrl: './dashboard-listings.component.html',
    styleUrls: ['./dashboard-listings.component.css'],
    standalone: true,
    imports: [RouterLink, DashboardListingsFormComponent, NgClass]
})
export class DashboardListingsComponent {
  currentListing!: Listing;
  menuItem:number = 0;
  setMenu(num: number) {
    this.menuItem = num;
  }
  setCurrentListing(event: any) {
    this.currentListing = event;
  }
}
