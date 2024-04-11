import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Certification } from 'src/app/common/certification';
import { Listing } from 'src/app/common/listing';
import { ServicePricing } from 'src/app/common/service-pricing';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { FileService } from 'src/app/services/file.service';
import { ListingService } from 'src/app/services/listing.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { SelectMapLocationComponent } from '../select-map-location/select-map-location.component';
import { UnavailabilityCalendarComponent } from '../unavailability-calendar/unavailability-calendar.component';

@Component({
  selector: 'app-dashboard-listings-form',
  templateUrl: './dashboard-listings-form.component.html',
  styleUrls: ['./dashboard-listings-form.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, SelectMapLocationComponent, DecimalPipe, DatePipe, UnavailabilityCalendarComponent]
})
export class DashboardListingsFormComponent implements OnInit {

  @Input() menuItem: number = 0;

  @Output() currentListingEvent = new EventEmitter<Listing>();

  isEditable: boolean = false;

  isServicePriceSelect: boolean = true;

  subscription!: Subscription;

  listing: Listing = constants.DEFAULT_LISTING;
  displayListing!: Listing;
  availabilityRange!: any[];
  unavailableDays!: any[];
  emailValue!: string;

  copyStartTime!: string;
  copyEndTime!: string;
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
    private fileService: FileService,
    public dateTimeService: DateTimeService,
    private datePipe: DatePipe
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
          this.getAvailability(this.listing.id);
          this.getUnavailabilityForProfessional();
          this.loadServicePricings();
          this.currentListingEvent.emit(this.listing);
        }

        this.navigation.pageLoaded();
        this.subscription.unsubscribe();
      }
    );
  }

  getAvailability(listingId: number) {
    const subscription = this.listingService.getAvailabilityRange(listingId, true).subscribe(
      (data) => {
        this.availabilityRange = Object.keys(data).map((key: any) => {
          return {
            templateId: key,
            dayName: (data[key] as unknown as string).split(",")[0],
            startTimeHhmm: (data[key] as unknown as string).split(",")[1].split("-")[0],
            endTimeHhmm: (data[key] as unknown as string).split(",")[1].split("-")[1],
            enabled: JSON.parse((data[key] as unknown as string).split(",")[2])
          }
        });
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

  addUnavailabilityForProfessional(event: any) {
    const subscription = this.dialogService.openDialog(" mark " + this.datePipe.transform(event, "dd MMMM (EEEE)", "+0000") + " as unavailable").subscribe(
      (res) => {
        if (res) {
          let item = {
            id: null,
            date: event
          }
          const sub = this.listingService.addUnavailabilityForProfessional(item).subscribe(
            () => {
              this.getUnavailabilityForProfessional();
              sub.unsubscribe();
            }
          );
        }
      }
    );
  }

  getUnavailabilityForProfessional() {
    const sub = this.listingService.getUnavailabilityForProfessional().subscribe(
      (data) => {
        if (data && data.length > 0 && data[0].state != constants.ERROR_STATE || data) {
          this.unavailableDays = data;
        }
        sub.unsubscribe();
      }
    );
  }

  selectSubCategory(subcategory: string) {
    this.listing.subCategory.subCategoryName = subcategory;
  }

  selectExperience(experience: string) {
    this.listing.experience = +experience;
  }

  createSlotRange(templateId: number = null!, startTime: string = null!, endTime: string = null!) {
    this.pasteItems = [];

    let i = startTime != null ? +startTime : this.dateTimeService.convertTimeToNumber(this.dialogSlotTemplateStartTime);
    let j = endTime != null ? +endTime : this.dateTimeService.convertTimeToNumber(this.dialogSlotTemplateEndTime);

    if (i < j) {
      constants.TIME_RANGE.forEach(
        (range) => {
          if (range.start >= i && range.start < j) {
            let id!: number;
            let startTime: number = range.start;
            let endTime: number = range.end;
            let slot: SlotTemplateItem = new SlotTemplateItem(id, templateId ? templateId : this.dialogSlotTemplateId, startTime, endTime, "", "");
            this.pasteItems.push(slot);
          }
        }
      );

      const sub = this.listingService.saveSlotTemplateItems(templateId ? templateId : this.dialogSlotTemplateId, this.pasteItems).subscribe(
        () => {
          this.getAvailability(this.listing.id);
          this.pasteItems = [];
          sub.unsubscribe();
        }
      );

    } else {
      this.toastrService.error("StartTime Should be Less Than EndTime");
    }
  }

  addSlotTemplateItem() {
    let id!: number;

    let startTime: number = this.dateTimeService.convertTimeToNumber(this.dialogSlotTemplateStartTime);
    let endTime: number = this.dateTimeService.convertTimeToNumber(this.dialogSlotTemplateEndTime);

    let slot: SlotTemplateItem = new SlotTemplateItem(id, this.dialogSlotTemplateId, startTime, endTime, "", "");


    if (startTime < endTime) {
      const subscription = this.listingService.saveSlotTemplateItem(slot).subscribe(
        (data) => {
          if (data.state == constants.SUCCESS_STATE) {
            this.getAvailability(this.listing.id);
          }
          subscription.unsubscribe();
        }
      );
    } else {
      this.toastrService.error("StartTime Should be Less Than EndTime");
    }
    this.resetSlotDialog();

  }

  copySlotItems(dayName: string, startTime: string, endTime: string) {
    const sub = this.dialogService.openDialog(" copy time slots from " + dayName).subscribe(
      (result) => {
        if (result) {
          this.copyStartTime = startTime;
          this.copyEndTime = endTime;
        }
        sub.unsubscribe();
      }
    );
  }

  pasteSlotItems(dayName: string, templateId: string, templateEnabled: boolean) {
    const sub = this.dialogService.openDialog(" paste schedule to " + dayName).subscribe(
      (response) => {
        if (response) {
          this.createSlotRange(+templateId, this.copyStartTime, this.copyEndTime);
        }
        sub.unsubscribe();
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

        //reset the file input after file upload
        const fileInput = <HTMLFormElement> document.getElementById("files");
        fileInput.value = "";

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

  // methods alter date availability 
  removeUnavailableDate(unavailableDayId: number) {
    const subscription = this.dialogService.openDialog(" remove the selected date from unavailable dates").subscribe(
      (res) => {
        if (res) {
          const sub = this.listingService.removeUnavailabilityForProfessional(unavailableDayId).subscribe(
            () => {
              this.getUnavailabilityForProfessional();
              sub.unsubscribe();
            }
          );
        }
        subscription.unsubscribe();
      }
    );

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

  toggleSlotTemplate(slotTemplateId: number) {
    this.toggleLoader = true;
    const subscription = this.listingService.toggleSlotTemplate(slotTemplateId).subscribe(
      (response) => {
        if (response.state == constants.SUCCESS_STATE) {
          this.toastrService.success(constants.SUCCESS_STATE);
        } else {
          this.toastrService.error(response.message);
        }
        this.toggleLoader = false;
        this.getAvailability(this.listing.id);
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

}
