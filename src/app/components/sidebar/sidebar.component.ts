import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Customer } from 'src/app/common/customer';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  firstName: string = "";
  lastName: string = "";
  userProfile!: KeycloakProfile;
  isAuthenticated: boolean = false;
  currentUser!: Customer;
  profilePhoto!: ProfilePhoto;

  constructor(private keycloakService: KeycloakService,
              private userService: UserService,
              private profilePhotoService: ProfilePhotoService,
              ) { }

  public async ngOnInit() {
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
    const subscription = this.userService.getCurrentUser().subscribe(
      (user) => {
        if(user.state==constants.SUCCESS_STATE) {
          this.currentUser = user;
          this.loadProfilePhoto();
        }
        subscription.unsubscribe();
      }
    );

    this.loadUserProfile();
  }

  loadUserProfile() {
    if(this.isAuthenticated) {
      this.keycloakService.loadUserProfile().then(
        (userProfile) => {
            this.userProfile = userProfile;
            this.firstName = this.userProfile.firstName!;
            this.lastName = this.userProfile.lastName!;
        }
        );
    }
  }

  loadProfilePhoto() {
    const subscription = this.profilePhotoService.getImageByCustomerId(this.currentUser.id).subscribe(
      (image) => {
        if(image&&image.state!=constants.ERROR_STATE) {
          this.profilePhoto = image;
          this.profilePhoto.picByte = 'data:image/jpeg;base64,' + image.picByte;
        }
        
        subscription.unsubscribe();
      }
    );
  }

  logout() {
    this.keycloakService.logout();
  }

}
