import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/common/customer';
import { Listing } from 'src/app/common/listing';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';
import { ListingService } from 'src/app/services/listing.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.css']
})
export class BrowseListingsComponent implements OnInit {

  listings: Listing[] = [];
  searchMode: boolean = false;
  currentSubcategory: string = "";
  geoHash: string = "";
  currentLocation!: string;
  searchKeyword: string = "";
  currentUser!: Customer;
  subscription: any;
  pageNumber: number = 0;

  timezoneOffset = new Date().getTimezoneOffset();


  constructor(private listingService: ListingService,
    private datePipe: DatePipe,
    private navigationService: NavigationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private keycloakService: KeycloakService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    this.loadUserDetails();
  }

  handleProductsRouting() {
    const hasSubcategory: boolean = this.route.snapshot.paramMap.has('subcategory');
    const hasLocation: boolean = this.route.snapshot.paramMap.has('location');

    this.listings = [];

    if (hasSubcategory) {
      this.currentSubcategory = this.route.snapshot.paramMap.get('subcategory')!;
    }

    if (hasLocation) {
      this.geoHash = this.route.snapshot.paramMap.get('location')!;
    }

    this.handleListProducts();
  }

  loadUserDetails() {
    this.subscription = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if (user.state == constants.SUCCESS_STATE) {
          this.currentUser = user;

          if (this.currentUser.professional) {
            this.listingService.getListingByEmail(this.currentUser.email).subscribe(
              (listing) => {
                if (listing.state == constants.SUCCESS_STATE) {
                  if (listing.geoHash) {
                    this.currentLocation = listing.location;
                    this.geoHash = listing.geoHash;
                  }
                }
              }
            );
          } else if (this.currentUser.contact && this.currentUser.contact.geoHash) {
            this.currentLocation = this.currentUser.contact.addressLine3;
            this.geoHash = this.currentUser.contact.geoHash;
          }

        }

        this.handleListProducts();
      }
    );
  }

  handleListProducts() {
    const sub = this.listingService.getListingsByFilters(this.currentSubcategory, this.geoHash, this.pageNumber).subscribe(
      data => {
        console.log(data)
        if (data) {
          if (data[0] && data[0].state != constants.ERROR_STATE) {
            data.forEach(
              (listing) => {
                let total: number = 
                    listing.professional.oneRating
                  + listing.professional.twoRating
                  + listing.professional.threeRating
                  + listing.professional.fourRating
                  + listing.professional.fiveRating;
                let weightedSum = 
                    1*listing.professional.oneRating
                  + 2*listing.professional.twoRating
                  + 3*listing.professional.threeRating
                  + 4*listing.professional.fourRating
                  + 5*listing.professional.fiveRating;

                listing.professional.rating = total > 0 ? weightedSum/total : 0;
              
                if(listing.timezoneOffset==this.timezoneOffset) {
                  this.getAvailabilityForListing(listing);
                }
              }
            );
            this.listings = this.listings.concat(data);
            this.pageNumber++;
          } else {
            this.pageNumber = -1;
          }
        }
        this.navigationService.pageLoaded();
        sub.unsubscribe();
      }
    );
  }

  updateAddress() {

    if (this.currentUser.professional) {
      this.router.navigateByUrl(`/dashboard/managelisting`);
    } else {
      this.router.navigateByUrl(`/dashboard/addressDetails`);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onScroll() {
    if (this.pageNumber > -1) {
      this.handleListProducts();
    }
  }

  getAvailabilityForListing(listing: Listing) {
    let today: Date = new Date();  
    this.getSlotsForDay(today, listing);
    let tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.getSlotsForDay(tomorrow, listing, true);
  }

  getSlotsForDay(date: Date, listing: Listing, stopLoad:boolean=false) {
    if (date) {
      const sub = this.listingService.getAvailableSlotsItems(listing.id, this.datePipe.transform(date, 'EEEE')!, this.datePipe.transform(date, 'yyyy-MM-dd')! + "T00:00:00.000000Z").subscribe(
        (data) => {
          if (data) {

            let currentSlots:SlotTemplateItem[] = data;

            const todayDate = new Date().getDate();

            if (todayDate == date.getDate()) {
              const todayTime = this.datePipe.transform(new Date(), 'HHmm');
              currentSlots = currentSlots.filter(
                a => a.startTimeHhmm > +todayTime!
              );

              if(currentSlots.length>0) {
                listing.availableToday = true;
              } else {
                listing.availableToday = false;
              }

            } else {
              if(currentSlots.length>0) {
                console.log(currentSlots)
                listing.availableTomorrow = true;
              } else {
                listing.availableTomorrow = false;
              }

            }

            if(stopLoad) {
              listing.availabilityLoaded = true;
            }

            sub.unsubscribe();
          }
        }
      );
    }
  }
}
