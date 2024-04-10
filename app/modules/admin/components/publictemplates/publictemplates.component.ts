
/*<!--Start of comments
    typeScript                :  defined the function definitions in TypeScript that can be linked to HTML actions
    Description               :  Accessing the project's UI directly will lead to the template page 
                                 displaying the menu of available templates.
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

    import { OnInit } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Component } from '@angular/core';
    import { NgxSpinnerService } from 'ngx-spinner';
    import { ApicallingService } from 'src/app/apicalling.service';
    import { Router } from '@angular/router';
    import Swal from 'sweetalert2';
    import { animate, state, style, transition, trigger } from '@angular/animations';
    
    @Component({
      selector: 'app-publictemplates',
      templateUrl: './publictemplates.component.html',
      
      styleUrls: ['./publictemplates.component.css'],
     
    })
    export class PublictemplatesComponent implements OnInit {
      imageList: any[] = [];
      dtOptions: DataTables.Settings = {};
      customerName: string = '';
      customerEmail: string = '';
      customerPhone: string = '';
      currentAddress:string=''
      selectedImages = [];
      totalPrice: number = 0;
     
      showContainer2 = false;
      displayStyle = "none";
      showCartButton: boolean = true;
    selectedMenuItem: string | null = null;
    
     // In your component
    showContainer: boolean = true; // or set it to the appropriate condition
    
    
      // In your component
      showContainer1 = true;
      selectedItem: any;
      activeItem: any;
    
      onButtonClick(): void {
        this.showContainer1 = false;
      }
      
    
      constructor(private http: HttpClient, private router: Router,
        private api: ApicallingService, private spinner: NgxSpinnerService,) {
          
      }
      ngOnInit(): void {
        const storedMenuString = localStorage.getItem('selectedString');
    
        window.onbeforeunload = function (e) {
          // Clear all items from localStorage
          localStorage.clear();
        };
        
        if (storedMenuString) {
            // Parse the stored string into an object
            const storedMenu = JSON.parse(storedMenuString);
    
            // Access the selected template property
            const selectedTemplate = storedMenu.selectedtemplate;
            
            const menu={
              selectedtemplate: selectedTemplate
            }
            this.api.getselected(menu).subscribe((resp: any) => {
              console.log(resp)
              const data = resp.data
              this.imageList = data;
              console.log(this.imageList)
        
              this.spinner.hide()
        this.showSecondContainer()
            });
        } else {
            console.log('No stored value found in local storage');
        }
        
    
      }
      // hiding the background image and displaying the selected images start
      showFirstContainer() {
        event.preventDefault();
        this.showContainer1 = true;
        this.showContainer2 = false;
      }
      showSecondContainer() {
       
            this.showContainer1 = false;
        this.showContainer2 = true;
      }
      // hiding the background image and displaying the selected images close
      // start inside the menu function
      menubar(event: any): void {
        const clickedElement = event.target as HTMLElement;
        const linkText = clickedElement.innerText;
        this.activeItem = linkText;
        console.log('  this.activeItem ',  this.activeItem )
        // getting selected menu
        const menu =
        {
          selectedtemplate: linkText
        }
        console.log(menu);
        const menuString = JSON.stringify(menu);
        // selected menu storing to local storage
        localStorage.setItem('menuString', menuString);
        console.log('Data has been stored in local storage:', menu);
        this.spinner.show();
        // passing the parameter (selected menu) getting the images from mongodb
        this.api.getselected(menu).subscribe((resp: any) => {
          console.log(resp)
          const data = resp.data
          this.imageList = data;
          console.log(this.imageList)
    
          this.spinner.hide()
    
        });
      }
      //ending the inside menu function
    
      handleContextMenu(event: MouseEvent, item: any) {
        if (item.imageprice > 0) {
          event.preventDefault();
        }
      }
      // if the image price is zero for that download image start
      downloadimage(base64Data: string, fileName: string): void {
        console.log('Selected Image Base64:', base64Data);
        // Convert Base64 to an image element
        const img = new Image();
        img.src = 'data:image/png;base64,' + base64Data;
        img.onload = () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          // Convert canvas to Blob
          canvas.toBlob((blob) => {
            // Initiate the download of the selected image
            const url = window.URL.createObjectURL(blob);
    
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            Swal.fire('Download image sucessfully')
            document.body.removeChild(a);
          }, 'image/png');
         
        };
      }
      // if the image price is zero for that download image end
      // we will get the  select images  start
      // Function to check if an item is already in the cart
      isAddedToCart(item: any): boolean {  // Assume this is your array where items are stored once added to the cart
        return this.selectedImages.some(selectedItem => selectedItem.image === item.image);
      }
      // Function to add an item to the cart
      addToCart(item: any): void {
        if (!this.isAddedToCart(item)) {
          const parsedImagePrice = parseFloat(item.imageprice);
          if (!isNaN(parsedImagePrice)) {
            this.selectedImages.push({
              image: item.image,
              event: item.event,
              imagePrice: parsedImagePrice
            });
            this.showCartButton = false;
            this.calculateTotalPrice();
            console.log(this.selectedImages);
          } else {
            console.error('Invalid image price');
          }
        }
      }
      // we will get the  select images  end
      // calculating the selected imgae price total start
      calculateTotalPrice(): void {
        this.totalPrice = this.selectedImages.reduce((total, item) => total + item.imagePrice, 0);
        console.log('Total Price:', this.totalPrice);
      }
      // calculating the selected imgae price total end
      //clicking the filter button  open the model filter 
      openPopup() {
        this.displayStyle = "block";
      }
      // clicking the x button  close the model filter=
      closePopup() {
        this.displayStyle = "none";
      }
      // ==========selected images ,imageprice,customer details and total price sending to backend to store mongodb======
      logValues() {
        // Check if required fields are empty
        if (!this.customerName || !this.customerEmail || !this.customerPhone  || !this.currentAddress ) {
          // Display a message indicating that required details are missing
          Swal.fire('Requires customer details');
          return; // Exit the function without further processing
        }
        // Check if images are not selected
        if (!this.selectedImages || this.selectedImages.length === 0) {
          Swal.fire('No images selected. Please select at least one image.');
          return; // Exit the function without further processing
        }
    
        const customerDetails = {
          customerName: this.customerName,
          customerEmail: this.customerEmail,
          customerPhone: this.customerPhone,
          selectedImages: this.selectedImages,
          Toatlprice: this.totalPrice,
          currentAddress:this.currentAddress
        };
        console.log(customerDetails)
        // storing the local storage
        localStorage.setItem('customerName', this.customerName);
        localStorage.setItem('customerEmail', this.customerEmail);
        localStorage.setItem('customerPhone', this.customerPhone);
        localStorage.setItem('currentAddress', this.currentAddress);
        // sending  the details to server
        this.api.addimage(customerDetails).subscribe((resp: any) => {
          console.log(customerDetails);
          console.log(resp);
          this.router.navigate(['/admin/cart']);
        });
      }
      // closing the function
      // contact num validaton
      isValidPhoneNumber() {
        return /^\d{10}$/.test(this.customerPhone);
      }
    
    }
    
    
    
    
    
    
    