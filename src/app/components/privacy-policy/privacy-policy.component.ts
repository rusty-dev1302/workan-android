import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.css'],
    standalone: true
})
export class PrivacyPolicyComponent implements OnInit{
  constructor(
    private navigationService: NavigationService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }
}
