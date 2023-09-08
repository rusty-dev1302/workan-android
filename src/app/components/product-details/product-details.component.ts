import { Component, OnInit } from '@angular/core';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  product!: Listing;
  currentProductId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";

  constructor(
    private productService: ListingService,
    private route: ActivatedRoute,
    private navigation: NavigationService
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductsRouting();
    });
  }

  handleProductsRouting() {
    if(this.route.snapshot.paramMap.has("id")) {
      this.currentProductId = +this.route.snapshot.paramMap.get("id")!;
      this.loadListingDetails();
    }
  }

  loadListingDetails() {
    const subscription = this.productService.getListingById(this.currentProductId).subscribe(
      (listing) => {
        if(listing.state!=constants.ERROR_STATE){
          this.product = listing;
        }
        
      }
    );
  }

  getListingById() {

  }

  getProfessionalById() {

  }


  setSlotDay(slotDay: string) {
    this.currentSlotDay = slotDay;
  }

  setSlotTime(slotTime: string) {
    this.currentSlotTime = slotTime;
  }

  navigateBack(): void {
    this.navigation.back()
  }
}
