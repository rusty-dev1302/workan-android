import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.css']
})
export class BrowseListingsComponent implements OnInit{

  listings: Listing[] = [];
  searchMode: boolean = false;
  currentSubcategory: string = "";
  currentLocation: string = "";
  searchKeyword: string = "";


  constructor(private listingService: ListingService,
              private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.handleProductsRouting();
    });
  }

  handleProductsRouting() {
    const hasSubcategory: boolean = this.route.snapshot.paramMap.has('subcategory');
    const hasLocation: boolean = this.route.snapshot.paramMap.has('location');
    
    this.listings = [];

    if(hasSubcategory) {
      this.currentSubcategory = this.route.snapshot.paramMap.get('subcategory')!;
    }

    if(hasLocation) {
      this.currentLocation = this.route.snapshot.paramMap.get('location')!;
    }

    this.handleListProducts();
  }

  handleListProducts() {
    this.listingService.getListingsByFilters(this.currentSubcategory, this.currentLocation).subscribe(
      data => {
        if(data) {
          this.listings = data;
        }
      }
    );
  }
}
