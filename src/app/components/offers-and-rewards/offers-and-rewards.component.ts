import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-offers-and-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers-and-rewards.component.html',
  styleUrls: ['./offers-and-rewards.component.css']
})
export class OffersAndRewardsComponent implements OnInit{

  user!: any;

  constructor(
    private navigationService: NavigationService,
    private userService: UserService,
    private keycloakService: KeycloakService

  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
    const sub = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        this.user = user;

        sub.unsubscribe();
      }
    );
    
  }



}
