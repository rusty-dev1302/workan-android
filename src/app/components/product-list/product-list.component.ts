import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  products: Listing[] = [];
  searchMode: boolean = false;
  currentSubcategory: string = "";
  currentLocation: string = "";
  searchKeyword: string = "";


  constructor(private productService: ListingService,
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
    
    this.products = [];

    if(hasSubcategory) {
      this.currentSubcategory = this.route.snapshot.paramMap.get('subcategory')!;
    }

    if(hasLocation) {
      this.currentLocation = this.route.snapshot.paramMap.get('location')!;
    }

    this.handleListProducts();
  }

  handleListProducts() {
    this.productService.getListingsByFilters(this.currentSubcategory, this.currentLocation).subscribe(
      data => {
        if(data) {
          this.products = data;
        }
      }
    );
  }
}
