import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  email: string = "";
  userProfile!: KeycloakProfile;
  isAuthenticated: boolean = false;

  constructor(private keycloakService: KeycloakService) { }

  public async ngOnInit() {
    this.isAuthenticated = await this.keycloakService.isLoggedIn();

    this.loadUserProfile();
  }

  loadUserProfile() {
    if(this.isAuthenticated) {
      this.keycloakService.loadUserProfile().then(
        (userProfile) => {
            this.userProfile = userProfile;
            this.email = this.userProfile.email!;
            console.log(this.userProfile)
        }
        );
    }
  }

  logout() {
    this.keycloakService.logout();
  }

}
