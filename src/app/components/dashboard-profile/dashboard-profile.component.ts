import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css']
})
export class DashboardProfileComponent {

  customerId: number=0;
  base64Image: any = '';

  updateCustomerId(customerId: number) {
    this.customerId = customerId;
  }

  updateProfilePhoto(base64Image: any) {
    this.base64Image = base64Image;
  }
}
