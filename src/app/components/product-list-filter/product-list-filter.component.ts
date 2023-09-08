import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-list-filter.component.html',
  styleUrls: ['./product-list-filter.component.css']
})
export class ProductListFilterComponent implements OnInit {

  locations: string[] = [];
  subcategories: string[] = [];

  currentSubcategory: string = "";
  currentLocation: string = "";

  constructor(
    private productService: ListingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getListingLocations();
    this.getListingSubcategories();
  }


  getListingLocations() {
    this.productService.getListingLocations().subscribe(
      data => {
        this.locations = data;
      }
    )
  }

  getListingSubcategories() {
    this.productService.getListingSubcategories().subscribe(
      data => {
        this.subcategories = data;
      }
    )
  }

}
