import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {ProfileService} from "../service/service.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterModule, CommonModule],
})
export class SidebarComponent implements OnInit {
  isSidebarOpen = window.innerWidth > 768;
  profilePicUrl: string = '';

  constructor(private router: Router, private profileService: ProfileService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && window.innerWidth <= 768) {
        this.isSidebarOpen = false;
      }
    });
  }

  ngOnInit(): void {
    this.profileService.profilePic$.subscribe((picUrl) => {
      this.profilePicUrl = picUrl;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }
}
