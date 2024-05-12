import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { DashboardProfileFormComponent } from '../dashboard-profile-form/dashboard-profile-form.component';
import { PhotoUploaderComponent } from '../photo-uploader/photo-uploader.component';

@Component({
    selector: 'app-dashboard-profile',
    templateUrl: './dashboard-profile.component.html',
    styleUrls: ['./dashboard-profile.component.css'],
    standalone: true,
    imports: [NgIf, PhotoUploaderComponent, DashboardProfileFormComponent]
})
export class DashboardProfileComponent implements OnInit{

  customerId: number=0;

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

  reloadUploader() {
    this.showUploader = false;
    this.changeDetector.detectChanges();
    this.showUploader = true;
  }
}
