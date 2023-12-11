import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit{

  constructor(private navigationService: NavigationService) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
  }

}
