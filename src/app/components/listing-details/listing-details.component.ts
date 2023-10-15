import { Component, OnInit } from '@angular/core';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { constants } from 'src/environments/constants';
import { Professional } from 'src/app/common/professional';
import { Review } from 'src/app/common/review';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent implements OnInit{

  listing!: Listing;
  professional!: Professional;
  currentListingId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";
  reviews: Review[] = [];
  totalRatings: number = 1;

  constructor(
    private listingService: ListingService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private navigation: NavigationService
    ) { }

  ngOnInit(): void {
    this.navigation.showLoader();
    this.route.paramMap.subscribe(()=>{
      this.handleListingRouting();
    });
  }

  handleListingRouting() {
    if(this.route.snapshot.paramMap.has("id")) {
      this.currentListingId = +this.route.snapshot.paramMap.get("id")!;
      this.loadListingDetails();
    }
  }

  loadListingDetails() {
    const subscription = this.listingService.getListingById(this.currentListingId).subscribe(
      (listing) => {
        if(listing.state!=constants.ERROR_STATE){
          this.listing = listing;
          const sub = this.listingService.getProfessionalById(this.listing.professionalId).subscribe(
            (professional) => {
              this.professional = professional;
              let total:number = professional.oneRating+professional.twoRating+professional.threeRating+professional.fourRating+professional.fiveRating;
              this.totalRatings = total>0?total:1;
              this.getReviewsForProfessional();
              sub.unsubscribe();
            }
          );
        }
        this.navigation.pageLoaded();
        subscription.unsubscribe();
      }
    );
  }

  getReviewsForProfessional() {
    const subscription = this.orderService.getReviewsForProfessional(this.professional.id).subscribe(
      (reviews) => {
        if(reviews.length>0 && reviews[0].state!=constants.ERROR_STATE) {
          this.reviews = reviews;
        }
        subscription.unsubscribe();
      }
    );
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
