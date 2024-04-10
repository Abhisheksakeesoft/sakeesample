

/*<!--Start of comments
    typeScript                :  defined the function definitions in TypeScript that can be linked to HTML actions
    Description               :  display the images added to the cart, including their respective prices
                                 and the total cost.
    Business Rules            :  defined parameter names and  connect to node js server from Application
    Version                   :  4.9.4
    Database Objects          :  None
    ---------------------------------------------------------------------------------------------         
    Created By                :  Sakeesoft
    Created Date              :  09/11/2023 
    Modified By               :  
    Modified Date             :
    Reviewed By               :
    Reviewed Date             :
    End of comments-->
 */


    import { Component, ElementRef, ViewChild } from '@angular/core';
    import { Router } from '@angular/router';
    import { NgxSpinnerService } from 'ngx-spinner';
    import { ApicallingService } from 'src/app/apicalling.service';
    interface SelectedImage {
      event: string;
      image: string;
      imagePrice: number;
    }
    @Component({
      selector: 'app-cart',
      templateUrl: './cart.component.html',
      styleUrls: ['./cart.component.css']
    })
    export class CartComponent {
      email: string;
      name: string;
      Totalamount: 0;
      image: [];
      event: [];
      imageprice: [];
      selectedimages: string;
      selectedImages: any;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      displayedColumns: ['imagename', 'image', 'imageprice', 'action']
      dataSource: any;
      currentAdress: any;
      constructor(private api: ApicallingService, private spinner: NgxSpinnerService, private router: Router,) {
    
      }
      ngOnInit() {
        //getting the local storage customer deatils
        // getting the customer details
        const customerName = localStorage.getItem('customerName');
        const customerEmail = localStorage.getItem('customerEmail');
        const customerPhone = localStorage.getItem('customerPhone');
     
    
        if (customerName && customerEmail && customerPhone) {
          console.log('Retrieved Customer Details:');
          console.log('Name:', customerName);
          console.log('Email:', customerEmail);
          console.log('Phone:', customerPhone);
          this.customerName = customerName
          this.customerEmail = customerEmail,
            this.customerPhone = customerPhone
          // sending to server email
          const email = {
            customerEmail: customerEmail
          }
          console.log(email)
          this.spinner.show()
          // sending the email to backend based on the customer getting response the image details
          this.api.gettingdata(email).subscribe((resp: any) => {
            console.log(resp)
            this.currentAdress = resp.Currentaddress
            console.log( this.currentAdress)
            this.selectedimages = resp.selectedImages
            console.log(this.selectedimages)
            if (resp && resp.selectedImages) {
              // Map 'resp.selectedImages' into an array of SelectedImage objects
              const selectedImages: SelectedImage[] = resp.selectedImages.map(item => ({
                event: item.event,
                image: item.image,
                imagePrice: item.imagePrice
              }));
              // Assign the structured data to your class properties or use it directly
              this.selectedImages = selectedImages;
              console.log(this.selectedImages);
            }
            if (resp && resp.selectedImages) {
              const selectedEvents = resp.selectedImages.map(item => item.event);
              this.event = selectedEvents
              console.log(this.event);
            }
            if (resp && resp.selectedImages) {
              const selectedimages = resp.selectedImages.map(item => item.image);
              this.image = selectedimages
              console.log(this.image);
            }
            if (resp && resp.selectedImages) {
              const selectedimages = resp.selectedImages.map(item => item.imagePrice);
              this.imageprice = selectedimages
              console.log(this.imageprice);
            }
            if (resp && resp.selectedImages) {
              this.dataSource = resp.selectedImages.map(item => {
                return {
                  event: item.event,
                  image: item.image,
                  imageprice: item.imageprice
                };
              });
    
            }
            this.email = resp.customerEmail,
              this.name = resp.customerName,
              this.Totalamount = resp.Toatlprice
            this.spinner.hide()
          })
    
        } else {
          // Handle the case when customer details are not found in local storage.
          console.log('Customer details not found in local storage.');
        }
    
      }
      // selected images removing the images start
      removeImage(index: number): void {
        if (index >= 0 && index < this.selectedImages.length) {
          this.selectedImages.splice(index, 1); // Remove the item at the specified index
          // Regenerate selectedImage based on updated selectedImages
          const selectedImagesMapped = this.selectedImages.map(image => ({
            event: image.event,
            image: image.image,
            imagePrice: image.imagePrice
          }));
          const remainingTotalPrice = this.calculateTotalPrice();
          // Log the updated format and total price
          console.log('Remaining Images:', this.selectedImages);
          console.log('Updated Total Price:', remainingTotalPrice);
          this.removeImageFromUI(index);
        }
      }
      // selected images removing the images end
      calculateTotalPrice() {
        return this.selectedImages.reduce((total, image) => total + image.imagePrice, 0);
      }
      //for the removing selected images in ui start
      removeImageFromUI(index: number): void {
        // Remove the item at the specified index from each array
        if (index >= 0 && index < this.selectedImages.length) {
          this.event.splice(index, 1);
          this.image.splice(index, 1);
          this.imageprice.splice(index, 1);
        }
      }
      // for the removing selected images in ui end
      // final to add cart images seding to backend with that it is navigate to paymentpage start
      buynow() {
        const cartimages = {
          customerName: this.customerName,
          customerEmail: this.customerEmail,
          customerPhone: this.customerPhone,
          selectedImages: this.selectedImages,
          currentAddress: this.currentAdress,
          Toatlprice: this.calculateTotalPrice(),
          Tax:this.calculateTaxAmount(),
          Totalamountwithtax:this.calculateGrandTotalWithTax()
        }
        console.log(cartimages)
        this.api.cartdata(cartimages).subscribe((resp: any) => {
          console.log(resp)
          this.router.navigate(['/admin/payment']);
        })
      }
      //final to add cart images seding to backend with that it is navigate to paymentpage end
      goTotemplatePage() {
        // Navigate to the home page, replace '/home' with the actual path to your home page
        this.router.navigate(['/admin/public']);
      }
      calculateTaxAmount(): number {
        const grandTotal = this.calculateTotalPrice();
        const taxRate = 0.1; // 10%
        const taxAmount = grandTotal * taxRate;
        localStorage.setItem('taxAmount', taxAmount.toFixed(2));
        return taxAmount;
      }
      calculateGrandTotalWithTax(): number {
        const grandTotal = this.calculateTotalPrice();
        const taxAmount = this.calculateTaxAmount();
        const totalWithTax = grandTotal + taxAmount;
        // Use toFixed to format the number with 2 decimal places
        const formattedTotalWithTax = Number(totalWithTax.toFixed(2));
        localStorage.setItem('totalWithTax', totalWithTax.toFixed(2));
        return formattedTotalWithTax;
      }
    }
    
    
    
    