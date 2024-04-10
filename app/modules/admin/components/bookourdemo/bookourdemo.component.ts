/*<!--Start of comments
    typeScript                :  defined the function definitions in TypeScript that can be linked to HTML actions
    Description               :  defined This feature allows those interested in our DDM project 
                                 to schedule and book a  demonstration in advance.                        
    Business Rules            :  defined parameter names and  connect to node js server from Application
    Version                   :  4.9.4
    Database Objects          :  None
    ---------------------------------------------------------------------------------------------         
    Created By                :  Sakeesoft
    Created Date              :  11/9/2023 
    Modified By               :  
    Modified Date             :
    Reviewed By               :
    Reviewed Date             :
    End of comments-->
 */
    import { animate, style, transition, trigger } from '@angular/animations';
    import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { NgxSpinnerService } from 'ngx-spinner';
    import { ApicallingService } from 'src/app/apicalling.service';
    import Swal from 'sweetalert2';
    import { Country } from 'country-state-city';
    import { DatePipe } from '@angular/common';
    import { MatDatepickerModule } from '@angular/material/datepicker';
    import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
    import { Router } from '@angular/router';
    
    @Component({
      selector: 'app-bookourdemo',
      templateUrl: './bookourdemo.component.html',
      styleUrls: ['./bookourdemo.component.css'],
      // animtiom for the  displaying card from top to button
      animations: [
        trigger('slideDown', [
          transition(':enter', [
            style({ opacity: 0, transform: 'translateY(-100%)' }),
            animate('2s ease', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ]
    })
    export class BookourdemoComponent implements OnInit {
      @ViewChild('country') country: ElementRef;
      countries: any[];
      selectedCountry: any;
      selectedCountryTime: string | null = null;
      bookourdemo: FormGroup;
      isAnimationStarted = false;
      form: FormGroup;
      selectedTime: any;
      selectedAmPm: string = 'am';
      time? = new Date();
    
      constructor(private api: ApicallingService, private fb: FormBuilder, private spinner: NgxSpinnerService,
        private datePipe: DatePipe,public element: ElementRef, private router: Router) {
        this.countries = Country.getAllCountries();
      
    
      }
      
      updateFormControl(value: any) {
        this.form.controls['Time'].setValue(value);
      }
      // starting only  animation
      startAnimation() {
        this.isAnimationStarted = true;
      }
      // validation for the inputype
      ngOnInit(): void {
        this.form = this.fb.group({
          Time: ['12:00 ' ],
        });
        this.bookourdemo = this.fb.group({
          CustomerName: ['', Validators.required],
          CompanyName: ['', Validators.required],
          time: ['', Validators.required],
          Email: ['', Validators.required],
          // Contact: ['', [Validators.required]], // Apply the custom validator
          date: ['', Validators.required]
        });
    
      }
      // to get the all customer details
      Onsubmit() {
    
        if (this.bookourdemo.valid) {
          const ourdemo = this.bookourdemo.value;
          const CustomerName = ourdemo.CustomerName;
          const CompanyName = ourdemo.CompanyName;
          const time = ourdemo.time;
          const Email = ourdemo.Email
          const country = this.selectedCountry
          // const Contact = ourdemo.Contact
          const date = this.datePipe.transform(ourdemo.date, 'dd/MM/yyyy');
          const bookdemo = {
            CustomerName: CustomerName,
            CompanyName: CompanyName,
            time: time,
            Email: Email,
            // Contact: Contact,
            date: date,
            country:country
    
          };
          console.log(bookdemo)
          this.spinner.show();
          //  sending to server 
          this.api.bookademo(bookdemo).subscribe((resp: any) => {
            console.log(bookdemo)
            // this.spinner.show();
            Swal.fire(resp.message).then(() => {
              // Navigate to the home page after clicking "OK"
              this.router.navigate(['/admin/home']); // Replace '/home' with your actual home page route
          });
            console.log(resp);
            this.spinner.hide();
          })
    
        }
        else{
          Swal.fire('Please fill the form')
        }
    
      }
      // added for the country
      onCountryChange($event: any): void {
        const selectedValue = $event.target.value;
        const country=JSON.parse(selectedValue)
        this.selectedCountry =country.name ;
        console.log(this.selectedCountry)
        this.displayCurrentTime();
      }
      // based on the cuntry its displaying the time
      displayCurrentTime(): void {
        if (this.selectedCountry && this.selectedCountry.timezones && this.selectedCountry.timezones.length > 0) {
          const timezone = this.selectedCountry.timezones[0].zoneName;
          const currentDate = new Date().toLocaleString('en-US', { timeZone: timezone });
          this.selectedCountryTime = this.getTimeFromDate(currentDate);
          console.log(this.selectedCountryTime)
        } else {
          this.selectedCountryTime = 'Time not available for the selected country';
        }
      }
      // Existing code remains the same
      getTimeFromDate(dateTimeString: string): string {
        const date = new Date(dateTimeString);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const amPM = hours >= 12 ? 'PM' : 'AM';
        const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
        return displayHours + ':' + minutes + ' ' + amPM;
      }
      // clicking the cancel button reset all the input fields
      resetForm() {
        this.bookourdemo.reset(); // Resets form controls
        this.bookourdemo.clearValidators(); // Clear validators
      }
    
    
      toggleAMPM(period: 'AM' | 'PM') {
        const currentTime = this.selectedTime; // Assuming selectedTime is in a format you can manipulate
        
        // Check whether the selected period is already the same
        if ((period === 'AM' && currentTime.hours() < 12) || (period === 'PM' && currentTime.hours() >= 12)) {
          return; // No need to update if the period is already selected
        }
    
        // Calculate the new time based on the selected period
        let newHours = currentTime.hours();
        if (period === 'AM' && newHours >= 12) {
          newHours -= 12;
        } else if (period === 'PM' && newHours < 12) {
          newHours += 12;
        }
    
     
    
      }
    }