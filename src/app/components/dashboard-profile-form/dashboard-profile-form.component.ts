import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ContactDetail } from 'src/app/common/contact-detail';
import { Customer } from 'src/app/common/customer';
import { FileHandle } from 'src/app/model/file-handle.model';
import { ListingService } from 'src/app/services/listing.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-profile-form',
  templateUrl: './dashboard-profile-form.component.html',
  styleUrls: ['./dashboard-profile-form.component.css']
})
export class DashboardProfileFormComponent implements OnInit {

  user: Customer = constants.DEFAULT_CUSTOMER;
  displayUser!: Customer;
  contactDetail: ContactDetail = constants.DEFAULT_CONTACT_DETAIL;
  displayContact!: ContactDetail;

  profilePhoto: any;
  genderValue: string = "";
  mobileValue: string = "";
  emailValue: string = "";
  languagesValue: string[] = [];
  availableLocations: string[] = [];
  availableLanguages: any = new Map([
    ["English", 0],
    ["French", 0],
    ["Mandarin", 0],
    ["Cantonese", 0],
    ["Punjabi", 0],
    ["Hindi", 0],
  ]);

  constructor(private router: Router,
    private keycloakService: KeycloakService,
    private userService: UserService,
    private listingService: ListingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadFormValues();
  }

  loadFormValues() {
    this.emailValue = this.keycloakService.getUsername();
    this.loadUserData();
    this.loadAvailableLocations();
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

          this.loadAvailableLanguages();
          this.loadContactDetails();

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
        this.displayContact = JSON.parse(JSON.stringify(this.contactDetail));
        contactSubscription.unsubscribe();
      }
    );
  }

  resetLanguages() {
    this.user.languages = [];
    this.loadAvailableLanguages();
  }

  loadAvailableLanguages() {
    const lan = this.user.languages;

    this.availableLanguages.set("English",lan&&lan.indexOf("English")>-1?1:0);
    this.availableLanguages.set("French",lan&&lan.indexOf("French")>-1?1:0);
    this.availableLanguages.set("Mandarin",lan&&lan.indexOf("Mandarin")>-1?1:0);
    this.availableLanguages.set("Cantonese",lan&&lan.indexOf("Cantonese")>-1?1:0);    
    this.availableLanguages.set("Punjabi",lan&&lan.indexOf("Punjabi")>-1?1:0);
    this.availableLanguages.set("Hindi",lan&&lan.indexOf("Hindi")>-1?1:0);

    if(this.availableLanguages.has("dummy")) {
      this.availableLanguages.delete("dummy");
    } else {
      this.availableLanguages.set("dummy",1);
    }
  }

  addLanguage(language: any) {
    this.user.languages = JSON.parse(JSON.stringify(this.user.languages));
    language.value = 1;
    this.user.languages.push(language.key);
  }

  editGender(gender: string) {
    this.user.gender = gender;
  }

  submitUserDetail() {
    const subscription = this.userService.saveUserData(this.user).subscribe(
      (data) => {
        this.loadUserData();

        this.sendToastrMessage(data);

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

  loadAvailableLocations() {
    this.listingService.getAllLocations().subscribe(
      (data) => {
        this.availableLocations = data;
      }
    );
  }

  setContactLocation(location: string) {
    this.contactDetail.city = location;
  }

  sendToastrMessage(data: any) {
    if (data.state == constants.SUCCESS_STATE) {
      this.toastr.success(constants.SUCCESS_STATE);
    } else {
      this.toastr.error(data.message);
    }
  }


}
