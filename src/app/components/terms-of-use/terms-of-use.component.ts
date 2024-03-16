import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-terms-of-use',
    templateUrl: './terms-of-use.component.html',
    styleUrls: ['./terms-of-use.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class TermsOfUseComponent implements OnInit{
  constructor(
    private navigationService: NavigationService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }
}
