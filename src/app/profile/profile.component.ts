import { Component, OnInit } from '@angular/core';
import { ProfileService } from "../service/service.component";
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule], // Add CommonModule here
})
export class ProfileComponent implements OnInit {
  profilePicUrl: string = '';
  passwordsMatch: boolean = false;
  passwordStrengthMessage: string = '';
  passwordErrorMessage: string = '';
  passwordVisible: boolean = false; // To toggle password visibility

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

  checkPasswordsMatch(): void {
    const newPassword = (document.getElementById('newPassword') as HTMLInputElement)?.value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement)?.value;

    if (newPassword === confirmPassword) {
      this.passwordsMatch = true;
      this.passwordErrorMessage = ''; // Clear any error if they match
    } else {
      this.passwordsMatch = false;
    }
  }

  checkPasswordStrength(): void {
    const newPassword = (document.getElementById('newPassword') as HTMLInputElement)?.value;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      this.passwordStrengthMessage = 'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.';
    } else {
      this.passwordStrengthMessage = '';
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible; // Toggle visibility state
  }

  validatePassword(): boolean {
    const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    const passwordError = document.getElementById('passwordError') as HTMLSpanElement;
    const passwordStrength = document.getElementById('passwordStrength') as HTMLDivElement;

    // Reset error messages
    if (passwordError) passwordError.textContent = '';
    if (passwordStrength) passwordStrength.textContent = '';

    const newPassword = newPasswordInput?.value;
    const confirmPassword = confirmPasswordInput?.value;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      if (passwordError) passwordError.textContent = 'Passwords do not match.';
      return false;
    }

    // Check password strength
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      if (passwordStrength) {
        passwordStrength.textContent =
          'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.';
      }
      return false;
    }

    // Password is valid
    alert('Password updated successfully!');
    return true;
  }
}
