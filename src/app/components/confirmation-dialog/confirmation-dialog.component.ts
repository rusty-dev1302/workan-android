import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  dialogMessage: string = "";

  constructor(
    private dialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.dialogService.getDialogMessage().subscribe(
      (message)=>{
        this.dialogMessage = message;
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
