import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unavailability-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unavailability-calendar.component.html',
  styleUrls: ['./unavailability-calendar.component.css']
})
export class UnavailabilityCalendarComponent {
}
