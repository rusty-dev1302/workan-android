import { Component, OnInit, Input } from '@angular/core';
import { DatePipe, NgIf, NgFor, NgClass } from '@angular/common';
import { ListingService } from 'src/app/services/listing.service';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';
import { OrderService } from 'src/app/services/order.service';
import { CreateOrderRequest } from 'src/app/common/create-order-request';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from 'src/app/services/user.service';
import { Customer } from 'src/app/common/customer';
import { ToastrService } from 'ngx-toastr';
import { constants } from 'src/environments/constants';
import { Router } from '@angular/router';
import { ContactDetail } from 'src/app/common/contact-detail';
import { FormsModule } from '@angular/forms';
import { DateTimeService } from 'src/app/common/services/date-time.service';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, NgClass, DatePipe]
})
export class SlotSelectorComponent implements OnInit {

  @Input()
  professionalView: boolean = false;

  currentDate!: string;
  currentTimeRange!: any;
  selectedTimeRange: any = {startTime:'', endTime:''}
  availableMenuItems!: any[];
  totalMenuCharges: number = 0;
  currentStep: number = 0;

  timeSlots: string[] = constants.TIMESLOTS;

  availabilityRange = new Map();

  selectedDate!: Date;
  selectedSlot: any={};

  selectedMenuItems: any[] = [];

  dayBoolArray: boolean[] = JSON.parse(JSON.stringify(constants.DAY_BOOL_ARRAY_INIT));

  @Input() listingId: number = 0;
  customerAddress!: ContactDetail;

  constructor(
    private datePipe: DatePipe,
    private listingService: ListingService,
    private orderService: OrderService,
    private keycloakService: KeycloakService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    public dateTimeService: DateTimeService
  ) {
  }

  ngOnInit(): void {
    this.getAvailability(this.listingId);
    this.loadCustomer();
  }

  getAvailability(listingId: number) {
    this.availabilityRange = new Map();
    const subscription = this.listingService.getAvailabilityRange(listingId).subscribe(
      (data) => {
        Object.keys(data).map((key: any) => {
          this.availabilityRange.set((data[key] as unknown as string).split(",")[0], (data[key] as unknown as string).split(",")[1]);
        });

        this.getSlotsForDay(new Date(), 0);
        subscription.unsubscribe();
      }
    );
  }

  slotDate(index: number): Date {
    let date: Date = new Date();
    date.setDate(date.getDate() + index);

    return date;
  }

  loadCustomer() {
    const sub = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (data) => {
        this.customerAddress = data.contact;
        sub.unsubscribe();
      }
    );

  }

  setDialogStartTime(startTime: string) {
    this.selectedTimeRange.startTime = startTime;
  }

  setDialogEndTime(endTime: string) {

    this.selectedTimeRange.endTime = endTime;
  }

  getSlotsForDay(date: Date, i: number) {
    this.selectedDate = date;
    this.currentTimeRange = null;
    this.dayBoolArray = JSON.parse(JSON.stringify(constants.DAY_BOOL_ARRAY_CLEAR));
    this.dayBoolArray[i] = true;
    this.currentDate = this.datePipe.transform(date, 'dd MMM (EEEE)')!;

    let day: string = this.datePipe.transform(date, 'EEEE')!;

    if (this.availabilityRange.get(day)) {
      this.currentTimeRange = {
        startTimeHhmm: this.availabilityRange.get(day).split("-")[0],
        endTimeHhmm: this.availabilityRange.get(day).split("-")[1]
      };
    } else {
      this.currentTimeRange = null;
    }

  }

  calculateTotalMenuCharges() {
    this.totalMenuCharges = 0;
    this.selectedMenuItems.forEach(
      (mi) => {
        if (mi.quantity == null) {
          mi.quantity = 0;
        }
        this.totalMenuCharges += mi.quantity * mi.charges;
      }
    );
  }

  loadServicePricings() {
    const sub = this.listingService.getServicePricings(this.listingId).subscribe(
      (response) => {
        this.availableMenuItems = response;
        this.selectedMenuItems = JSON.parse(JSON.stringify(this.availableMenuItems));
        sub.unsubscribe();
      }
    );
  }

  addMenuItem(i: number) {
    if (this.selectedMenuItems[i].quantity == null) {
      this.selectedMenuItems[i].quantity = 0;
    }
    this.selectedMenuItems[i].quantity = this.selectedMenuItems[i].quantity + 1;
    this.calculateTotalMenuCharges();
  }

  removeMenuItem(i: number) {
    if (this.selectedMenuItems[i].quantity == null) {
      this.selectedMenuItems[i].quantity = 0;
    }
    this.selectedMenuItems[i].quantity = this.selectedMenuItems[i].quantity == 0 ? 0 : (this.selectedMenuItems[i].quantity - 1);
    this.calculateTotalMenuCharges();
  }

  closeDialog() {
    this.selectedTimeRange = {startTime:'', endTime:''};
    this.currentStep = 0;
  }

  nextStep() {
    this.currentStep++;
    if (this.currentStep == 1) {
      this.loadServicePricings();
    }
  }

  previousStep() {
    this.currentStep--;
  }

  bookSlot() {
    let customer: Customer;

    const sub = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (data) => {
        customer = data;
        let createOrderRequest = new CreateOrderRequest(customer, this.listingId, this.dateTimeService.convertTimeToNumber(this.selectedTimeRange.startTime), this.dateTimeService.convertTimeToNumber(this.selectedTimeRange.endTime), new Date(this.selectedDate), this.selectedMenuItems);
        const subscription = this.orderService.createOrder(createOrderRequest).subscribe(
          (data) => {
            if (data.state == constants.SUCCESS_STATE) {
              this.toastr.success(data.state)
              this.router.navigateByUrl(`/dashboard/orders`);
            } else {
              this.toastr.error(data.message)
            }
            subscription.unsubscribe();
          }
        );
        sub.unsubscribe();
      }
    );
  }

  parseInt(input: string): number {
    const result:number = +input;
    return result;
  }

}
