import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Customer } from 'src/app/common/customer';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.css']
})
export class BrowseListingsComponent implements OnInit{

  listings: Listing[] = [];
  searchMode: boolean = false;
  currentSubcategory: string = "";
  currentLocation: string = "";
  searchKeyword: string = "";
  currentUser!: Customer;
  subscription: any;


  constructor(private listingService: ListingService,
              private userService: UserService,
              private route: ActivatedRoute,
              private keycloakService: KeycloakService
    ) { }

  ngOnInit() {
    this.loadUserDetails();
    this.route.paramMap.subscribe(()=>{
      this.handleProductsRouting();
    });
  }

  handleProductsRouting() {
    const hasSubcategory: boolean = this.route.snapshot.paramMap.has('subcategory');
    const hasLocation: boolean = this.route.snapshot.paramMap.has('location');
    
    this.listings = [];

    if(hasSubcategory) {
      this.currentSubcategory = this.route.snapshot.paramMap.get('subcategory')!;
    }

    if(hasLocation) {
      this.currentLocation = this.route.snapshot.paramMap.get('location')!;
    }

    this.handleListProducts();
  }

  loadUserDetails() {
    this.subscription = this.userService.getUserByEmail(this.keycloakService.getUsername(), false).subscribe(
      (user) => {
        if(user.state==constants.SUCCESS_STATE) {
          this.currentUser = user;
        }
      }
    );
  }

  handleListProducts() {
    this.listingService.getListingsByFilters(this.currentSubcategory, this.currentLocation).subscribe(
      data => {
        if(data) {
          if(data[0]&&data[0].state!=constants.ERROR_STATE){
            this.listings = data;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
