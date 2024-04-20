import { DatePipe, DecimalPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Customer } from 'src/app/common/customer';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { constants } from 'src/environments/constants';
import { VerifiedCertificatePipe } from '../../pipes/verified-cert-pipe';
import { SelectMapLocationComponent } from '../select-map-location/select-map-location.component';

@Component({
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, SelectMapLocationComponent, NgIf, InfiniteScrollModule, RouterLink, SlicePipe, DecimalPipe, VerifiedCertificatePipe]
})
export class BrowseListingsComponent implements OnInit {
  options = [
    { name: 'Bangalore', id: 1 },
    { name: 'Chennai', id: 2 },
    { name: 'Erode', id: 3 },
    { name: 'Bangkok', id: 4 },
    { name: 'Jammu', id: 5 },
    { name: 'Madurai', id: 6 },
    { name: 'Goa', id: 7 },
    { name: 'Mumbai', id: 8 },
    { name: 'Kolkata', id: 9 },
    { name: 'Shillong', id: 10 },
    { name: 'Cochin', id: 11 },
    { name: 'Mysore', id: 12 },
  ];
  currentSelection = {
    name: 'Chennai'
  };



  // seperator

  listings: Listing[] = [];
  searchMode: boolean = false;
  currentSubcategory: string = "";
  sortByValue: string = "";
  geoHash: string = "";
  currentLocation!: string;
  searchKeyword: string = "";
  subscription: any;
  pageNumber: number = 0;
  listingsLoading: boolean = false;

  subCategories: string[] = [];
  sortByArray: string[] = ["Rating", "Charges: low to high", "Charges: high to low"];
  distanceInKm: number = 10;
  latitude: number = 0;
  longitude: number = 0;

  timezoneOffset = new Date().getTimezoneOffset();


  constructor(private listingService: ListingService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    this.handleProductsRouting();
  }

  handleProductsRouting() {
    const hasSubcategory: boolean = this.route.snapshot.queryParamMap.has('subCategory');
    const hasLocation: boolean = this.route.snapshot.queryParamMap.has('geoHash');
    const hasSortBy: boolean = this.route.snapshot.queryParamMap.has('sortBy');

    if (hasSubcategory) {
      this.currentSubcategory = this.route.snapshot.queryParamMap.get('subCategory') ? this.route.snapshot.queryParamMap.get('subCategory')! : "";
    }

    if (hasLocation) {
      this.geoHash = this.route.snapshot.queryParamMap.get('geoHash') ? this.route.snapshot.queryParamMap.get('geoHash')! : "";
      this.currentLocation = this.route.snapshot.queryParamMap.get('currentLocation') ? this.route.snapshot.queryParamMap.get('currentLocation')! : "";
      this.distanceInKm = this.route.snapshot.queryParamMap.get('distanceInKm') ? +this.route.snapshot.queryParamMap.get('distanceInKm')! : 10;
      this.latitude = this.route.snapshot.queryParamMap.get('latitude') ? +this.route.snapshot.queryParamMap.get('latitude')! : 0;
      this.longitude = this.route.snapshot.queryParamMap.get('longitude') ? +this.route.snapshot.queryParamMap.get('longitude')! : 0;
    }

    if (hasSortBy) {
      this.sortByValue = this.route.snapshot.queryParamMap.get('sortBy') ? this.route.snapshot.queryParamMap.get('sortBy')! : "";
    }

    this.handleListProducts();
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
    this.latitude = data.latitude;
    this.longitude = data.longitude;
  }

  setAverageDistance(distance: number) {
    this.distanceInKm = distance;
  }

  clearAllFilters() {
    this.currentSubcategory = "";
    this.currentLocation = ""
    this.sortByValue = "";
    this.geoHash = "";
    this.saveFilters();
  }

  getListingSubcategories() {
    const sub = this.listingService.getListingSubcategories().subscribe(
      (data) => {
        this.subCategories = data;
        sub.unsubscribe();
      }
    );
  }

  saveFilters() {
    let qpMap = new Map();
    this.currentSubcategory != "" ? qpMap.set("subCategory", this.currentSubcategory) : '';
    this.geoHash != "" ? qpMap.set("geoHash", this.geoHash) : '';
    this.sortByValue != "" ? qpMap.set("sortBy", this.sortByValue) : '';
    this.currentLocation != "" ? qpMap.set("currentLocation", this.currentLocation) : '';
    this.geoHash != "" ? qpMap.set("distanceInKm", this.distanceInKm) : '';
    this.geoHash != "" ? qpMap.set("latitude", this.latitude) : '';
    this.geoHash != "" ? qpMap.set("longitude", this.longitude) : '';
    

    let qp: any = {};
    qpMap.forEach((value, key) => {
      qp[key] = value
    });

    this.router.navigate(['listings'], { queryParams: qp }).then(() => {
      window.location.reload();
    });;
  }

  handleListProducts() {
    this.listingsLoading = true;
    const sub = this.listingService.getListingsByFilters(this.currentSubcategory, this.geoHash, this.sortByValue, this.latitude, this.longitude, this.distanceInKm, this.pageNumber).subscribe(
      data => {
        if (data) {
          if (data[0] && data[0].state != constants.ERROR_STATE) {
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

  onScroll() {
    if (this.pageNumber > -1) {
      this.handleListProducts();
    }
  }

}
