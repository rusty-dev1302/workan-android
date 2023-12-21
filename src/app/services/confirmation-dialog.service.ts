import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  private dialogOutput$ = new Subject<boolean>();

  constructor(private dialogRef: MatDialog) { }

  openDialog(){
    const modalDiv = document.getElementById("confirmationDialogModal");
    if(modalDiv!=null) {
      console.log(modalDiv)
      modalDiv.style.backdropFilter = 'brightness(60%)';
      modalDiv.classList.add("show");
      modalDiv.style.display = 'block';
    }
  }

  confirmDialog() {
    this.dialogOutput$.next(true);
  }

  cancelDialog() {
    const modalDiv = document.getElementById("confirmationDialogModal");
    if(modalDiv!=null) {
      console.log(modalDiv)
      modalDiv.style.backdropFilter = 'none';
      modalDiv.classList.remove("show");
      modalDiv.style.display = 'none';
    }
    this.dialogOutput$.next(false);
  }
}
