import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { Listing } from 'src/app/common/listing';
import { Professional } from 'src/app/common/professional';
import { Review } from 'src/app/common/review';
import { ListingService } from 'src/app/services/listing.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { constants } from 'src/environments/constants';
import { VerifiedCertificatePipe } from '../../pipes/verified-cert-pipe';
import { SlotSelectorComponent } from '../slot-selector/slot-selector.component';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { PhotoViewerComponent } from '../photo-viewer/photo-viewer.component';

@Component({
  selector: 'app-view-my-listing',
  templateUrl: './view-my-listing.component.html',
  styleUrls: ['./view-my-listing.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, SlotSelectorComponent, DecimalPipe, VerifiedCertificatePipe, PhotoViewerComponent]
})
export class ViewMyListingComponent implements OnInit {

  listing!: Listing;
  professional!: Professional;
  currentListingId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";
  reviews: Review[] = [];
  totalRatings: number = 1;
  DISTANT_LOCATION = constants.DISTANT_LOCATION;

  portfolioImages: any[] = [];

  reviewPage: number = 0;

  timezoneOffset = new Date().getTimezoneOffset();

  viewImage: any;

  showPrevPic: boolean = false;

  showNextPic: boolean = false;

  currentPortIndex: number = 0;

  constructor(
    private listingService: ListingService,
    private orderService: OrderService,
    private navigation: NavigationService,
    private keycloakService: KeycloakService,
    private profilePhotoService: ProfilePhotoService
  ) { }

  ngOnInit(): void {
    this.navigation.showLoader();
    this.loadListingDetails();
  }

  filterPortImages(images: any[]) {
    let res: any[] = [];
    images.forEach(
      (i) => {
        if (i.approved == true) {
          res.push(i);
        }
      }
    );
    return res;
  }

  loadListingDetails() {
    const subscription = this.listingService.getListingByEmail(this.keycloakService.getUsername()).subscribe(
      (listing) => {
        if (listing.state != constants.ERROR_STATE) {
          this.listing = listing;
          const sub = this.listingService.getProfessionalById(this.listing.professional.id).subscribe(
            (professional) => {
              this.professional = professional;
              let total: number = professional.oneRating + professional.twoRating + professional.threeRating + professional.fourRating + professional.fiveRating;
              this.totalRatings = total > 0 ? total : 1;
              this.getReviewsForProfessional();
              sub.unsubscribe();
            }
          );
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
          (i) => {
            if (i.approved == true) {
              res.push(i);
            }
          }
        );
        this.portfolioImages = res;
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
          this.reviews = reviews;
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

  prevPortPic() {
    this.currentPortIndex--;
    this.loadPortfolioImage(this.portfolioImages[this.currentPortIndex].id, this.portfolioImages[this.currentPortIndex].thumbnail, this.currentPortIndex);
  }

  nextPortPic() {
    this.currentPortIndex++;
    this.loadPortfolioImage(this.portfolioImages[this.currentPortIndex].id, this.portfolioImages[this.currentPortIndex].thumbnail, this.currentPortIndex);
  }

  loadPortfolioImage(imageId: number, thumbnail: any, index: number) {
    this.viewImage = thumbnail;
    this.currentPortIndex = index;
    this.showPrevPic = true;
    this.showNextPic = true;
    if (this.currentPortIndex == 0) {
      this.showPrevPic = false;
    }
    if (this.currentPortIndex == this.portfolioImages.length - 1) {
      this.showNextPic = false;
    }
    // get full portfolio image 
    this.profilePhotoService.getFullPortImage(imageId).subscribe(
      (image) => {
        this.viewImage = image.picByte;
      }
    );
  }

  navigateBack(): void {
    this.navigation.back()
  }

}
