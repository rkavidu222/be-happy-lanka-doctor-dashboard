import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule

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
    // Load schedules from localStorage when the component initializes
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      this.schedules = JSON.parse(savedSchedules);
    }
  }

  // Function to handle date selection
  onDateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
  }

  // Function to handle start time selection
  onStartTimeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.startTime = input.value;
  }

  // Function to handle end time selection
  onEndTimeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.endTime = input.value;
  }

  // Function to schedule or update the appointment
  addSchedule(): void {
    if (this.selectedDate && this.startTime && this.endTime) {
      const newSchedule: Schedule = {
        date: this.selectedDate,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.editIndex !== null) {
        this.schedules[this.editIndex] = newSchedule; // Update the existing schedule
        this.message = `Schedule updated for ${this.selectedDate} from ${this.startTime} to ${this.endTime}.`;
        this.editIndex = null; // Reset edit mode after updating
      } else {
        this.schedules.push(newSchedule); // Add new schedule
        this.message = `Schedule added for ${this.selectedDate} from ${this.startTime} to ${this.endTime}.`;
      }
      this.resetInputs();
      this.sortSchedules(); // Sort schedules after adding or updating
      this.saveSchedulesToLocalStorage(); // Save schedules to localStorage
    } else {
      this.message = 'Please fill in all fields.';
    }
  }

  // Function to reset the form inputs
  resetInputs(): void {
    this.startTime = '';
    this.endTime = '';
  }

  // Function to remove a schedule
  removeSchedule(index: number): void {
    this.schedules.splice(index, 1);
    this.message = 'Schedule removed successfully.';
    this.sortSchedules(); // Re-sort after removal
    this.saveSchedulesToLocalStorage(); // Save updated schedules to localStorage
  }

  // Function to set up editing an existing schedule
editSchedule(index: number): void {
  const schedule = this.schedules[index];
  this.selectedDate = schedule.date;
  this.startTime = schedule.startTime;
  this.endTime = schedule.endTime;
  this.editIndex = index;  // Set the edit mode index
}


  // Function to sort schedules in ascending order by start time
  sortSchedules(): void {
    this.schedules.sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.startTime}`);
      const timeB = new Date(`${b.date}T${b.startTime}`);
      return timeA.getTime() - timeB.getTime();
    });
  }

  // Function to save schedules to localStorage
  saveSchedulesToLocalStorage(): void {
    localStorage.setItem('schedules', JSON.stringify(this.schedules));
  }
}
