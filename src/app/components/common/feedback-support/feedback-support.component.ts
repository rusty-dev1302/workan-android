import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-feedback-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-support.component.html',
  styleUrls: ['./feedback-support.component.css']
})
export class FeedbackSupportComponent {

  subject:string = "Customer Feedback";
  content: string = "";

  constructor(private notificationService: NotificationService) {}

  selectSubject(subject: string) {
    this.subject = subject;
  }

  resetFields() {
    this.subject = "Customer Feedback";
    this.content = "";
  }

  submit() {
    this.notificationService.sendFeedbackQuery(this.subject, this.content);
  }
}
