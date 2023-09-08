import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-browse-listings-filter',
  templateUrl: './browse-listings-filter.component.html',
  styleUrls: ['./browse-listings-filter.component.css']
})
export class BrowseListingsFilterComponent implements OnInit {

  locations: string[] = [];
  subcategories: string[] = [];

  currentSubcategory: string = "";
  currentLocation: string = "";

  constructor(
    private listingService: ListingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getListingLocations();
    this.getListingSubcategories();
  }


  getListingLocations() {
    this.listingService.getListingLocations().subscribe(
      data => {
        this.locations = data;
      }
    )
  }

  getListingSubcategories() {
    this.listingService.getListingSubcategories().subscribe(
      data => {
        this.subcategories = data;
      }
    )
  }

}
