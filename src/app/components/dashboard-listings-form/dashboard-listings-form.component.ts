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
        if(data!=null){
          // Populate form from data
          this.listing = data;
        }
        this.subscription.unsubscribe();
      }
    );
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
