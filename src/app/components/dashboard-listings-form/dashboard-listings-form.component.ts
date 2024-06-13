import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { NotificationService } from 'src/app/services/notification.service';
import { PhotoUploaderComponent } from '../photo-uploader/photo-uploader.component';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { PhotoViewerComponent } from '../photo-viewer/photo-viewer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-listings-form',
  templateUrl: './dashboard-listings-form.component.html',
  styleUrls: ['./dashboard-listings-form.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, NgFor, SlicePipe, SelectMapLocationComponent, DecimalPipe, DatePipe, UnavailabilityCalendarComponent, PhotoUploaderComponent, PhotoViewerComponent, RouterLink]
})
export class DashboardListingsFormComponent implements OnInit {

  @Input() menuItem: number = 0;

  @Output() currentListingEvent = new EventEmitter<Listing>();

  @Output() portfolioCompleteEvent = new EventEmitter<boolean>();

  @Output() documentsCompleteEvent = new EventEmitter<boolean>();

  @Output() scheduleCompleteEvent = new EventEmitter<boolean>();

  @Output() menuItemEvent = new EventEmitter<number>();

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

  showGuidelines: boolean = false;

  // Add time slot dialog values
  dialogSlotTemplateId: number = 0;
  dialogSlotTemplateStartTime: string = "";
  dialogSlotTemplateEndTime: string = "";
  toggleLoader: boolean = false;

  selectedDay: string = "Monday";

  addCertName: string = "";

  addServicePriceName: string = "";

  addServiceTimeHh: number = 0;

  addServiceTimeMm: number = 0;

  editServicePricingId!: number;

  addServicePriceCharges!: number;

  certifications: Certification[] = [];

  servicePricings: ServicePricing[] = [];

  timeSlots: string[] = constants.TIMESLOTS;

  specialities: string[] = [];

  attachmentChangeEvt: any = '';
  clickedCertId!: number;

  allowListing: boolean = false;

  showUploader: boolean = true;

  portfolioImages: any[] = [];

  currentPortIndex: number = 0;

  showPrevPic: boolean = false;

  showNextPic: boolean = false;

  viewImage: any;

  enablePortVerify: boolean = false;

  infoBox!: number;

  constructor(
    private keycloakService: KeycloakService,
    private listingService: ListingService,
    private toastrService: ToastrService,
    private navigation: NavigationService,
    private dialogService: ConfirmationDialogService,
    private userService: UserService,
    private fileService: FileService,
    public dateTimeService: DateTimeService,
    public notificationService: NotificationService,
    private changeDetector: ChangeDetectorRef,
    private profilePhotoService: ProfilePhotoService,
  ) { }

  ngOnInit(): void {
    this.navigation.showLoader();
    this.loadFormValues();
    this.loadAllSubcategories();
  }

  toggleGuidelines() {
    this.showGuidelines = !this.showGuidelines;
  }


  loadPortfolioImage(imageId: number, thumbnail: any, index: number) {
    this.viewImage = thumbnail;
    this.currentPortIndex = index;
    this.showPrevPic = true;
    this.showNextPic = true;
    if (this.currentPortIndex == 0) {
      this.showPrevPic = false;
    }
    if (this.currentPortIndex == this.portfolioImages.length - 1) {
      this.showNextPic = false;
    }
    // get full portfolio image 
    this.profilePhotoService.getFullPortImage(imageId).subscribe(
      (image) => {
        this.viewImage = image.picByte;
      }
    );
  }

  removePortPic() {
    const subscription = this.dialogService.openDialog(" delete current image", true).subscribe(
      (res) => {
        if (res) {
          const sub = this.profilePhotoService.removePortImage(this.portfolioImages[this.currentPortIndex].id).subscribe(
            () => {

              this.loadPortFolio();

              sub.unsubscribe();
            }
          );
        }
      }
    );
  }

  selectSlot(day: string) {
    this.selectedDay = day;
  }

  addSubHours(add: boolean) {
    if (add) {
      this.addServiceTimeHh = (this.addServiceTimeHh + 1) % 13
    } else {
      this.addServiceTimeHh = (this.addServiceTimeHh - 1) < 0 ? 12 : (this.addServiceTimeHh - 1);
    }
  }

  addSubMins(add: boolean) {
    if (add) {
      this.addServiceTimeMm = (this.addServiceTimeMm + 15) % 75
    } else {
      this.addServiceTimeMm = (this.addServiceTimeMm - 15) < 0 ? 60 : (this.addServiceTimeMm - 15);
    }
  }

  loadFormValues() {
    this.emailValue = this.keycloakService.getUsername();
    const sub = this.userService.getUserByEmail(this.emailValue).subscribe(
      (data) => {
        if (!(data.state == constants.ERROR_STATE)) {
          if (data.mobile != 0) {
            this.allowListing = true;

            this.subscription = this.listingService.getListingByEmail(this.emailValue).subscribe(
              (data) => {
                if (data.state == constants.SUCCESS_STATE) {
                  // Populate form from data
                  this.listing = data;
                  this.displayListing = JSON.parse(JSON.stringify(this.listing));
                  this.getAvailability(this.listing.id);
                  this.getUnavailabilityForProfessional();
                  this.loadServicePricings();
                  this.loadPortFolio();
                  this.getCertificationsByEmail();
                  this.currentListingEvent.emit(this.listing);
                  if(this.infoBox==1) {
                    this.infoBox=null!;
                  }
                } else {
                  if (this.infoBox == null) {
                    this.infoBox = 1;
                  }
                }

                this.navigation.pageLoaded();
                this.subscription.unsubscribe();
              }
            );

          } else {
            this.toastrService.info("Please complete your profile first.")
            if (this.infoBox == null) {
              this.infoBox = 0;
            }
          }
        }
        sub.unsubscribe();
      }
    );
  }

  getAvailability(listingId: number) {
    const subscription = this.listingService.getAvailabilityRange(listingId, true).subscribe(
      (data) => {
        let schedulePresent = false;
        this.availabilityRange = Object.keys(data).map((key: any) => {
          if ((data[key] as unknown as string).split(",")[1].split("-")[1]) {
            schedulePresent = true;
          }
          return {
            templateId: key,
            dayName: (data[key] as unknown as string).split(",")[0],
            startTimeHhmm: (data[key] as unknown as string).split(",")[1].split("-")[0],
            endTimeHhmm: (data[key] as unknown as string).split(",")[1].split("-")[1],
            enabled: JSON.parse((data[key] as unknown as string).split(",")[2])
          }
        });
        this.scheduleCompleteEvent.emit(schedulePresent);
        if (!schedulePresent) {
          if (this.infoBox == null) {
            this.infoBox = 4;
          }
        } else {
          if(this.infoBox==4) {
            this.infoBox=null!;
          }
        }
        subscription.unsubscribe();
      }
    );
  }

  setInfoBox() {

  }

  loadServicePricings() {
    const sub = this.listingService.getServicePricings(this.listing.id).subscribe(
      (response) => {
        this.servicePricings = response;
        if (this.servicePricings.length <= 0) {
          if (this.infoBox == null) {
            this.infoBox = 2;
          }
        } else {
          if(this.infoBox==2) {
            this.infoBox=null!;
          }
        }
        sub.unsubscribe();
      }
    );
  }

  loadPortFolio() {
    const sub = this.profilePhotoService.getPortImagesByListingId(this.listing.id).subscribe(
      (response) => {
        this.portfolioImages = response;
        this.portfolioImages.forEach((im) => {
          if (!im.approved && !im.rejected) {
            this.enablePortVerify = true;
          }
        });
        if (this.portfolioImages.length > 0) {
          this.portfolioCompleteEvent.emit(true);
        }
        this.reloadUploader();
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

  addUnavailabilityForProfessional(dates: Date[]) {
    const subscription = this.dialogService.openDialog(" mark selected date(s) as unavailable").subscribe(
      (res) => {
        if (res) {
          let items: any[] = [];
          dates.forEach((i: any) => {
            const item = {
              id: null,
              date: i
            }
            items.push(item);
          });

          const sub = this.listingService.addUnavailabilityForProfessional(items).subscribe(
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
      this.toastrService.error("Invalid Time Range");
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
      this.toastrService.error("Invalid Time Range");
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
    let certification = new Certification(null!, this.addCertName, false, null!, null!, null!, null!);
    const sub = this.userService.saveUserCertification(certification).subscribe(
      (response) => {
        this.getCertificationsByEmail();
        sub.unsubscribe();
      }
    );
    this.addCertName = '';
  }

  setEditServicePricing(id: number, serviceName: string, charges: number, addServiceTimeHh: number, addServiceTimeMm: number) {
    this.editServicePricingId = id;
    this.addServicePriceName = serviceName;
    this.addServicePriceCharges = charges;
    this.addServiceTimeHh = addServiceTimeHh;
    this.addServiceTimeMm = addServiceTimeMm;
    this.isServicePriceSelect = false;
  }

  saveServicePricing(createDup: boolean = false) {
    if (createDup) {
      this.editServicePricingId = null!;
    }
    let servicePricing = new ServicePricing(this.editServicePricingId, this.addServicePriceName, this.addServicePriceCharges, this.addServiceTimeHh, this.addServiceTimeMm, "", "");
    const sub = this.listingService.saveServicePricing(servicePricing, this.listing.id).subscribe(
      (response) => {
        this.loadFormValues();
        sub.unsubscribe();
      }
    );
    this.resetServicePriceDialog();
  }

  resetServicePriceDialog() {
    this.editServicePricingId = null!;
    this.addServicePriceName = "";
    this.addServicePriceCharges = null!;
    this.addServiceTimeHh = 0;
    this.addServiceTimeMm = 0;
    this.isServicePriceSelect = true;
  }

  removeServicePricing(id: number) {
    const subscription = this.dialogService.openDialog(" delete current pricing").subscribe(
      (response) => {
        if (response) {
          const sub = this.listingService.removeServicePricing(id).subscribe(
            (response) => {
              this.loadFormValues();
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

    uploadData.append('attachment ', file);

    const sub = this.fileService.uploadAttachment(uploadData, certId).subscribe(
      () => {
        this.getCertificationsByEmail();
        this.attachmentChangeEvt = null;

        //reset the file input after file upload
        const fileInput = <HTMLFormElement>document.getElementById("files");
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
      const sub = this.dialogService.openDialog("Only PDF and Image files allowed as attachment(s).", true, true).subscribe(
        () => {
          sub.unsubscribe();
        }
      );
    }
  }

  downloadAttachments(certificationId: number) {
    const sub = this.fileService.getAttachmentsForCertificate(certificationId).subscribe(
      (attachments) => {
        attachments.map(
          (a: any) => {
            this.fileService.downloadAttachment(a.attachmentByte, a.name, a.type);
          }
        );
        sub.unsubscribe();
      }
    );
  }

  resetSlotDialog() {
    this.dialogSlotTemplateEndTime = "";
    this.dialogSlotTemplateStartTime = "";
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
    this.listing.shortLocation = data.addressShort;
    this.listing.geoHash = data.geoHash;
    this.listing.latitude = data.latitude;
    this.listing.longitude = data.longitude;
  }

  getCertificationsByEmail() {
    const sub = this.userService.getCertificationsByEmail(this.keycloakService.getUsername()).subscribe(
      (certifications) => {
        this.certifications = certifications;
        if (this.certifications.length > 0) {
          this.documentsCompleteEvent.emit(true);
          if(this.infoBox==3) {
            this.infoBox=null!;
          }
        } else {
          this.toastrService.info("Please add your documents.");
          if (this.infoBox == null) {
            this.infoBox = 3;
          }
        }
        sub.unsubscribe();
      }
    );
  }

  setMenuItem(value: number) {
    this.menuItem = value;
    this.menuItemEvent.emit(value);
  }

  onClickSubmit() {
    if (this.listing.id != 0 && this.listing.subCategory.subCategoryName != this.displayListing.subCategory.subCategoryName) {
      this.dialogService.openDialog("Changing the speciality will deactivate the current listing and require reverification!<br>Are you sure you want to continue?", true, true)
        .subscribe((res) => {
          if (res) {
            this.updateListing();
          }
        });
    } else {
      this.updateListing();
    }

  }

  updateListing() {
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
      .openDialog("<b>NOTE</b>: <br>&bull; You are sending the certification for verification.<br>&bull; You will not be able to add/change its attachment(s).<br>&bull; Verifications can take upto 2 business days.", false, true).subscribe(
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

  requestVerification() {
    const subs = this.dialogService.openDialog("Please make sure all the <b>mandatory documents</b> have been verified using 'My Documents'.", true, true)
      .subscribe((resp) => {
        if (resp) {
          const subject = "Verification Request";
          const body = "Please verify listing for: " + this.keycloakService.getUsername() + ".";
          const sub = this.notificationService.sendFeedbackQuery(subject, body).subscribe(
            (res) => {
              if (res) {
                this.toastrService.success("Verification Request Sent")
              }
              sub.unsubscribe();
            }
          );
        }
        subs.unsubscribe();
      });
  }

  requestPortfolioVerification() {
    const subs = this.dialogService.openDialog(" send portfolio for verification", true, false)
      .subscribe((resp) => {
        if (resp) {
          const subject = "Portfolio Verification";
          const body = "Please verify portfolio for: " + this.keycloakService.getUsername() + ".";
          const sub = this.notificationService.sendFeedbackQuery(subject, body).subscribe(
            (res) => {
              if (res) {
                this.toastrService.success("Verification Request Sent")
              }
              sub.unsubscribe();
            }
          );
        }
        subs.unsubscribe();
      });
  }

  reloadUploader() {
    this.showUploader = false;
    this.changeDetector.detectChanges();
    this.showUploader = true;
  }

  loadEditPhotoModal() {
    this.profilePhotoService.emitLoadPhotoEditor(true);
  }

  prevPortPic() {
    this.currentPortIndex--;
    this.loadPortfolioImage(this.portfolioImages[this.currentPortIndex].id, this.portfolioImages[this.currentPortIndex].thumbnail, this.currentPortIndex);
  }

  nextPortPic() {
    this.currentPortIndex++;
    this.loadPortfolioImage(this.portfolioImages[this.currentPortIndex].id, this.portfolioImages[this.currentPortIndex].thumbnail, this.currentPortIndex);
  }

}
