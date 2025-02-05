import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { Customer } from 'src/app/common/customer';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { FeedbackSupportComponent } from '../common/feedback-support/feedback-support.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink, FeedbackSupportComponent]
})
export class SidebarComponent implements OnInit {

  firstName: string = "";
  lastName: string = "";
  userProfile!: KeycloakProfile;
  isAuthenticated: boolean = false;
  currentUser!: Customer;
  profilePhoto!: ProfilePhoto;

  @Output()
  isProfessional = new EventEmitter<boolean>();

  constructor(private keycloakService: KeycloakService,
    private userService: UserService,
    private profilePhotoService: ProfilePhotoService,
    private toastr: ToastrService,
  ) { }

  public async ngOnInit() {
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
    this.userService.getCurrentUser().subscribe(
      (user) => {
        if (user.state == constants.SUCCESS_STATE) {
          this.currentUser = user;
          if(user.professional) {
            this.isProfessional.emit(true);
          } else {
            this.isProfessional.emit(false);
          }
          this.loadProfilePhoto();
          this.lowWalletWarning();
        }
      }
    );

    this.loadUserProfile();
  }

  lowWalletWarning() {
    if (this.currentUser.account.balance < 0) {
      this.toastr.warning("Low Wallet Balance");
    }
  }

  loadUserProfile() {
    if (this.isAuthenticated) {
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
        if (image && image.state != constants.ERROR_STATE) {
          this.profilePhoto = image;
          this.profilePhoto.picByte = 'data:image/jpeg;base64,' + image.picByte;
          this.profilePhoto.thumbnail = 'data:image/jpeg;base64,' + image.thumbnail;
        }

        subscription.unsubscribe();
      }
    );
  }

  openFeedback() {
    let element: HTMLElement = document.getElementById('feedbackSupportModalButton') as HTMLElement;
    element.click();
  }

  logout() {
    this.keycloakService.logout();
  }

}
