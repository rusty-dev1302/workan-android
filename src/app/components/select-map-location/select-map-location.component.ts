import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import Geohash from 'latlon-geohash';


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

  @Input() headline: string = "";


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
        let lat = this.currentLocationLatLng?.lat();
        let lng = this.currentLocationLatLng?.lng();
        this.currentLocationLatLng = this.autoComplete?.getPlace().geometry?.location!;
        console.log('GeoHash', Geohash.encode(this.currentLocationLatLng.lat(), this.currentLocationLatLng.lng(), 8))
        // send upto 3 digit geohash to backend 
        console.log('Distance in KM', this.distanceBetweenTwoPlace(lat?lat:this.currentLocationLatLng.lat(), lng?lng:this.currentLocationLatLng.lng(), this.currentLocationLatLng.lat(), this.currentLocationLatLng.lng(), "K"))
      }
    );
  }

  search() {
    this.markerLocation = JSON.parse(JSON.stringify(this.autoComplete?.getPlace().geometry?.location!));
  }

  centerChanged() {
    this.markerLocation = this.displayMap.getCenter()!;
  }

  distanceBetweenTwoPlace(firstLat:number, firstLon:number, secondLat:number, secondLon:number, unit:string) {
    var firstRadlat = Math.PI * firstLat/180
    var secondRadlat = Math.PI * secondLat/180
    var theta = firstLon-secondLon;
    var radtheta = Math.PI * theta/180
    var distance = Math.sin(firstRadlat) * Math.sin(secondRadlat) + Math.cos(firstRadlat) * Math.cos(secondRadlat) * Math.cos(radtheta);
    if (distance > 1) {
        distance = 1;
    }
    distance = Math.acos(distance)
    distance = distance * 180/Math.PI
    distance = distance * 60 * 1.1515
    if (unit=="K") { distance = distance * 1.609344 }
    if (unit=="N") { distance = distance * 0.8684 }
    return distance
}
}
