import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import Geohash from 'latlon-geohash';
import { Listing } from 'src/app/common/listing';
import { Professional } from 'src/app/common/professional';
import { Review } from 'src/app/common/review';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { ListingService } from 'src/app/services/listing.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { VerifiedCertificatePipe } from '../../pipes/verified-cert-pipe';
import { SlotSelectorComponent } from '../slot-selector/slot-selector.component';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, SlotSelectorComponent, DecimalPipe, VerifiedCertificatePipe]
})
export class ListingDetailsComponent implements OnInit {

  listing!: Listing;

  reviewPage: number = 0;

  professional!: Professional;
  isProfessional: boolean = false;
  currentListingId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";
  reviews: Review[] = [];
  totalRatings: number = 1;
  listingDistance: number = 0;
  DISTANT_LOCATION = constants.DISTANT_LOCATION;

  timezoneOffset = new Date().getTimezoneOffset();

  portfolioImages:any[] = [];

  constructor(
    private listingService: ListingService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private navigation: NavigationService,
    private dialogService: ConfirmationDialogService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private profilePhotoService: ProfilePhotoService
  ) { }

  ngOnInit(): void {
    this.navigation.showLoader();
    this.route.paramMap.subscribe(() => {
      this.handleListingRouting();
    });
  }

  handleListingRouting() {
    if (this.route.snapshot.paramMap.has("id")) {
      this.currentListingId = +this.route.snapshot.paramMap.get("id")!;
      this.loadListingDetails();
    }

  }

  loadListingDetails() {
    const subscription = this.listingService.getListingById(this.currentListingId).subscribe(
      (listing) => {
        if (listing.state != constants.ERROR_STATE) {
          this.listing = listing;
          this.assignProfessionalAndLoadData();
          this.loadPortFolio();
        }
        this.navigation.pageLoaded();
        subscription.unsubscribe();
      }
    );
  }

  loadPortFolio() {
    const sub = this.profilePhotoService.getPortImagesByListingId(this.listing.id).subscribe(
      (response) => {
        let res: any[] = [];
        response.forEach(
          (i)=>{
            if(i.approved==true) {
              res.push(i);
            }
          }
        );
        this.portfolioImages = res;
      }
    );
  }

  assignProfessionalAndLoadData() {
    this.professional = this.listing.professional;
    let total: number = this.professional.oneRating + this.professional.twoRating + this.professional.threeRating + this.professional.fourRating + this.professional.fiveRating;
    this.totalRatings = total > 0 ? total : 1;
    this.getReviewsForProfessional();

    const sub1 = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        this.isProfessional = user.professional;
        const sub2 = this.userService.getContactDetailByEmail(this.keycloakService.getUsername()).subscribe(
          (contact) => {
            if (contact.state != constants.ERROR_STATE) {
              let userLoc = Geohash.decode(contact.geoHash);
              let listingLoc = Geohash.decode(this.listing.geoHash);

              let distance = this.distanceBetweenTwoPlace(userLoc.lat, userLoc.lon, listingLoc.lat, listingLoc.lon, "K");
              this.listingDistance = distance;

            }
            sub2.unsubscribe();
          }
        );
        sub1.unsubscribe();
      }
    );

  }

  loadMore() {
    if (this.reviewPage != -1) {
      this.getReviewsForProfessional();
    }
  }

  getReviewsForProfessional() {
    const subscription = this.orderService.getReviewsForProfessional(this.professional.id, this.reviewPage).subscribe(
      (reviews) => {
        if (reviews.length > 0 && reviews[0].state != constants.ERROR_STATE) {
          this.reviews = this.reviews.concat(reviews);
          if (reviews.length < 3) {
            this.reviewPage = -1;
          } else {
            this.reviewPage++;
          }
        } else {
          this.reviewPage = -1;
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
    if (this.timezoneOffset != this.listing.timezoneOffset) {
      this.dialogService.openDialog("Please change system timezone to listing's timezone.", true, true);
    } else if (this.listingDistance > constants.DISTANT_LOCATION) {
      this.dialogService.openDialog("Please change your address to a nearby location or select a different professional.", true, true);
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
