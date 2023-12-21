import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { ContactDetail } from 'src/app/common/contact-detail';
import { Customer } from 'src/app/common/customer';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { NavigationService } from 'src/app/services/navigation.service';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit{


  @Input() displayPersonalDetails: boolean = true;

  @Output() customerIdEvent = new EventEmitter<number>();

  user: Customer = constants.DEFAULT_CUSTOMER;
  displayUser!: Customer;
  contactDetail: ContactDetail = constants.DEFAULT_CONTACT_DETAIL;
  displayContact!: ContactDetail;

  profilePhoto!: ProfilePhoto;
  genderValue: string = "";
  mobileValue: string = "";
  emailValue: string = "";
  languagesValue: string[] = [];
  availableLanguages: any = new Map([
    ["English", 0],
    ["French", 0],
    ["Mandarin", 0],
    ["Cantonese", 0],
    ["Punjabi", 0],
    ["Hindi", 0],
  ]);

  profileFormDirty: boolean = false;
  profileFormValid: boolean = false;
  showActions: boolean = false;

  constructor(
    private profilePhotoService: ProfilePhotoService,
    private userService: UserService,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

  loadUserData(email: string) {
    const subscription = this.userService.getUserByEmail(email).subscribe(
      (data) => {
        if (data.state != constants.ERROR_STATE) {
          // Populate form from data
          this.user = data;

          if (this.user.languages[0] == "") {
            this.user.languages = [];
          }

          this.customerIdEvent.emit(this.user.id);
          this.loadContactDetails();
          this.loadProfilePhoto();

        } else {
          // Set Default Values
          this.user.languages = [];
          this.user.gender = "";
        }
        this.user.email = this.emailValue;
        this.displayUser = JSON.parse(JSON.stringify(this.user));
        subscription.unsubscribe();
      }
    );
  }

  loadContactDetails() {
    const contactSubscription = this.userService.getContactDetailByUserId(this.user.id).subscribe(
      (contact) => {
        if (contact.state != constants.ERROR_STATE) {
          this.contactDetail = contact;
        } else {
          this.contactDetail = constants.DEFAULT_CONTACT_DETAIL;
        }
        if (this.contactDetail.addressLine1 != "" && this.contactDetail.addressLine2 != "" && this.contactDetail.addressLine3 != "") {
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
        }

        subscription.unsubscribe();
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

  toggleTabs() {
    this.showActions = !this.showActions;
  }

}
