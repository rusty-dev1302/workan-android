import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-manage-verifications',
  templateUrl: './manage-verifications.component.html',
  styleUrls: ['./manage-verifications.component.css']
})
export class ManageVerificationsComponent implements OnInit{

  constructor(private navigationService: NavigationService) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

}
