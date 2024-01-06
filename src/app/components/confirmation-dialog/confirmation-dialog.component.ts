import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
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
