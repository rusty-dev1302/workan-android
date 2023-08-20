import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
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

  subscription!: Subscription;

  isEditable: boolean = false;

  user: Customer = constants.DEFAULT_CUSTOMER;

  profilePhoto: any;
  firstNameValue: string = "";
  lastNameValue: string = "";
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

    this.subscription = this.userService.getUserByEmail(this.emailValue).subscribe(
      (data)=>{
        if(data!=null){
          // Populate form from data
          this.user = data;
        } else {
          // Set Default Values
          this.user.languages = [];
          this.user.gender = "";
          this.user = constants.DEFAULT_CUSTOMER;
          this.user.email = this.emailValue;
        }
        this.subscription.unsubscribe();
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

  onClickSubmit() {
    this.userService.saveUserData(this.user).subscribe(
      (data)=>{
        this.user = data;
        this.isEditable = false;
      });
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if(!this.isEditable) {
      this.loadFormValues();
      this.isEditable=false;
    }
  }


}
