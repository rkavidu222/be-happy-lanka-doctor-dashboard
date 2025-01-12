import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profilePicSource = new BehaviorSubject<string>(
    'https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?uid=R151816673&ga=GA1.1.109421775.1731557596&semt=ais_hybrid'
  );
  profilePic$ = this.profilePicSource.asObservable();

  updateProfilePic(newPicUrl: string): void {
    this.profilePicSource.next(newPicUrl);
    localStorage.setItem('profilePicUrl', newPicUrl);
  }

  loadInitialProfilePic(): void {
    const storedPic = localStorage.getItem('profilePicUrl');
    if (storedPic) {
      this.profilePicSource.next(storedPic);
    }
  }
}
