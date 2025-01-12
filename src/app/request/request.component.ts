import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {
  constructor(private router: Router) {}

  navigateToViewButton() {
    this.router.navigate(['/view-button']);  // Navigate to the view-button route
  }
}
