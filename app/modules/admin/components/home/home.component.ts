import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent {

  
  constructor( private router: Router)
  {
    
  }

  ngOnInit(): void {
   
  }



  navitagetopublic(): void {
    // Store the title in the component variable
  
  }
  activeItem: string = ''; // Assuming you have this property defined
  menubar(title: string, event: Event): void {
    const selectedItem=title
    console.log('Book', selectedItem);

    const menu =
    {
      selectedtemplate: selectedItem
    }
    console.log(menu);
    const menuString = JSON.stringify(menu);
    // selected menu storing to local storage
    localStorage.setItem('selectedString', menuString);
    this.router.navigate(['/admin/public']);
}
createTemplateConfirmation(): void {
  Swal.fire({
    title: 'Do you want to create templates for you?',
    showCancelButton: true,
    confirmButtonText: 'Yes', // Set the text for the confirm button
    cancelButtonText: 'No', // Set the text for the cancel button
  }).then((result) => {
    if (result.isConfirmed) {
      // User clicked "Yes"
      this.router.navigate(['/admin/productdetails']);
    } else {
      // User clicked "No" or closed the dialog
      console.log('User clicked "No" or closed the dialog. Handle accordingly.');
    }
  });
}
}









