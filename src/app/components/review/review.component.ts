import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Professional } from 'src/app/common/professional';
import { Review } from 'src/app/common/review';
import { OrderService } from 'src/app/services/order.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  @Input() professional!: Professional;
  @Input() orderId!: number;

  isAnonymous: boolean = false;
  content: string = "";
  rating: number = 5;

  constructor(
    private orderService: OrderService,
    private toastrService: ToastrService,
  ) {}

  setRating(rating: number) {
    this.rating = rating;
  }

  submitReview() {
    let customerName = this.isAnonymous?"ANONYMOUS":"";
    const subscription = this.orderService.writeReview(new Review(customerName, this.content, this.rating, this.professional, this.orderId, "", "")).subscribe(
      (response) => {
        if(response.state!=constants.ERROR_STATE) {
          this.toastrService.success("Review Submitted Successfully.");
        } else {
          this.toastrService.error(response.message);
        }
      }
    );
  }

}
