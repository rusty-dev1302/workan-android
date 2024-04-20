import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-offers-and-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers-and-rewards.component.html',
  styleUrls: ['./offers-and-rewards.component.css']
})
export class OffersAndRewardsComponent implements OnInit{

  constructor(private navigationService: NavigationService) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

}
