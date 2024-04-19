import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { KeycloakService } from 'keycloak-angular';
import Geohash from 'latlon-geohash';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-select-map-location',
  templateUrl: './select-map-location.component.html',
  styleUrls: ['./select-map-location.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class SelectMapLocationComponent implements OnInit {

  @ViewChild('originLocation')
  originLocation!: ElementRef;

  @ViewChild('displayMap')
  displayMap!: GoogleMap;

  @Input() headline: string = "";
  @Input() isFilter: boolean = false;
  @Input() initialValue: string = "";
  @Output() outputEvent = new EventEmitter<{ address: string, geoHash: string, latitude: number, longitude: number } | any>();
  @Output() averageDistanceEvent = new EventEmitter<{ distance: number } | any>();


  @Input()
  distance: number = 10;

  distanceString(distance: number) {
    this.averageDistanceEvent.emit(distance);
    return distance + "km";
  }

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

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit() {
    this.autoComplete = new google.maps.places.Autocomplete(this.originLocation.nativeElement);
    this.autoComplete.addListener('place_changed',
      () => {
        this.currentLocationLatLng = this.autoComplete?.getPlace().geometry?.location!;

        let output: any = {};

        output["address"] = this.autoComplete?.getPlace().formatted_address;
        output["geoHash"] = Geohash.encode(this.currentLocationLatLng.lat(), this.currentLocationLatLng.lng(), 8);
        output["latitude"] = this.currentLocationLatLng.lat();
        output["longitude"] = this.currentLocationLatLng.lng();

        this.outputEvent.emit(output);
      }
    );
  }

  valueChanged() {
    if (this.initialValue == '') {
      let output: any = {};
      output["address"] = "";
      output["geoHash"] = "";
      output["latitude"] = 0;
      output["longitude"] = 0;
      this.outputEvent.emit(output);
    }
  }

  getMyAddress() {
    const sub = this.userService.getContactDetailByEmail(this.keycloakService.getUsername()).subscribe(
      (data) => {
        if (data && data.geoHash) {
          let output: any = {};
          output["address"] = data.addressLine3;
          output["geoHash"] = data.geoHash;
          output["latitude"] = data.latitude;
          output["longitude"] = data.longitude;
          this.outputEvent.emit(output);
          sub.unsubscribe();
        } else {
          this.toastr.info("Please update your address.")
        }
      }
    );
  }
}
