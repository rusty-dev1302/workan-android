import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/common/product';
import { SlotTemplate } from 'src/app/common/slot-template';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';
import { ProductService } from 'src/app/services/product.service';
import { constants } from 'src/environments/constants';
import { ToastrService } from 'ngx-toastr';

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

  // Add time slot dialog values
  dialogSlotTemplateId: number=0;
  dialogSlotTemplateStartTime: string="";
  dialogSlotTemplateEndTime: string="";


  timeSlots: string[] = constants.TIMESLOTS;

  constructor(
    private keycloakService: KeycloakService,
    private productService: ProductService,
    private toastrService: ToastrService,
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

  enableDisableSlotTemplate(slotTemplateId: number) {
  
  }

  addSlotTemplateItem() {
    let id!:number;

    let startTime: number = this.convertTimeToNumber(this.dialogSlotTemplateStartTime);
    let endTime: number = this.convertTimeToNumber(this.dialogSlotTemplateEndTime);

    let slot: SlotTemplateItem = new SlotTemplateItem(id, this.dialogSlotTemplateId, startTime, endTime, "", "");


    if(startTime<endTime) {
      const subscription = this.productService.saveSlotTemplateItem(this.dialogSlotTemplateId, slot).subscribe(
      (data) => {
        if(data.state==constants.SUCCESS_STATE) {
          this.loadSlotTemplates(this.listing.id);
        }
        subscription.unsubscribe();
      }
    );
  } else {
    this.toastrService.error("StartTime Should be Less Than EndTime");
  }

  this.resetSlotDialog();
  }

  resetSlotDialog() {
    this.dialogSlotTemplateEndTime="";
    this.dialogSlotTemplateStartTime="";
  }

  // methods to add values to slot dialog start 
  addSlotTemplateItemToDialog(slotTemplateId: number) {
    this.dialogSlotTemplateId = slotTemplateId;
  }

  setDialogStartTime(startTime: string) {
    console.log("start time called")
    this.dialogSlotTemplateStartTime = startTime;
  }

  setDialogEndTime(endTime: string) {
    console.log("End time called")

    this.dialogSlotTemplateEndTime = endTime;
  }
  // methods to add values to slot dialog end 

  removeSlotTemplateItem(slotTemplateItemId: number) {
    const subscription = this.productService.removeSlotTemplateItem(slotTemplateItemId).subscribe(
      (data) => {
        if(data.state==constants.SUCCESS_STATE){
          this.toastrService.success(constants.SUCCESS_STATE);
        } else {
          this.toastrService.error(data.message);
        }
        this.loadSlotTemplates(this.listing.id);
        subscription.unsubscribe();
      }
    );
  }

  toggleSlotTemplate(slotTemplateId: number) {
    const subscription = this.productService.toggleSlotTemplate(slotTemplateId).subscribe(
      (response) => {
        if(response.state==constants.SUCCESS_STATE) {
          this.toastrService.success(constants.SUCCESS_STATE);
        } else {
          this.toastrService.error(response.message);
        }
        this.loadSlotTemplates(this.listing.id);
        subscription.unsubscribe();
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
        if(data.state==constants.SUCCESS_STATE) {
          this.toastrService.success(constants.SUCCESS_STATE);
        } else {
          this.toastrService.error(data.message);
        }
        this.loadFormValues();
        this.isEditable = false;
      }
    );
  }

  convertTimeToString(time: number): string{
    let hour = Math.floor(time/100)<=12?Math.floor(time/100):Math.floor(time/100)%12;
    let min = (time%100==0?"00":time%100);
    let merd = (Math.floor(time/100)<12?"AM":"PM");

    return (hour==0?"00":hour)+":"+min+merd;
  }

  convertTimeToNumber(time: string): number{
    let hour: number = 0;
    let min: number = 0;
    hour = +time.split(":")[0];

    if(time.includes("AM")) {
      min = +time.split(":")[1].split("AM")[0];
    } else if(time.includes("PM")) {
      min = +time.split(":")[1].split("PM")[0];
      hour = (hour+12)%24;
    }

    return hour*100 + min;
  }

}
