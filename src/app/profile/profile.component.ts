import { Component, OnInit } from '@angular/core';
import {ProfileService} from "../service/service.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profilePicUrl: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.profilePic$.subscribe((picUrl) => {
      this.profilePicUrl = picUrl;
    });

    // Load from localStorage if not already loaded
    this.profileService.loadInitialProfilePic();
  }

  changeProfilePicture(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newProfilePicUrl = reader.result as string;
        this.profileService.updateProfilePic(newProfilePicUrl);
      };
      reader.readAsDataURL(file);
    }
  }
}
