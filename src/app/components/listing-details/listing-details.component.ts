import { Component, OnInit } from '@angular/core';
import { Listing } from 'src/app/common/listing';
import { ListingService } from 'src/app/services/listing.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent implements OnInit{

  listing!: Listing;
  currentListingId: number = 0;
  currentSlotDay: string = "";
  currentSlotTime: string = "";

  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    private navigation: NavigationService
    ) { }

  ngOnInit(): void {
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
