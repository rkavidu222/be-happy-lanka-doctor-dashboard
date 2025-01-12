import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule],  // Add CommonModule explicitly here
})
export class DashboardComponent {
  constructor(private router: Router) {}

  // Navigation methods
  onTotalPatientsClick() {
    console.log('Total Registered Patients button clicked');
    this.router.navigate(['/total-patients']);
  }

  onNewRequestsClick() {
    console.log('New Patient Requests button clicked');
    this.router.navigate(['/new-requests']);
  }

  onApprovedRequestsClick() {
    console.log('Approved Requests button clicked');
    this.router.navigate(['/approved-requests']);
  }

  onRejectedRequestsClick() {
    console.log('Rejected Requests button clicked');
    this.router.navigate(['/rejected-requests']);
  }

  navigateToViewButton() {
    this.router.navigate(['/view-button']);
  }

  navigateToWriteArticle() {
    this.router.navigate(['/artical']); // Update the route to your desired page
  }


  // Handling likes for multiple posts
  posts = [
    { id: 1, isLiked: false, likeCount: 0 },
    { id: 2, isLiked: false, likeCount: 0 },
    { id: 3, isLiked: false, likeCount: 0 }

  ];

  toggleLike(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.isLiked ? post.likeCount++ : post.likeCount--;
    }
  }




  // Scroll animation using Intersection Observer
  ngAfterViewInit() {
    const elements = document.querySelectorAll('.post, .card');  // Select elements to animate

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');  // Add 'visible' class to trigger animation
          observer.unobserve(entry.target);  // Stop observing after the animation is triggered
        }
      });
    }, {
      threshold: 0.1,  // Trigger animation when 10% of the element is in the viewport
    });

    elements.forEach((element) => {
      observer.observe(element);  // Observe each element
    });
  }
}

