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
  options=[
    {name:'Bangalore',id:1},
    {name:'Chennai',id:2},
    {name:'Erode',id:3},
    {name:'Bangkok',id:4},
    {name:'Jammu',id:5},
    {name:'Madurai',id:6},
    {name:'Goa',id:7},
    {name:'Mumbai',id:8},
    {name:'Kolkata',id:9},
    {name:'Shillong',id:10},
    {name:'Cochin',id:11},
    {name:'Mysore',id:12},
  ];
  currentSelection = {
    name:'Chennai'
  };



  // seperator

  listings: Listing[] = [];
  searchMode: boolean = false;
  currentSubcategory: string = "";
  sortByValue: string = "";
  geoHash: string = "";
  currentLocation!: string;
  searchKeyword: string = "";
  currentUser!: Customer;
  subscription: any;
  pageNumber: number = 0;
  listingsLoading: boolean = false;

  subCategories: string[] = [];
  sortByArray: string[] = ["Rating", "Charges low to high", "Charges high to low"];

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
            const sub = this.listingService.getListingByEmail(this.currentUser.email).subscribe(
              (listing) => {
                if (listing.state == constants.SUCCESS_STATE) {
                  if (listing.geoHash) {
                    this.currentLocation = listing.location;
                    this.geoHash = listing.geoHash;
                  }
                }
                sub.unsubscribe();
              }
            );
          } else if (this.currentUser.contact && this.currentUser.contact.geoHash) {
            this.currentLocation = this.currentUser.contact.addressLine3;
            this.geoHash = this.currentUser.contact.geoHash;
          }

        }

        this.handleListProducts();
        this.subscription.unsubscribe();
      }
    );
  }

  selectSubcategory(subCategory: string) {
    this.currentSubcategory = subCategory;
  }

  selectSortBy(sortBy: string) {
    this.sortByValue = sortBy;
  }

  locationSelectorOutput(data: any) {
    this.currentLocation = data.address;
    this.geoHash = data.geoHash;
  }

  clearAllFilters() {
    this.currentSubcategory = "";
    this.currentLocation = ""
    this.sortByValue = "";
    this.geoHash = "";

    this.handleListProducts(true);
  }

  getListingSubcategories() {
    const sub = this.listingService.getListingSubcategories().subscribe(
      (data) => {
        this.subCategories = data;
        sub.unsubscribe();
      }
    );
  }

  handleListProducts(resetPage=false) {
    this.listingsLoading = true;
    if(resetPage) {
      this.pageNumber = 0;
      this.listings = [];
    }
    const sub = this.listingService.getListingsByFilters(this.currentSubcategory, this.geoHash, this.sortByValue, this.pageNumber).subscribe(
      data => {
        console.log(data)
        if (data) {
          if (data[0] && data[0].state != constants.ERROR_STATE) {
            data.forEach(
              (listing) => {
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
          this.listingsLoading = false;
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
