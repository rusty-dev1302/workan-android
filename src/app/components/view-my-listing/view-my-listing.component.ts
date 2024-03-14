import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Listing } from 'src/app/common/listing';
import { Professional } from 'src/app/common/professional';
import { Review } from 'src/app/common/review';
import { ListingService } from 'src/app/services/listing.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-view-my-listing',
  templateUrl: './view-my-listing.component.html',
  styleUrls: ['./view-my-listing.component.css']
})
export class ViewMyListingComponent implements OnInit{

  listing!: Listing;
  professional!: Professional;
  currentListingId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";
  reviews: Review[] = [];
  totalRatings: number = 1;
  DISTANT_LOCATION = constants.DISTANT_LOCATION;

  timezoneOffset = new Date().getTimezoneOffset();

  constructor(
    private listingService: ListingService,
    private orderService: OrderService,
    private navigation: NavigationService,
    private keycloakService: KeycloakService
    ) { }

  ngOnInit(): void {
    this.navigation.showLoader();
    this.loadListingDetails();
  }

  loadListingDetails() {
    const subscription = this.listingService.getListingByEmail(this.keycloakService.getUsername()).subscribe(
      (listing) => {
        if(listing.state!=constants.ERROR_STATE){
          console.log(listing)
          this.listing = listing;
          const sub = this.listingService.getProfessionalById(this.listing.professional.id).subscribe(
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

  navigateBack(): void {
    this.navigation.back()
  }

}
