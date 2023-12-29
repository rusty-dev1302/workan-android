import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { FileService } from 'src/app/services/file.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-manage-verifications',
  templateUrl: './manage-verifications.component.html',
  styleUrls: ['./manage-verifications.component.css']
})
export class ManageVerificationsComponent implements OnInit {

  verificationRequests: any[] = [];

  constructor(
    private navigationService: NavigationService,
    private adminService: AdminService,
    private fileService: FileService
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
      }
    );
  }

  downloadAttachments(attachments: any[]) {
    attachments.map(
      (a) => {
        this.fileService.downloadAttachment(a.attachmentByte, a.name, a.type);
      }
    );
  }

  activateDeactivateListing(listingId: number) {
    console.log(listingId)
    this.adminService.activateInactivateListing(listingId).subscribe(
      () => {
        this.getAllCertificationsToVerify();
      }
    );
  }

  verifyCertificationById(certificationId: number) {
    this.adminService.verifyCertificationById(certificationId).subscribe(
      () => {
        console.log(certificationId)
        this.getAllCertificationsToVerify();
      }
    );
  }

  rejectCertificationById(certificationId: number) {
    this.adminService.rejectCertificationById(certificationId).subscribe(
      () => {
        this.getAllCertificationsToVerify();
      }
    );
  }

}
