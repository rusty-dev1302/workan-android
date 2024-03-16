import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css'],
    standalone: true,
    imports: [NgIf, RouterLink]
})
export class ConfirmationDialogComponent implements OnInit {

  dialogMessage: string = "";
  link:any;
  linkText:any;
  postMessage:any;

  constructor(
    private dialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.dialogService.getDialogMessage().subscribe(
      (response)=>{
        this.dialogMessage = response.message;
        this.link = response.link;
        this.linkText = response.linkText;
        this.postMessage = response.postMessage;
      }
    );
  }

  cancelDialog() {
    this.dialogService.cancelDialog();
  }

  confirmDialog() {
    this.dialogService.confirmDialog();
  }

}
