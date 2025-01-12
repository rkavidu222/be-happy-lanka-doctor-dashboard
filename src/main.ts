import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { ProfileComponent } from './app/profile/profile.component';
import { RequestComponent } from './app/request/request.component';
import { ViewButtonComponent } from './app/view-button/view-button.component';
import { ArticalComponent } from './app/artical/artical.component';
import { ScheduleComponent } from './app/schedule/schedule.component';


// Define your routes directly
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'request', component: RequestComponent },
  { path: 'view-button', component: ViewButtonComponent },
  { path: 'artical', component: ArticalComponent},
  { path: 'schedule', component: ScheduleComponent},
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)], // Use provideRouter to set up routing
});
