import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/common/product';
import { SlotTemplate } from 'src/app/common/slot-template';
import { ProductService } from 'src/app/services/product.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-listings-form',
  templateUrl: './dashboard-listings-form.component.html',
  styleUrls: ['./dashboard-listings-form.component.css']
})
export class DashboardListingsFormComponent implements OnInit{

  isEditable: boolean = false;

  subscription!: Subscription;

  listing: Product=constants.DEFAULT_LISTING;
  displayListing!: Product;
  slotTemplates!: SlotTemplate[];
  emailValue!:string;

  constructor(
    private keycloakService: KeycloakService,
    private productService: ProductService
    ) { }

  ngOnInit(): void {
    this.loadFormValues();
   }

  loadFormValues() {
    this.emailValue = this.keycloakService.getUsername();
    this.subscription = this.productService.getProductByEmail(this.emailValue).subscribe(
      (data)=>{
        if(data.state==constants.SUCCESS_STATE){
          // Populate form from data
          this.listing = data;
          console.log(this.listing)
          this.displayListing = JSON.parse(JSON.stringify(this.listing));
          this.loadSlotTemplates(this.listing.id);
        }
        this.subscription.unsubscribe();
      }
    );
  }

  loadSlotTemplates(listingId: number) {
    const subscription = this.productService.getSlotTemplates(listingId).subscribe(
      (data) => {
        this.slotTemplates = data;
        subscription.unsubscribe();
      }
    );
  }

  addSlot(slotTemplateId: number) {

  }

  removeSlot(slotId: number) {

  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if(!this.isEditable) {
      this.loadFormValues();
      this.isEditable=false;
    }
  }

  
  onClickSubmit() {
    this.listing.professionalEmail = this.emailValue;
    this.productService.saveProduct(this.listing).subscribe(
      (data)=>{
        this.loadFormValues();
        this.isEditable = false;
      }
    );
  }

}
