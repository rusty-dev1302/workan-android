import { Component, Input, OnInit } from '@angular/core';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { ProfilePhoto } from 'src/app/common/profile-photo';
import { ProfilePhotoService } from 'src/app/services/profile-photo.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.css']
})
export class PhotoUploaderComponent implements OnInit{

  @Input() customerId: number = 0;
  base64Data: any = '';


  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  selectedFile!:Blob;
  profilePhoto!: ProfilePhoto;

  constructor(
    private profilePhotoService: ProfilePhotoService
  ) { }

  ngOnInit() {
    this.profilePhotoService.loadPhotoEditor().subscribe(
      (update) => {
        console.log("Loading image")
        this.getImage();
      }
    );
  }

  public onFileChanged(event: any) {
    this.imgChangeEvt = event;
  }

  cropImg(e: ImageCroppedEvent) {
    console.log(e.blob)
    this.selectedFile = e.blob!;
  }

  //Gets called when the user clicks on retieve image button to get the image from back end
  getImage() {
    const subscription = this.profilePhotoService.getImageByCustomerId(this.customerId).subscribe(
      (image) => {
        this.base64Data = image.picByte;
        console.log("base64 data"+this.base64Data)
        this.profilePhoto = image;
        this.profilePhoto.picByte = 'data:image/jpeg;base64,' + image.picByte;

        subscription.unsubscribe();
      }
    );
  }

  //Gets called when the user clicks on submit to upload the image
  uploadPhoto() {

    let uploadImageData = new FormData();
    console.log("Selected File: "+this.selectedFile)
    uploadImageData.append('imageFile', this.selectedFile, ""+this.customerId);

    const subscription = this.profilePhotoService.uploadImage(uploadImageData).subscribe(
      (response) => {
        if(response.state!=constants.ERROR_STATE) {
          this.reloadCurrentPage();
        }
        subscription.unsubscribe();
      }
    );

  }

  reloadCurrentPage() {
    window.location.reload();
   }

}
