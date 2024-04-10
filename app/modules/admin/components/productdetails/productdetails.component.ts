import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css'],
  animations: [
    trigger('reveal', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('1.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],

})
export class ProductdetailsComponent implements OnInit {
  state = 'hide';
  ngOnInit(): void {
  }


  onScroll(event: any): void {
    this.state = (window.scrollY > 100) ? 'show' : 'hide';
  }
}