import { Component, Input, OnInit } from '@angular/core';
import { constants } from 'src/environments/constants';
import { Customer } from 'src/app/common/customer';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';
import { ListingService } from 'src/app/services/listing.service';
import { OrderService } from 'src/app/services/order.service';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { CreateOrderRequest } from 'src/app/common/create-order-request';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, NgClass, DatePipe],
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  @Input()
  professionalView:boolean = false;

  @Input() 
  selectedOrderId: number = 0;

  @Input()
  selectedMenuItems: any[]=[];

  @Input()
  appointmentDate!: Date;

  @Input()
  preferredStartTimeHhmm!: number;

  @Input()
  preferredEndTimeHhmm!: number;

  totalMenuCharges: number = 0

  currentDate!: string;
  currentSlots!: any[];
  currentStep: number = 0;

  selectedDate!: Date;
  selectedSlot!: SlotTemplateItem;

  dayBoolArray: boolean[] = JSON.parse(JSON.stringify(constants.DAY_BOOL_ARRAY_INIT));

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
    this.getSlotsForDay(new Date(this.datePipe.transform(new Date(), "yyyy-mm-dd", "+0000")!), 0);
  }

  slotDate(index: number): Date {
    let date: Date = new Date(this.datePipe.transform(new Date(), "yyyy-mm-dd", "+0000")!);
    date.setDate(date.getDate() + index);

    return date;
  }

  dateDifference(d1: string, d2: string):any {
    if(d1<=d2) {
      return Math.floor((new Date(d2).getTime() - new Date(d2).getTime())/ (1000 * 60 * 60 * 24))
    }
    return 0;
  }

  getSlotsForDay(date: Date, i: number) {
    this.dayBoolArray = JSON.parse(JSON.stringify(constants.DAY_BOOL_ARRAY_CLEAR));
    this.dayBoolArray[i] = true;
    if (date) {
      this.selectedDate = date;
      this.currentDate = this.datePipe.transform(date, 'd MMM (EE)', '+0000')!;
      const sub = this.listingService.getAvailableSlotsItems(this.datePipe.transform(date, 'EEEE')!, this.datePipe.transform(date, 'yyyy-MM-dd')! + "T00:00:00.000000Z").subscribe(
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

  calculateTotalMenuCharges(items: any[]): number {
    this.totalMenuCharges = 0;
    items.forEach(
      (mi) => {
        if(mi.quantity==null) {
          mi.quantity=0;
        }
        this.totalMenuCharges += mi.quantity*mi.charges;
      }
    );
    return this.totalMenuCharges;
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

  previousStep() {
    this.currentStep--;
  }

  bookSlot() {
    let customer: Customer;

    const sub = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (data) => {
        customer = data;
       let createOrderRequest = new CreateOrderRequest(null!, null!, null!, null!, new Date(this.selectedDate), null!);
        const subscription = this.orderService.confirmOrderAppointment(this.selectedOrderId, this.selectedSlot.id, createOrderRequest!).subscribe(
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
