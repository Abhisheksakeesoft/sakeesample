

import { Component, OnInit, } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('buttonAnimation', [
      state('open', style({ transform: 'translateX(250px)' })),
      state('closed', style({ transform: 'translateX(0)' })),
      transition('open <=> closed', animate('0.3s ease')),
    ]),

  ],
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  navbarCollapse = true;
  public isCollapsed: boolean = true;

  collapsed = true;
  constructor() { }

  ngOnInit(): void { }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}

