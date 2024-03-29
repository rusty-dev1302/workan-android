import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class LandingPageComponent implements OnInit{

  constructor(
    private navigationService: NavigationService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

}
