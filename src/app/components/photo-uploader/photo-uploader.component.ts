import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.css'],
  standalone: true,
  imports: [NgIf, ImageCropperModule, NgClass]
})
export class PhotoUploaderComponent implements OnInit {

  @Input() customerId: number = 0;
  @Input() listingId: number = 0;
  @Output() reloadEvent = new EventEmitter<boolean>();
  @Output() reloadPortfolio = new EventEmitter<boolean>();
  base64Data: any = '';


  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  selectedFile!: Blob;
  profilePhoto!: ProfilePhoto;

  constructor(
    private profilePhotoService: ProfilePhotoService
  ) { }

  ngOnInit() {
    const sub = this.profilePhotoService.loadPhotoEditor().subscribe(
      (update) => {
        this.getImage();
        sub.unsubscribe();
      }
    );
  }

  public onFileChanged(event: any) {
    this.imgChangeEvt = event;
  }

  cropImg(e: ImageCroppedEvent) {
    this.selectedFile = e.blob!;
  }

  //Gets called when the user clicks on retieve image button to get the image from back end
  getImage() {
    //check if photo uploader or portfolio
    if (this.customerId > 0) {
      const subscription = this.profilePhotoService.getImageByCustomerId(this.customerId, true).subscribe(
        (image) => {
          if (image && image.state != constants.ERROR_STATE) {
            this.base64Data = image.picByte;
            this.profilePhoto = image;
            this.profilePhoto.picByte = 'data:image/jpeg;base64,' + image.picByte;
          }

          subscription.unsubscribe();
        }
      );
    } else if (this.listingId > 0) {

    }

  }

  //Gets called when the user clicks on submit to upload the image
  uploadPhoto() {

    let uploadImageData = new FormData();

    //check if photo uploader or portfolio
    if (this.customerId > 0) {
      uploadImageData.append('imageFile', this.selectedFile, "" + this.customerId);

      const subscription = this.profilePhotoService.uploadImage(uploadImageData).subscribe(
        (response) => {
          if (response.state != constants.ERROR_STATE) {
            this.reloadCurrentPage();
          }
          subscription.unsubscribe();
        }
      );
    } else if (this.listingId > 0) {
      console.log(this.listingId);
      uploadImageData.append('imageFile', this.selectedFile);

      const subscription = this.profilePhotoService.uploadPortImage(uploadImageData).subscribe(
        (response) => {
          this.reloadPortfolio.emit(true);
          subscription.unsubscribe();
        }
      );
    }

  }

  removePhoto() {
    const subscription = this.profilePhotoService.removeImage().subscribe(
      (response) => {
        if (response.state != constants.ERROR_STATE) {
          this.reloadCurrentPage();
        }
        subscription.unsubscribe();
      }
    );
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  reloadComponent() {
    this.reloadEvent.emit(true);
  }

}
