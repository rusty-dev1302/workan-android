import { Component, OnInit } from '@angular/core';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { constants } from 'src/environments/constants';
import { Professional } from 'src/app/common/professional';
import { Review } from 'src/app/common/review';
import { OrderService } from 'src/app/services/order.service';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { UserService } from 'src/app/services/user.service';
import { KeycloakService } from 'keycloak-angular';
import Geohash from 'latlon-geohash';
import { VerifiedCertificatePipe } from '../../pipes/verified-cert-pipe';
import { SlotSelectorComponent } from '../slot-selector/slot-selector.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-listing-details',
    templateUrl: './listing-details.component.html',
    styleUrls: ['./listing-details.component.css'],
    standalone: true,
    imports: [NgIf, FormsModule, NgFor, SlotSelectorComponent, DecimalPipe, VerifiedCertificatePipe]
})
export class ListingDetailsComponent implements OnInit{

  listing!: Listing;
  professional!: Professional;
  currentListingId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";
  reviews: Review[] = [];
  totalRatings: number = 1;
  listingDistance: number = 0;
  DISTANT_LOCATION = constants.DISTANT_LOCATION;

  timezoneOffset = new Date().getTimezoneOffset();

  constructor(
    private listingService: ListingService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private navigation: NavigationService,
    private dialogService: ConfirmationDialogService,
    private userService: UserService,
    private keycloakService: KeycloakService
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

          const sub2 =  this.userService.getContactDetailByEmail(this.keycloakService.getUsername()).subscribe(
            (contact) => {
              if(contact.state!=constants.ERROR_STATE) {
                let userLoc = Geohash.decode(contact.geoHash);
                let listingLoc = Geohash.decode(this.listing.geoHash);

                let distance = this.distanceBetweenTwoPlace(userLoc.lat, userLoc.lon, listingLoc.lat, listingLoc.lon, "K");
                this.listingDistance = distance;
                
              }
              sub2.unsubscribe();
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

  bookError() {
    if(this.timezoneOffset!=this.listing.timezoneOffset) {
      this.dialogService.openDialog("Please change system timezone to listing's timezone.", true);
    } else if(this.listingDistance>constants.DISTANT_LOCATION) {
      this.dialogService.openDialog("Please change your address to a nearby location or select a different professional.", true);
    }
  }

  distanceBetweenTwoPlace(firstLat: number, firstLon: number, secondLat: number, secondLon: number, unit: string) {
    var firstRadlat = Math.PI * firstLat / 180
    var secondRadlat = Math.PI * secondLat / 180
    var theta = firstLon - secondLon;
    var radtheta = Math.PI * theta / 180
    var distance = Math.sin(firstRadlat) * Math.sin(secondRadlat) + Math.cos(firstRadlat) * Math.cos(secondRadlat) * Math.cos(radtheta);
    if (distance > 1) {
      distance = 1;
    }
    distance = Math.acos(distance)
    distance = distance * 180 / Math.PI
    distance = distance * 60 * 1.1515
    if (unit == "K") { distance = distance * 1.609344 }
    if (unit == "N") { distance = distance * 0.8684 }
    return distance
  }

}
