import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-view-button',
  standalone: true,
  imports: [RouterModule, FormsModule], // Import RouterModule here
  templateUrl: './view-button.component.html',
  styleUrls: ['./view-button.component.css']
})
export class ViewButtonComponent {
  action: string = '';        // For dropdown selection (Approve/Reject)
  date: string = '';          // For date input
  time: string = '';          // For time input
  description: string = '';   // For description textarea

  onSubmit() {
    console.log({
      action: this.action,
      date: this.date,
      time: this.time,
      description: this.description
    });
  }
}
