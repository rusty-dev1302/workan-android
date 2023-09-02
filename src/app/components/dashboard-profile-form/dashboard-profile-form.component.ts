import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { ContactDetail } from 'src/app/common/contact-detail';
import { Customer } from 'src/app/common/customer';
import { FileHandle } from 'src/app/model/file-handle.model';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-profile-form',
  templateUrl: './dashboard-profile-form.component.html',
  styleUrls: ['./dashboard-profile-form.component.css']
})
export class DashboardProfileFormComponent implements OnInit{

  isProfileEditable: boolean = false;
  isContactEditable: boolean = false;

  user: Customer = constants.DEFAULT_CUSTOMER;
  contactDetail: ContactDetail = constants.DEFAULT_CONTACT_DETAIL;

  profilePhoto: any;
  genderValue: string = "";
  mobileValue: string = "";
  emailValue: string = "";
  languagesValue: string[] = [];

  constructor(private router: Router,
    private keycloakService: KeycloakService,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.loadFormValues();
   }

  loadFormValues() {
    this.emailValue = this.keycloakService.getUsername();
    this.loadUserData();
  }

  loadUserData() {
    const subscription = this.userService.getUserByEmail(this.emailValue).subscribe(
      (data)=>{
        if(data.state!=constants.ERROR_STATE){
          // Populate form from data
          this.user = data;
          this.loadContactDetails();

        } else {
          // Set Default Values
          this.user.languages = [];
          this.user.gender = "";
          this.user = constants.DEFAULT_CUSTOMER;
        }
        subscription.unsubscribe();
      }
    );
    this.user.email = this.emailValue;
  }

  loadContactDetails() {
    const contactSubscription = this.userService.getContactDetailByUserId(this.user.id).subscribe(
      (contact) => {
        if(contact.state!=constants.ERROR_STATE){
          this.contactDetail = contact;
        } else {
          this.contactDetail = constants.DEFAULT_CONTACT_DETAIL;
        }
        contactSubscription.unsubscribe();
      }
    );
  }

  addLanguage(language: string) {
    if(language=="Clear All") {
      this.user.languages = [];
    } else {
      this.user.languages.push(language);
      this.user.languages = JSON.parse(JSON.stringify(this.user.languages));
    }
  }

  editGender(gender: string) {
    this.user.gender = gender;
  }

  submitUserDetail() {
    console.log(this.user);
    const subscription = this.userService.saveUserData(this.user).subscribe(
      (data)=>{

        this.isProfileEditable = false;
        this.loadUserData();

        subscription.unsubscribe();
      });
  }

  submitContactDetail() {
    this.contactDetail.customerId = this.user.id;
    const subscription = this.userService.saveUserContact(this.contactDetail).subscribe(
      (data)=>{

        this.isContactEditable = false;
        this.loadUserData();

        subscription.unsubscribe();
      });
  }

  toggleProfileEdit() {
    this.isProfileEditable = !this.isProfileEditable;
    if(!this.isProfileEditable) {
      this.loadFormValues();
      this.isProfileEditable=false;
    }
  }

  toggleContactEdit() {
    this.isContactEditable = !this.isContactEditable;
    if(!this.isContactEditable) {
      this.loadFormValues();
      this.isContactEditable=false;
    }
  }


}
