import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';


@Component({
  selector: 'app-select-map-location',
  templateUrl: './select-map-location.component.html',
  styleUrls: ['./select-map-location.component.css']
})
export class SelectMapLocationComponent implements OnInit {

  @ViewChild('originLocation')
  originLocation!: ElementRef;

  @ViewChild('displayMap')
  displayMap!: GoogleMap;


  myOptions = {
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
    }, // here´s the array of controls
    disableDefaultUI: true, // a way to quickly hide all controls
    scaleControl: true,

    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  autoComplete!: google.maps.places.Autocomplete;
  zoom: number = 15;
  fromLocation: string = "";
  currentLocationLatLng!: google.maps.LatLng;
  markerLocation!: google.maps.LatLng;

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.autoComplete = new google.maps.places.Autocomplete(this.originLocation.nativeElement);
    this.autoComplete.addListener('place_changed',
      () => {
        this.currentLocationLatLng = JSON.parse(JSON.stringify(this.autoComplete?.getPlace().geometry?.location!));
      }
    );
  }

  search() {
    this.markerLocation = JSON.parse(JSON.stringify(this.autoComplete?.getPlace().geometry?.location!));
  }

  centerChanged() {
    this.markerLocation = this.displayMap.getCenter()!;
  }
}
