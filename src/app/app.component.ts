import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from './services/navigation.service';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [LoadingScreenComponent, HeaderComponent, RouterOutlet, RouterLink, ConfirmationDialogComponent]
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
