import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { CreateOrderRequest } from 'src/app/common/create-order-request';
import { Customer } from 'src/app/common/customer';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';
import { ListingService } from 'src/app/services/listing.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, NgClass, DatePipe],
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit{

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

  currentDate: string="Select a date";
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
  }

  slotDate(index: number): Date {
    let date: Date = this.dateTimeService.truncateTimezone(new Date());
    date.setDate(date.getDate() + (index+1));

    return date;
  }

  getSlotsForDay(date: Date, i: number) {
    this.dayBoolArray = JSON.parse(JSON.stringify(constants.DAY_BOOL_ARRAY_CLEAR));
    this.dayBoolArray[i] = true;
    if (date) {
      this.selectedDate = date;
      this.currentDate = this.datePipe.transform(date, 'd MMM (EE)')!;
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
      this.selectedDate = this.dateTimeService.truncateTimezone(new Date(this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')!))
       let createOrderRequest = new CreateOrderRequest(null!, null!, null!, null!, this.dateTimeService.truncateTimezone(this.selectedDate), null!);
       console.log()
        const subscription = this.orderService.confirmOrderAppointment(this.selectedOrderId, this.selectedSlot.id, createOrderRequest!).subscribe(
          (data) => {
            if (data.state == constants.SUCCESS_STATE) {
              this.toastr.success(data.state)
              this.router.navigateByUrl(`/dashboard/myorders`);
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
