import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from './services/navigation.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-workan';
  isPageLoaded:boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private navigationService: NavigationService,
    private changeDetector: ChangeDetectorRef,
    private keycloakService: KeycloakService,
  ) {}

  async ngOnInit() {
    this.navigationService.isPageLoaded().subscribe(
      (response) => {
        this.isPageLoaded = response;
      }
    );
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
