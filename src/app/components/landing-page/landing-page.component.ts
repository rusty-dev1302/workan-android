import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class LandingPageComponent implements OnInit{

  constructor(
    private navigationService: NavigationService,
    private dialogService: ConfirmationDialogService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

  displayDemo() {
    this.dialogService.openDialog("We are yet to get LIVE!",true);
  }

}
