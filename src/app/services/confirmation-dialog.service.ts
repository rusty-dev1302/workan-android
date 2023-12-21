import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  private dialogOutput$ = new Subject<boolean>();

  constructor(private dialogRef: MatDialog) { }

  openDialog(): Observable<boolean> {
    const modalDiv = document.getElementById("confirmationDialogModal");
    if (modalDiv != null) {
      console.log(modalDiv)
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
}
