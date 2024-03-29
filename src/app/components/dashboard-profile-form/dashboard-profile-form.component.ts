import { KeyValuePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { ContactDetail } from 'src/app/common/contact-detail';
import { Customer } from 'src/app/common/customer';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { NavigationService } from 'src/app/services/navigation.service';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { PhonePipe } from '../../pipes/phone-pipe';
import { SelectMapLocationComponent } from '../select-map-location/select-map-location.component';

@Component({
    selector: 'app-dashboard-profile-form',
    templateUrl: './dashboard-profile-form.component.html',
    styleUrls: ['./dashboard-profile-form.component.css'],
    standalone: true,
    imports: [NgIf, FormsModule, NgFor, NgClass, SelectMapLocationComponent, KeyValuePipe, PhonePipe]
})
export class DashboardProfileFormComponent implements OnInit {

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

  constructor(
    private keycloakService: KeycloakService,
    private profilePhotoService: ProfilePhotoService,
    private userService: UserService,
    private toastr: ToastrService,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.loadFormValues();
  }

  profileFormChanged() {
    this.validateUserDetail();
    this.profileFormDirty = true;
  }

  loadFormValues() {
    this.emailValue = this.keycloakService.getUsername();
    this.loadUserData();
  }

  loadUserData() {
    const subscription = this.userService.getUserByEmail(this.emailValue).subscribe(
      (data) => {
        if (data.state != constants.ERROR_STATE) {
          // Populate form from data
          this.user = data;

          if (this.user.languages[0] == "") {
            this.user.languages = [];
          }

          this.customerIdEvent.emit(this.user.id);
          this.loadAvailableLanguages();
          this.loadContactDetails();
          this.loadProfilePhoto();

        } else {
          // Set Default Values
          this.user.languages = [];
          this.user.gender = "";
        }
        this.user.email = this.emailValue;
        this.displayUser = JSON.parse(JSON.stringify(this.user));
        if (this.displayUser.firstName!=""&&this.displayUser.gender == "") {
          if (this.displayPersonalDetails) {
            this.toastr.info("Please complete your profile.");
          }
        }
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
        if (this.contactDetail.addressLine3 != "") {
          this.displayContact = JSON.parse(JSON.stringify(this.contactDetail));
        } else {
          if (!this.displayPersonalDetails) {
            this.toastr.info("Please complete your address.");
          }
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

        this.navigationService.pageLoaded();

        subscription.unsubscribe();
      }
    );
  }

  loadEditPhotoModal() {
    this.profilePhotoService.emitLoadPhotoEditor(true);
  }

  resetLanguages() {
    this.user.languages = [];
    this.loadAvailableLanguages();
    this.profileFormChanged();
  }

  resetMobile() {
    this.user.mobile=null!;
  }

  loadAvailableLanguages() {
    const lan = this.user.languages;

    this.availableLanguages.set("English", lan && lan.indexOf("English") > -1 ? 1 : 0);
    this.availableLanguages.set("French", lan && lan.indexOf("French") > -1 ? 1 : 0);
    this.availableLanguages.set("Mandarin", lan && lan.indexOf("Mandarin") > -1 ? 1 : 0);
    this.availableLanguages.set("Cantonese", lan && lan.indexOf("Cantonese") > -1 ? 1 : 0);
    this.availableLanguages.set("Punjabi", lan && lan.indexOf("Punjabi") > -1 ? 1 : 0);
    this.availableLanguages.set("Hindi", lan && lan.indexOf("Hindi") > -1 ? 1 : 0);

    if (this.availableLanguages.has("dummy")) {
      this.availableLanguages.delete("dummy");
    } else {
      this.availableLanguages.set("dummy", 1);
    }
  }

  addLanguage(language: any) {
    this.user.languages = JSON.parse(JSON.stringify(this.user.languages));
    language.value = 1;
    this.user.languages.push(language.key);
    this.profileFormChanged();
  }

  editGender(gender: string) {
    this.user.gender = gender;
    this.profileFormChanged();
  }

  validateUserDetail() {
    if (this.user.firstName == ""
      || this.user.lastName == ""
      || this.user.gender == ""
      || this.user.languages.length < 1
    ) {
      this.profileFormValid = false;
    }
    else {
      this.profileFormValid = true;
    }
  }

  submitUserDetail() {
    const subscription = this.userService.saveUserData(this.user).subscribe(
      (data) => {
        this.reloadCurrentPage();
        subscription.unsubscribe();
      });
  }

  submitContactDetail() {
    this.contactDetail.customerId = this.user.id;
    const subscription = this.userService.saveUserContact(this.contactDetail).subscribe(
      (data) => {
        this.loadUserData();

        this.sendToastrMessage(data);

        subscription.unsubscribe();
      });
  }

  setContactLocation(location: string) {
    this.contactDetail.addressLine3 = location;
  }

  sendToastrMessage(data: any) {
    if (data.state == constants.SUCCESS_STATE) {
      this.toastr.success(constants.SUCCESS_STATE);
    } else {
      this.toastr.error(data.message);
    }
  }

  locationSelectorOutput(data: any) {
    this.contactDetail.addressLine3 = data.address;
    this.contactDetail.geoHash = data.geoHash;
  }

  reloadCurrentPage() {
    window.location.reload();
  }

}
