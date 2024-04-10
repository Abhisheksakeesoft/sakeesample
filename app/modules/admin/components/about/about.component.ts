import { Component, HostListener, OnInit,  } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

// Component method to handle element revealing on scroll using ScrollReveal library
ngOnInit(): void {
  // Initialize the ScrollReveal configuration
  this.initializeScrollReveal();
  // Trigger the reveal method to show elements initially
  this.reveal();
}

// Private method to set up the ScrollReveal configuration
private initializeScrollReveal(): void {
  // Configuration for the ScrollReveal library (not fully implemented in this snippet)
  const scrollRevealConfig = {
    distance: '60px',
    duration: 3000,
    delay: 500
  };
  // Additional configuration or initialization might be added here
}

// Method to reveal elements when they come into the viewport
reveal(): void {
  // Selecting elements with the 'reveal' class
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const elementVisible = 150; // Threshold for considering an element as visible

  // Loop through all 'reveal' elements and add 'active' class if they are visible
  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
}

// HostListener to handle the window scroll event and trigger the 'reveal' method
@HostListener('window:scroll', ['$event'])
onScroll(event: any): void {
  this.reveal(); // Call the 'reveal' method on scroll
}
}