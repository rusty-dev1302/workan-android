import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { constants } from 'src/environments/constants';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  private dialogOutput$ = new Subject<boolean>();
  private dialogMessage$ = new Subject<string>();

  constructor(private dialogRef: MatDialog) { }

  openDialog(message: string, overrideDefaultMessage:boolean=false): Observable<boolean> {

    this.dialogMessage$.next(overrideDefaultMessage?message:constants.CONFIRMATION_DIALOG_MESSAGE+message+"?");

    const modalDiv = document.getElementById("confirmationDialogModal");
    if (modalDiv != null) {
      modalDiv.style.backdropFilter = 'brightness(60%)';
      modalDiv.classList.add("show");
      modalDiv.style.display = 'block';
    }
    return this.dialogOutput$.asObservable();
  }

  confirmDialog() {
    this.closeWindow();
    this.dialogOutput$.next(true);
  }

  cancelDialog() {
    this.closeWindow();
    this.dialogOutput$.next(false);
  }

  private closeWindow() {
    const modalDiv = document.getElementById("confirmationDialogModal");
    if (modalDiv != null) {
      modalDiv.style.backdropFilter = 'none';
      modalDiv.classList.remove("show");
      modalDiv.style.display = 'none';
    }
  }

  getDialogMessage(): Observable<string> {
    return this.dialogMessage$.asObservable();
  }
}
