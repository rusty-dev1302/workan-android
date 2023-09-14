import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Customer } from 'src/app/common/customer';
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

  constructor(private keycloakService: KeycloakService,
              private userService: UserService
              ) { }

  public async ngOnInit() {
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
    this.userService.getCurrentUser().subscribe(
      (user) => {
        if(user.state==constants.SUCCESS_STATE) {
          this.currentUser = user;
        }
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

  logout() {
    this.keycloakService.logout();
  }

}
