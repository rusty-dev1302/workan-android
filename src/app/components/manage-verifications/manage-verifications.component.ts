import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    selector: 'app-manage-verifications',
    templateUrl: './manage-verifications.component.html',
    styleUrls: ['./manage-verifications.component.css'],
    standalone: true,
    imports: [NgFor, NgIf, NgClass]
})
export class ManageVerificationsComponent implements OnInit {

  verificationRequests: any[] = [];
  verifyPressed:boolean = false;
  rejectPressed:boolean = false;

  constructor(
    private navigationService: NavigationService,
    private adminService: AdminService,
  ) {

  }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
    this.getAllCertificationsToVerify();
  }

  getAllCertificationsToVerify() {
    const sub = this.adminService.getAllCertificationsToVerify().subscribe(
      (response) => {
        this.verificationRequests = response;
        sub.unsubscribe();
      }
    );
  }

}
