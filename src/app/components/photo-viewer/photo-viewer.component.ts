import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.css']
})
export class PhotoViewerComponent {

  @Input() 
  image: any;

  @Input() 
  nextbtn: boolean = false;

  @Input() 
  prevbtn: boolean = false;

  @Output()
  prevPic = new EventEmitter<boolean>();

  @Output()
  nextPic = new EventEmitter<boolean>();

  @Output()
  removePic = new EventEmitter<boolean>();

  previous() {
    this.prevPic.next(true);
  }

  next() {
    this.nextPic.next(true);
  }

  remove() {
    this.removePic.next(true);
  }

}
