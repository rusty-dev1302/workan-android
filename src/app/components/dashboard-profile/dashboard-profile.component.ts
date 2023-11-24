import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css']
})
export class DashboardProfileComponent implements OnInit{

  customerId: number=0;
  base64Image: any = '';

  showUploader:boolean = true;

  constructor(
    private navigationService: NavigationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.navigationService.showLoader();
  }

  updateCustomerId(customerId: number) {
    this.customerId = customerId;
  }

  updateProfilePhoto(base64Image: any) {
    this.base64Image = base64Image;
  }

  reloadUploader() {
    this.showUploader = false;
    this.changeDetector.detectChanges();
    this.showUploader = true;
  }
}
