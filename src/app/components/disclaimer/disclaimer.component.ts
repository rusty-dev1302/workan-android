import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent implements OnInit{
  constructor(
    private navigationService: NavigationService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }
}
