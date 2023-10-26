import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { ContactDetail } from 'src/app/common/contact-detail';
import { Customer } from 'src/app/common/customer';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { ListingService } from 'src/app/services/listing.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-profile-form',
  templateUrl: './dashboard-profile-form.component.html',
  styleUrls: ['./dashboard-profile-form.component.css']
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
        if (this.displayUser.gender == "") {
          this.toastr.info("Please complete your profile.");
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
    console.log(this.user.languages);
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
    if(data==""){
      this.contactDetail.addressLine3=""
    }
    this.contactDetail.addressLine3 = data.address;
    this.contactDetail.geoHash = data.geoHash;
  }

  reloadCurrentPage() {
    window.location.reload();
  }

}
