import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestComponent } from './request/request.component';
import { ViewButtonComponent } from './view-button/view-button.component';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,  // Ensure AppComponent is standalone
  imports: [RouterOutlet, SidebarComponent, DashboardComponent, ProfileComponent, RequestComponent, NgIf, ViewButtonComponent,],  // Import standalone components here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'doctor_dashboard';
  isSidebarVisible = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Scroll to the top on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        window.scrollTo(0, 0);  // Scroll to the top of the page
      }
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }


}
