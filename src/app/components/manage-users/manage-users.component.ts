import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactDetail } from 'src/app/common/contact-detail';
import { Customer } from 'src/app/common/customer';
import { Listing } from 'src/app/common/listing';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { AdminService } from 'src/app/services/admin.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { constants } from 'src/environments/constants';
import { PhonePipe } from '../../pipes/phone-pipe';
import { SearchComponent } from '../search/search.component';
import { ServicePricing } from 'src/app/common/service-pricing';
import { ListingService } from 'src/app/services/listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Certification } from 'src/app/common/certification';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  standalone: true,
  imports: [SearchComponent, FormsModule, NgIf, NgFor, DecimalPipe, PhonePipe]
})
export class ManageUsersComponent implements OnInit {


  @Input() displayPersonalDetails: boolean = true;

  @Output() customerIdEvent = new EventEmitter<number>();

  user: Customer = constants.DEFAULT_CUSTOMER;
  displayUser!: Customer;
  displayListing!: Listing;
  contactDetail: ContactDetail = constants.DEFAULT_CONTACT_DETAIL;
  displayContact!: ContactDetail;

  profilePhoto!: ProfilePhoto;
  genderValue: string = "";
  mobileValue: string = "";
  languagesValue: string[] = [];
  certifications: Certification[] = [];
  availableLanguages: any = new Map([
    ["English", 0],
    ["French", 0],
    ["Mandarin", 0],
    ["Cantonese", 0],
    ["Punjabi", 0],
    ["Hindi", 0],
  ]);
  servicePricings: ServicePricing[] = [];

  profileFormDirty: boolean = false;
  profileFormValid: boolean = false;

  constructor(
    private profilePhotoService: ProfilePhotoService,
    private adminService: AdminService,
    private navigationService: NavigationService,
    private listingService: ListingService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
    const hasUser: boolean = this.route.snapshot.queryParamMap.has('userEmail');

    if (hasUser) {
      this.loadUserData(this.route.snapshot.queryParamMap.get('userEmail')!);
    }
  }

  prepareUrl(email: string) {
    this.router.navigate(['admin/manageUsers'], { queryParams: { 'userEmail': email } }).then(() => {
      window.location.reload();
    });;
  }


  loadUserData(email: string) {
    const subscription = this.adminService.getUserByEmail(email).subscribe(
      (data) => {
        if (data.state != constants.ERROR_STATE) {
          // Populate form from data
          this.user = data;

          if (this.user.languages[0] == "") {
            this.user.languages = [];
          }

          this.displayUser = JSON.parse(JSON.stringify(this.user));

          this.customerIdEvent.emit(this.user.id);
          this.loadContactDetails();
          this.loadListingDetails();
          this.loadProfilePhoto();
          this.getCertificationsByEmail();
        } else {
          // Set Default Values
          this.user.languages = [];
          this.user.gender = "";
        }
        subscription.unsubscribe();
      }
    );
  }

  loadContactDetails() {
    const contactSubscription = this.adminService.getContactDetailByUserId(this.user.id).subscribe(
      (contact) => {
        if (contact.state != constants.ERROR_STATE) {
          this.contactDetail = contact;
        } else {
          this.contactDetail = constants.DEFAULT_CONTACT_DETAIL;
        }
        if (this.contactDetail.addressLine3 != "") {
          this.displayContact = JSON.parse(JSON.stringify(this.contactDetail));
        }
        contactSubscription.unsubscribe();
      }
    );
  }

  loadProfilePhoto() {
    const subscription = this.profilePhotoService.getImageByCustomerId(this.user.id).subscribe(
      (image) => {
        if (image && image.state != constants.ERROR_STATE) {
          this.profilePhoto = image;
          this.profilePhoto.picByte = 'data:image/jpeg;base64,' + image.picByte;
          this.profilePhoto.thumbnail = 'data:image/jpeg;base64,' + image.thumbnail;
        }

        subscription.unsubscribe();
      }
    );
  }

  loadListingDetails() {
    const subscription = this.adminService.getListingForUser(this.user.email).subscribe(
      (data) => {
        if (data.state == constants.SUCCESS_STATE) {
          // Populate form from data
          this.displayListing = data;
          this.loadServicePricings();
        }

        subscription.unsubscribe();
      }
    );
  }

  loadServicePricings() {
    const sub = this.listingService.getServicePricings(this.displayListing.id).subscribe(
      (response) => {
        this.servicePricings = response;
        sub.unsubscribe();
      }
    );
  }

  setContactLocation(location: string) {
    this.contactDetail.addressLine3 = location;
  }

  locationSelectorOutput(data: any) {
    this.contactDetail.addressLine3 = data.address;
    this.contactDetail.geoHash = data.geoHash;
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  verifyCertificationById(certificationId: number) {
    const sub = this.adminService.verifyCertificationById(certificationId).subscribe(
      () => {
        this.getCertificationsByEmail();
        sub.unsubscribe();
      }
    );
  }

  rejectCertificationById(certificationId: number) {
    const sub = this.adminService.rejectCertificationById(certificationId).subscribe(
      () => {
        this.getCertificationsByEmail();
        sub.unsubscribe();
      }
    );
  }

  downloadAttachments(certificationId: number) {
    const sub = this.fileService.getAttachmentsForCertificate(certificationId).subscribe(
      (attachments) => {
        attachments.map(
          (a:any) => {
            this.fileService.downloadAttachment(a.attachmentByte, a.name, a.type);
          }
        );
        sub.unsubscribe();
      }
    );
  }

  getCertificationsByEmail() {
    const sub = this.userService.getCertificationsByEmail(this.user.email).subscribe(
      (certifications) => {
        this.certifications = certifications;
        sub.unsubscribe();
      }
    );
  }

  activateDeactivateListing() {
    if (this.displayListing) {
      const sub = this.adminService.activateInactivateListing(this.displayListing.id).subscribe(
        () => {
          this.loadListingDetails();
          sub.unsubscribe();
        }
      );
    }
  }

}
