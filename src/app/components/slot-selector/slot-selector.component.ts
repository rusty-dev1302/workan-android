import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css']
})
export class SlotSelectorComponent implements OnInit {

  @Input()
  professionalView:boolean = false;

  currentDate!: string;
  currentSlots!: any[];
  currentStep: number = 0;

  selectedDate!: Date;
  selectedSlot!: SlotTemplateItem;

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
  ) {
  }

  ngOnInit(): void {
    this.getSlotsForDay(new Date(), 0);
    this.loadCustomer();
  }

  slotDate(index: number): Date {
    let date: Date = new Date();
    date.setDate(date.getDate() + index);

    return date;
  }

  loadCustomer() {
    const sub = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (data) => {
        console.log(data.contact)
        this.customerAddress = data.contact;
        sub.unsubscribe();
      }
    );

  }

  getSlotsForDay(date: Date, i: number) {
    this.dayBoolArray = JSON.parse(JSON.stringify(constants.DAY_BOOL_ARRAY_CLEAR));
    this.dayBoolArray[i] = true;
    if (date) {
      this.selectedDate = date;
      this.currentDate = this.datePipe.transform(date, 'd MMM (EE)')!;
      const sub = this.listingService.getAvailableSlotsItems(this.listingId, this.datePipe.transform(date, 'EEEE')!, this.datePipe.transform(date, 'yyyy-MM-dd')! + "T00:00:00.000000Z").subscribe(
        (data) => {
          if (data) {
            this.currentSlots = data;

            const todayDate = new Date().getDate();

            //Filter slots starting after current time
            if (todayDate == date.getDate()) {
              const todayTime = this.datePipe.transform(new Date(), 'HHmm');
              this.currentSlots = this.currentSlots.filter(
                a => a.startTimeHhmm > +todayTime!
              );
            }

            this.currentSlots.sort(
              (a, b) => {
                return a.startTimeHhmm - b.startTimeHhmm;
              }
            );

          }
          sub.unsubscribe();
        }
      );
    }
  }

  convertTimeToString(time: number): string {
    let hour = Math.floor(time / 100) <= 12 ? Math.floor(time / 100) : Math.floor(time / 100) % 12;
    let min = (time % 100 == 0 ? "00" : time % 100);
    let merd = (Math.floor(time / 100) < 12 ? "AM" : "PM");

    return (hour == 0 ? "00" : hour) + ":" + min + merd;
  }

  selectSlot(slot: SlotTemplateItem) {
    this.selectedSlot = slot;
  }

  closeDialog() {
    this.selectedSlot = null!;
    this.currentStep = 0;
  }

  nextStep() {
    this.currentStep++;
  }

  bookSlot() {
    let customer: Customer;

    const sub = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (data) => {
        customer = data;
        console.log(data)
        let createOrderRequest = new CreateOrderRequest(customer, this.selectedSlot.id, new Date(this.selectedDate));
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

}
