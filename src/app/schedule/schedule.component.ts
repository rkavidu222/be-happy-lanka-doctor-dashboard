import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  selectedDate: string = '';
  startTime: string = '';
  endTime: string = '';
  schedules: Schedule[] = [];
  message: string = '';
  editIndex: number | null = null;

  constructor() {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const savedSchedules = localStorage.getItem('schedules');
      if (savedSchedules) {
        try {
          this.schedules = JSON.parse(savedSchedules);
        } catch {
          this.schedules = [];
          this.message = 'Failed to load saved schedules.';
        }
      }
    } else {
      this.message = 'LocalStorage is not available.';
    }
  }

  // Add or update schedule
  addSchedule(): void {
    if (this.selectedDate && this.startTime && this.endTime) {
      if (this.startTime >= this.endTime) {
        this.message = 'Start time must be earlier than end time.';
        this.clearMessageAfterDelay();
        return;
      }

      const newSchedule: Schedule = {
        date: this.selectedDate,
        startTime: this.startTime,
        endTime: this.endTime,
      };

      // Check for time conflicts
      if (this.hasTimeConflict(newSchedule)) {
        this.message = 'This schedule conflicts with an existing one.';
        this.clearMessageAfterDelay();
        return;
      }

      if (this.editIndex !== null) {
        this.schedules[this.editIndex] = newSchedule;
        this.message = 'Schedule updated successfully!';
        this.clearMessageAfterDelay();
        this.editIndex = null;
      } else {
        this.schedules.push(newSchedule);
        this.message = 'Schedule added successfully!';
        this.clearMessageAfterDelay();
      }

      this.resetInputs();
      this.sortSchedules();
      this.saveSchedulesToLocalStorage();
    } else {
      this.message = 'Please fill in all fields.';
      this.clearMessageAfterDelay();
    }
  }

  // Check for conflicts with existing schedules
  hasTimeConflict(newSchedule: Schedule): boolean {
    return this.schedules.some((schedule, index) => {
      if (this.editIndex === index) return false; // Skip the current editing schedule
      if (schedule.date !== newSchedule.date) return false;
      return (
        (newSchedule.startTime >= schedule.startTime &&
          newSchedule.startTime < schedule.endTime) ||
        (newSchedule.endTime > schedule.startTime &&
          newSchedule.endTime <= schedule.endTime)
      );
    });
  }

  // Remove schedule
  removeSchedule(index: number): void {
    this.schedules.splice(index, 1);
    this.message = 'Schedule removed successfully!';
    this.clearMessageAfterDelay();
    this.sortSchedules();
    this.saveSchedulesToLocalStorage();
  }

  // Edit schedule
  editSchedule(index: number): void {
    const schedule = this.schedules[index];
    this.selectedDate = schedule.date;
    this.startTime = schedule.startTime;
    this.endTime = schedule.endTime;
    this.editIndex = index;
  }

  // Reset inputs
  resetInputs(): void {
    this.selectedDate = '';
    this.startTime = '';
    this.endTime = '';
  }

  // Sort schedules by date and time
  sortSchedules(): void {
    this.schedules.sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.startTime}`).getTime();
      const timeB = new Date(`${b.date}T${b.startTime}`).getTime();
      return timeA - timeB;
    });
  }

  // Save schedules to localStorage
  saveSchedulesToLocalStorage(): void {
    localStorage.setItem('schedules', JSON.stringify(this.schedules));
  }

  // Clear message after 3 seconds
  clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.message = '';
    }, 3000); // Message will disappear after 3 seconds
  }
}
