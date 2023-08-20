import { Component, OnInit, Inject } from '@angular/core';
import { KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  userName: String = "";
  isAuthenticated: boolean = false;

  constructor(private keycloakService: KeycloakService) { }

  public async ngOnInit() {
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
    this.getUserDetails();
  }
  
  getUserDetails() {
    if(this.isAuthenticated) {
      this.userName = this.keycloakService.getUsername();
    }
  }

  logout() {
    this.keycloakService.logout();
  }

}
