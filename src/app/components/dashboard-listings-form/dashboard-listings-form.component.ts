import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { Listing } from 'src/app/common/listing';
import { SlotTemplate } from 'src/app/common/slot-template';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';
import { ListingService } from 'src/app/services/listing.service';
import { constants } from 'src/environments/constants';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/services/navigation.service';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { Certification } from 'src/app/common/certification';
import { UserService } from 'src/app/services/user.service';
import { FileService } from 'src/app/services/file.service';
import { SelectMapLocationComponent } from '../select-map-location/select-map-location.component';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicePricing } from 'src/app/common/service-pricing';

@Component({
  selector: 'app-dashboard-listings-form',
  templateUrl: './dashboard-listings-form.component.html',
  styleUrls: ['./dashboard-listings-form.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, SelectMapLocationComponent, DecimalPipe]
})
export class DashboardListingsFormComponent implements OnInit {

  @Output() currentListingEvent = new EventEmitter<Listing>();

  isEditable: boolean = false;

  isServicePriceSelect: boolean = true;

  subscription!: Subscription;

  listing: Listing = constants.DEFAULT_LISTING;
  displayListing!: Listing;
  slotTemplates!: SlotTemplate[];
  emailValue!: string;

  pasteItems: SlotTemplateItem[] = [];

  // Add time slot dialog values
  dialogSlotTemplateId: number = 0;
  dialogSlotTemplateStartTime: string = "";
  dialogSlotTemplateEndTime: string = "";
  toggleLoader: boolean = false;

  selectedDay: string = "Monday";

  addCertName: string = "";

  addServicePriceName: string = "";

  addServicePriceCharges!: number;

  certifications: Certification[] = [];

  servicePricings: ServicePricing[] = [];

  timeSlots: string[] = constants.TIMESLOTS;

  specialities: string[] = [];

  attachmentChangeEvt: any = '';
  clickedCertId!: number;

  allowListing: boolean = false;

  constructor(
    private keycloakService: KeycloakService,
    private listingService: ListingService,
    private toastrService: ToastrService,
    private navigation: NavigationService,
    private dialogService: ConfirmationDialogService,
    private userService: UserService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.navigation.showLoader();
    this.loadFormValues();
    this.loadAllSubcategories();
    this.getCertificationsByEmail();
  }

  selectSlot(day: string) {
    this.selectedDay = day;
  }

  loadFormValues() {
    this.emailValue = this.keycloakService.getUsername();
    const sub = this.userService.getUserByEmail(this.emailValue).subscribe(
      (data) => {
        if (!(data.state == constants.ERROR_STATE)) {
          if (data.mobile != 0) {
            this.allowListing = true;
          } else {
            this.toastrService.info("Please complete your profile first.")
          }
        }
      }
    );
    this.subscription = this.listingService.getListingByEmail(this.emailValue).subscribe(
      (data) => {
        if (data.state == constants.SUCCESS_STATE) {
          // Populate form from data
          this.listing = data;
          this.displayListing = JSON.parse(JSON.stringify(this.listing));
          this.loadSlotTemplates(this.listing.id);
          this.loadServicePricings();
          this.currentListingEvent.emit(this.listing);
        }

        this.navigation.pageLoaded();
        this.subscription.unsubscribe();
      }
    );
  }

  loadSlotTemplates(listingId: number) {
    const subscription = this.listingService.getSlotTemplates(listingId).subscribe(
      (data) => {
        this.slotTemplates = data;
        for (let i = 0; i < this.slotTemplates.length; i++) {
          this.slotTemplates[i].items.sort(
            (a, b) => {
              return a.startTimeHhmm - b.startTimeHhmm;
            }
          );
        }
        this.slotTemplates[0].items.sort();
        this.toggleLoader = false;
        subscription.unsubscribe();
      }
    );
  }

  loadServicePricings() {
    const sub = this.listingService.getServicePricings(this.listing.id).subscribe(
      (response) => {
        this.servicePricings = response;
        sub.unsubscribe();
      }
    );
  }

  loadAllSubcategories() {
    const subscription = this.listingService.getAllSubcategories().subscribe(
      (subcategories) => {
        if (subcategories.length > 0) {
          this.specialities = subcategories;
        }
        subscription.unsubscribe();
      }
    );
  }

  toggleServicePriceSelect(value: boolean) {
    this.isServicePriceSelect = value;
  }

  selectServicePrice(servicePrice: string) {
    this.addServicePriceName = servicePrice;
  }

  selectSubCategory(subcategory: string) {
    this.listing.subCategory.subCategoryName = subcategory;
  }

  selectChargesType(chargesType: string) {
    this.listing.chargesType = chargesType;
  }

  selectExperience(experience: string) {
    this.listing.experience = +experience;
  }

  createSlotRange() {
    this.pasteItems = [];

    let i = this.convertTimeToNumber(this.dialogSlotTemplateStartTime);
    let j = this.convertTimeToNumber(this.dialogSlotTemplateEndTime);

    if (i < j) {
      constants.TIME_RANGE.forEach(
        (range) => {
          if (range.start >= i && range.start < j) {
            let id!: number;
            let startTime: number = range.start;
            let endTime: number = range.end;
            let slot: SlotTemplateItem = new SlotTemplateItem(id, this.dialogSlotTemplateId, startTime, endTime, "", "");
            this.pasteItems.push(slot);
          }
        }
      );

      const subs = this.dialogService.openDialog(" create time slots for selected range").subscribe(
        (result) => {
          if (result) {
            const sub = this.listingService.saveSlotTemplateItems(this.dialogSlotTemplateId, this.pasteItems).subscribe(
              () => {
                this.loadSlotTemplates(this.listing.id);
                this.pasteItems = [];
                sub.unsubscribe();
              }
            );
          }
          subs.unsubscribe();
        }
      );
    } else {
      this.toastrService.error("StartTime Should be Less Than EndTime");
    }
  }

  addSlotTemplateItem() {
    let id!: number;

    let startTime: number = this.convertTimeToNumber(this.dialogSlotTemplateStartTime);
    let endTime: number = this.convertTimeToNumber(this.dialogSlotTemplateEndTime);

    let slot: SlotTemplateItem = new SlotTemplateItem(id, this.dialogSlotTemplateId, startTime, endTime, "", "");


    if (startTime < endTime) {
      const subscription = this.listingService.saveSlotTemplateItem(slot).subscribe(
        (data) => {
          if (data.state == constants.SUCCESS_STATE) {
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

  copySlotItems(dayName: string, items: SlotTemplateItem[]) {
    const sub = this.dialogService.openDialog(" copy time slots from " + dayName).subscribe(
      (result) => {
        if (result) {
          this.pasteItems = JSON.parse(JSON.stringify(items));
        }
        sub.unsubscribe();
      }
    );
  }

  pasteSlotItems(dayName: string, templateId: number, templateEnabled: boolean) {
    const subs = this.dialogService.openDialog("Are you sure you want to paste time slots to " + dayName + "? All of the current day slots will be switched OFF momentarily.", true).subscribe(
      (result) => {
        if (result) {
          if (templateEnabled) {
            this.toggleSlotTemplate(templateId);
          }
          const sub = this.listingService.saveSlotTemplateItems(templateId, this.pasteItems).subscribe(
            () => {
              this.loadSlotTemplates(this.listing.id);
              sub.unsubscribe();
            }
          );
        }
        subs.unsubscribe();
      }
    );
  }

  addCertificate() {
    let certification = new Certification(null!, this.addCertName, false, null!, null!, null!);
    const sub = this.userService.saveUserCertification(certification).subscribe(
      (response) => {
        this.getCertificationsByEmail();
        sub.unsubscribe();
      }
    );
    this.addCertName = '';
  }

  addServicePricing() {
    let servicePricing = new ServicePricing(null!, this.addServicePriceName, this.addServicePriceCharges, "", "");
    const sub = this.listingService.saveServicePricing(servicePricing, this.listing.id).subscribe(
      (response) => {
        this.loadServicePricings();
        sub.unsubscribe();
      }
    );
  }

  removeServicePricing(id: number) {
    const subscription = this.dialogService.openDialog("you want to delete current pricing").subscribe(
      (response) => {
        if (response) {
          const sub = this.listingService.removeServicePricing(id).subscribe(
            (response) => {
              this.loadServicePricings();
              sub.unsubscribe();
            }
          );
        }
        subscription.unsubscribe();
      }
    );
  }

  resetCertificationDialog() {
    this.addCertName = '';
  }

  uploadFile(certId: number) {
    const file: File = this.attachmentChangeEvt.target.files[0];

    let uploadData = new FormData();

    uploadData.append('attachment', file);

    const sub = this.fileService.uploadAttachment(uploadData, certId).subscribe(
      () => {
        this.getCertificationsByEmail();
        this.attachmentChangeEvt = null;
        sub.unsubscribe();
      }
    );
  }

  setClickCertId(certId: number) {
    this.clickedCertId = certId;
  }

  handleAttachment(event: any) {
    const file: File = event.target.files[0];

    if (file.type.includes("image") || file.type.includes("pdf")) {
      this.attachmentChangeEvt = event;

      const sub = this.dialogService.openDialog(" upload " + file.name.replaceAll(" ", "_")).subscribe(
        (response) => {
          if (response) {
            this.uploadFile(this.clickedCertId);
          } else {
            this.attachmentChangeEvt = null;
            this.clickedCertId = null!;
          }
          sub.unsubscribe();
        }
      );
    } else {
      const sub = this.dialogService.openDialog("Only PDF and Image files allowed as attachments.", true).subscribe(
        () => {
          sub.unsubscribe();
        }
      );
    }
  }

  downloadAttachments(attachments: any[]) {
    attachments.map(
      (a) => {
        this.fileService.downloadAttachment(a.attachmentByte, a.name, a.type);
      }
    );
  }

  resetSlotDialog() {
    this.dialogSlotTemplateEndTime = "";
    this.dialogSlotTemplateStartTime = "";
  }

  resetServicePriceDialog() {
    this.addServicePriceName = "";
    this.addServicePriceCharges = null!;
    this.isServicePriceSelect = true;
  }

  // methods to add values to slot dialog start 
  addSlotTemplateItemToDialog(slotTemplateId: number) {
    this.dialogSlotTemplateId = slotTemplateId;
  }

  setDialogStartTime(startTime: string) {
    this.dialogSlotTemplateStartTime = startTime;
  }

  setDialogEndTime(endTime: string) {

    this.dialogSlotTemplateEndTime = endTime;
  }
  // methods to add values to slot dialog end 

  removeSlotTemplateItem(slotTemplateItemId: number) {
    const sub = this.dialogService.openDialog(" remove this time slot").subscribe(
      (response) => {
        if (response) {
          const subscription = this.listingService.removeSlotTemplateItem(slotTemplateItemId).subscribe(
            (data) => {
              if (data.state == constants.SUCCESS_STATE) {
                this.toastrService.success(constants.SUCCESS_STATE);
              } else {
                this.toastrService.error(data.message);
              }
              this.loadSlotTemplates(this.listing.id);
              subscription.unsubscribe();
            }
          );
        }
        sub.unsubscribe();
      }
    );
  }

  toggleSlotTemplate(slotTemplateId: number) {
    this.toggleLoader = true;
    const subscription = this.listingService.toggleSlotTemplate(slotTemplateId).subscribe(
      (response) => {
        if (response.state == constants.SUCCESS_STATE) {
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
    if (!this.isEditable) {
      this.loadFormValues();
      this.isEditable = false;
    }
  }

  locationSelectorOutput(data: any) {
    this.listing.location = data.address;
    this.listing.geoHash = data.geoHash;
  }

  getCertificationsByEmail() {
    const sub = this.userService.getCertificationsByEmail(this.keycloakService.getUsername()).subscribe(
      (certifications) => {
        this.certifications = certifications;
        sub.unsubscribe();
      }
    );
  }

  onClickSubmit() {
    this.listing.professionalEmail = this.emailValue;
    this.listing.timezoneOffset = new Date().getTimezoneOffset();
    const sub = this.listingService.saveListing(this.listing).subscribe(
      (data) => {
        if (data.state == constants.SUCCESS_STATE) {
          this.toastrService.success(constants.SUCCESS_STATE);
        } else {
          this.toastrService.error(data.message);
        }
        this.loadFormValues();
        this.isEditable = false;
        sub.unsubscribe();
      }
    );
  }

  clearAllAttachments(certId: number) {
    const sub = this.dialogService.openDialog(" remove all attachments").subscribe(
      (response) => {
        if (response) {
          this.removeAllCertAttachments(certId);
        }

        sub.unsubscribe();
      }
    );
  }

  verifyCertification(certId: number) {
    const subs = this.dialogService
      .openDialog("You are sending the certification for verification, you will not be able to add/change its attachments.", true).subscribe(
        (response) => {
          if (response) {
            const sub = this.userService.sendCertForVerification(certId).subscribe(
              () => {
                this.getCertificationsByEmail();
                sub.unsubscribe();
              }
            );
          }

          subs.unsubscribe();
        }
      );
  }

  certificationVisibility(certId: number) {
    const subs = this.dialogService.openDialog(" change profile visibility").subscribe(
      (response) => {
        if (response) {
          const sub = this.userService.certificationVisibility(certId).subscribe(
            (response) => {
              if (response.state != constants.ERROR_STATE) {
                this.getCertificationsByEmail();
                sub.unsubscribe();
              }
            }
          );
        }

        subs.unsubscribe();
      }
    );
  }

  removeCertification(certId: number) {
    const subs = this.dialogService.openDialog(" delete the certification").subscribe(
      (response) => {
        if (response) {
          const sub = this.userService.removeUserCertification(certId).subscribe(
            () => {
              this.getCertificationsByEmail();
              sub.unsubscribe();
            }
          );
        }

        subs.unsubscribe();
      }
    );
  }

  removeAllCertAttachments(certId: number) {
    const sub = this.userService.removeAllCertAttachments(certId).subscribe(
      () => {
        this.getCertificationsByEmail();
        sub.unsubscribe();
      }
    );
  }

  removeListing(listingId: number) {
    const sub = this.listingService.removeListing(listingId).subscribe(
      () => {
        window.location.reload();
        sub.unsubscribe();
      }
    );
  }

  convertTimeToString(time: number): string {
    let hour = Math.floor(time / 100) <= 12 ? Math.floor(time / 100) : Math.floor(time / 100) % 12;
    let min = (time % 100 == 0 ? "00" : time % 100);
    let merd = (Math.floor(time / 100) < 12 ? "AM" : "PM");

    return (hour == 0 ? "00" : hour) + ":" + min + merd;
  }

  convertTimeToNumber(time: string): number {
    let hour: number = 0;
    let min: number = 0;
    hour = +time.split(":")[0];

    if (time.includes("AM")) {
      min = +time.split(":")[1].split("AM")[0];
    } else if (time.includes("PM")) {
      min = +time.split(":")[1].split("PM")[0];
      hour = hour == 12 ? 12 : (hour + 12) % 24;
    }

    return hour * 100 + min;
  }

}
