/*<!--Start of comments
    typeScript                :  defined the function definitions in TypeScript that can be linked to HTML actions
    Description               :  defined the payment  receipt with all the customer details                         
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
    import { Component } from '@angular/core';
    import { Router } from '@angular/router';
    import { NgxSpinnerService } from 'ngx-spinner';
    import { ApicallingService } from 'src/app/apicalling.service';
    
    @Component({
      selector: 'app-invoice',
      templateUrl: './invoice.component.html',
      styleUrls: ['./invoice.component.css']
    })
    export class InvoiceComponent {
      selectedpayment:any;
      current: string;
      base64ImageData: string | undefined;
      email: string;
      name: string;
      Totalamount: number = 0;
      imagename: string;
      contact: number;
      event: string;
      imagePrice: number;
      image: string;
      selectesdata: string;
      status: string;
      tax: any;
      Totalamountwithtax: any;
      CurrentAddress: any;
      constructor(private api: ApicallingService, private spinner: NgxSpinnerService,
        private router: Router,) {
        //  currentt date declaration
        const currentDate = (new Date().toLocaleDateString())
        console.log('this.formattedDate', currentDate);
        this.current = currentDate
        console.log(this.current)
        // sakeesoft img logo 
        const imagePath = '../../../../../assets/images/Sakeesoft (2).png';
        fetch(imagePath)
          .then(response => response.blob())
          .then(blob => {
            // Convert the image to base64
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                // Remove the prefix
                this.base64ImageData = reader.result as string;
                if (this.base64ImageData.startsWith('data:image/png;base64,')) {
                  this.base64ImageData = this.base64ImageData.substring('data:image/png;base64,'.length);
                  console.log(this.base64ImageData)
                }
              };
            });
          })
          .catch(error => {
            console.error('Error reading the image:', error);
          });
      }
      ngOnInit() {
        // getting the data from local storage
        // getting the status 
        this.status = localStorage.getItem('status');
        console.log(this.status)
    
        // getting the  customerdetails
        const customerName = localStorage.getItem('customerName');
        const customerEmail = localStorage.getItem('customerEmail');
        const customerPhone = localStorage.getItem('customerPhone');
    
        if (customerName && customerEmail && customerPhone) {
          // You have successfully retrieved the customer details from local storage.
          // Now you can use these variables (customerName, customerEmail, customerPhone) as needed.
          console.log('Retrieved Customer Details:');
          console.log('Name:', customerName);
          console.log('Email:', customerEmail);
          console.log('Phone:', customerPhone);
    
          const email = {
            customerEmail: customerEmail
          }
          // sending the email to server to 
          console.log(email)
          this.spinner.show()
          this.api.gettingcartdata(email).subscribe((resp: any) => {
            // based on the email getting the response 
            console.log(resp)
            this.selectesdata = resp.selectedImages
            this.tax=resp.Tax,
            this.Totalamountwithtax=resp.Totalamountwithtax
            if (resp && resp.selectedImages) {
              const selectedEvents = resp.selectedImages.map(item => item.event);
              // storing inside the variable imagename
              this.event = selectedEvents
              console.log(this.event);
            }
            if (resp && resp.selectedImages) {
              const imagePrice = resp.selectedImages.map(item => item.imagePrice);
              // storing inside the variable imageprice
              this.imagePrice = imagePrice
              console.log(this.imagePrice);
            }
            if (resp && resp.selectedImages) {
              const image = resp.selectedImages.map(item => item.image);
              // storing inside the variable imagebase64
              this.image = image
              console.log(this.image);
            }
            // storing inside the variable customeremail
            this.email = resp.customerEmail,
              // storing inside the variable customername
              this.name = resp.customerName,
              // storing inside the variable email
              this.contact = resp.customerPhone,
              // storing inside the variable total price
              this.Totalamount = resp.Toatlprice
    
             this.CurrentAddress=resp.currentAdress
             console.log(this.CurrentAddress)
            console.log(this.Totalamount)
            this.spinner.hide()
    
          })
        } else {
          // Handle the case when customer details are not found in local storage.
          console.log('Customer details not found in local storage.');
        }
        // getting the selectedpayment
        const paymentoption = localStorage.getItem('selectedpayment');
        if (paymentoption) {
          // Parse the retrieved data
          this.selectedpayment = JSON.parse(paymentoption);
          console.log('Retrieved menuString:', this.selectedpayment);
        }
    
    
      }
    
      // all the detaild senind to server to create the pdf  start
      generatePDF() {
        const pdfvalues = {
          name: this.name,
          email: this.email,
          contact: this.contact,
          imagename: this.event,
          imageprice: this.imagePrice,
          paymethod: this.selectedpayment.selecetedoption,
          paymentstatus: this.status,
          currentdate: this.current,
          totalamount: this.Totalamount,
          companyname: this.base64ImageData,
          selectedimages: this.selectesdata,
          Tax:this.tax,
          Totalamountwithtax: this.Totalamountwithtax,
          CurrentAddress:this.CurrentAddress
        }
        console.log(pdfvalues)
        this.api.genratepdf(pdfvalues).subscribe((resp: any) => {
          const blobUrl = window.URL.createObjectURL(resp);
          // Create an anchor element
          const link = document.createElement('a');
          link.href = blobUrl;
          // Set the anchor's download attribute and filename
          link.download = 'generated.pdf';
          // Trigger a click event to initiate the download
          link.click();
          // Clean up resources
          window.URL.revokeObjectURL(blobUrl);
    
        });
      }
      // all the detaild senind to server to create the pdf  end=
      // to navigate to template page
      cancel() {
        this.router.navigate(['/admin/public']);
      }
    }
    