/*<!--Start of comments
    typeScript                :  defined the function definitions in TypeScript that can be linked to HTML actions
    Description               :  Idefined the payment options, you'll find the choice to use “credit/debit “ 
                                 cards as well as a  “QR code” option for payment.for the credit/debit we are implimented 
                                 using strip payment gateway.
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
    import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
    import { NgxSpinnerService } from 'ngx-spinner';
    import { ApicallingService } from 'src/app/apicalling.service';
    import Swal from 'sweetalert2';
    import { Router } from '@angular/router';
    import { ConfigService } from 'config.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
    declare var Razorpay: any;
    @Component({
      selector: 'app-paymentgateway',
      templateUrl: './paymentgateway.component.html',
      styleUrls: ['./paymentgateway.component.css']
    })
    export class PaymentgatewayComponent {
      title = 'angularstripe';
      @ViewChild('cardNumber', { static: true }) cardNumber: ElementRef;
      @ViewChild('cardExpiry', { static: true }) cardExpiry: ElementRef;
      @ViewChild('cardCvc', { static: true }) cardCvc: ElementRef;
      paymentForm: FormGroup; // Define your form group here
      dataStored: boolean = false;
      storeddata: string = '';
      source: any;
      selectedPayment: string;
      stripe;
      card: any;
      cardHandler = this.onChange.bind(this);
      error: string;
      name:string;
      mobile_no:any;
      cardForm: FormGroup
      customerName: string
      current: string;
      cardNumberElement: any;
      cardExpiryElement: any;
      cardCvcElement: any;
      email:any;
      Totalamount: number;
      image: any;
      base64ImageData:any;
      event: any;
      status: string;
      images: string;
      contact: any;
      tax: any;
      Totalamountwithtax: number;
      currentAdress: any;
      currentAddress:any;
      totalPrice:any;
      totalAmountWithTax:number;
      constructor(private api: ApicallingService, private fb: FormBuilder, private spinner: NgxSpinnerService,
        private cd: ChangeDetectorRef, private formBuilder: FormBuilder, private router: Router,
        private stripeService: AngularStripeService, private configService: ConfigService) {
        //  getting the local storage customerdetails
        const customerName = localStorage.getItem('customerName');
        const customerEmail = localStorage.getItem('customerEmail');
        const customerPhone = localStorage.getItem('customerPhone');
        
    
        if (customerName && customerEmail && customerPhone) {
          console.log('Retrieved Customer Details:');
          console.log('Name:', customerName);
          console.log('Email:', customerEmail);
          console.log('Phone:', customerPhone);
          const email = {
            customerEmail: customerEmail
          }
          console.log(email)
          this.spinner.show()
          // sending the customer mail to nodejs based on the getting image details
          this.api.gettingcartdata(email).subscribe((resp: any) => {
            console.log(resp)
            this.tax=resp.tax,
            this.Totalamountwithtax=resp.totalAmountWithTax
            this.images = resp.selectedImages
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
            this.email = resp.customerEmail,
              this.name = resp.customerName,
              this.contact = resp.customerPhone
            this.Totalamount = resp.Toatlprice
            this.totalAmountWithTax = resp.totalAmountWithTax
            this.currentAdress = resp.currentAddress
            this.totalPrice = resp.totalPrice
          console.log( this.currentAdress)
            this.spinner.hide()
          })
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
        } else {
          // Handle the case when customer details are not found in local storage.
          console.log('Customer details not found in local storage.');
        }
    
      }
      ngOnInit() {
        // card detail to the form group
        this.cardForm = this.formBuilder.group({
          creditCardNumber: ['', [Validators.required,]],
          cardExpiry: ['', [Validators.required]],
          cardCvc: ['', [Validators.required]],
        })
        const currentDate = (new Date().toLocaleDateString())
        console.log('this.formattedDate', currentDate);
        this.current = currentDate
        console.log(this.current)
      }
    
      // selected  payment option start 
      onChange({ error }) {
        if (this.selectedPayment === 'Credit/Debit') {
        } else if (this.selectedPayment === 'qrcode') {
        }else if (this.selectedPayment === 'upi')
    
        if (error) {
          this.error = error.message;
        } else {
          this.error = null;
        }
        this.cd.detectChanges();
      }
      onRadioChange(value: string) {
        this.selectedPayment = value;
        console.log(`Selected payment method: ${this.selectedPayment}`);
        const paymentoption = {
          selecetedoption: this.selectedPayment
        }
        console.log(paymentoption)
        const selectedpayment = JSON.stringify(paymentoption);
        // Store the JSON string in local storage
        localStorage.setItem('selectedpayment', selectedpayment);
        console.log('Data has been stored in local storage:', paymentoption);
      }
      //selected  payment option  end
      // using stripe serverice and strip publish key with that diving the card elements
      ngAfterViewInit() {
        this.stripeService.setPublishableKey(this.configService.strippublish).then((stripe) => {
          this.stripe = stripe;
          const elements = stripe.elements();
    
          const cardNumberOptions = {
            // Add any options you want to customize the card number input
          };
          this.cardNumberElement = elements.create('cardNumber', cardNumberOptions);
          this.cardNumberElement.mount(this.cardNumber.nativeElement);
    
          const cardExpiryOptions = {
            // Add any options you want to customize the card expiry input
          };
          this.cardExpiryElement = elements.create('cardExpiry', cardExpiryOptions);
          this.cardExpiryElement.mount(this.cardExpiry.nativeElement);
    
          const cardCvcOptions = {
            // Add any options you want to customize the card CVC input
          };
          this.cardCvcElement = elements.create('cardCvc', cardCvcOptions);
          this.cardCvcElement.mount(this.cardCvc.nativeElement);
        });
      }
      // creating the strip token inside the pay button
      async onSubmit() {
        try {
          // Create a Stripe token
          const { token, error } = await this.stripe.createToken(this.cardNumberElement, {
            name: this.name,
            email: this.email,
          });
          if (error) {
            console.error(error);
            Swal.fire(error.message)
            // Handle the error appropriately, e.g., show an error message to the user.
          } else {
            // Token was created successfully. You can now send this token to your server for payment processing.
            console.log(token);
            this.source = token;
            // Send the token to your server for payment processing
            const tokens = {
              token: this.source,
              amount: this.Totalamount,
            };
            console.log(tokens);
            this.spinner.show();
            this.api.makePayment(tokens).subscribe(async (resp: any) => {
              console.log(resp);
              this.spinner.hide();
              // getting the response from stripclient link for the opening the tab automatically
              const url = resp.replace(/^"(.*)"$/, '$1');
              console.log(url);
              if (url) {
                const newTab = window.open(url, '_blank');
                if (newTab) {
                  newTab.moveTo(-10000, -10000);
                  // Wait for a longer time to ensure the new tab opens
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  newTab.close();
                  // closing the tab
                  this.logAndDownloadImages()
                  this.status = 'Succeeded'
                  Swal.fire({
                    title: 'Payment Completed Successfully',
                  }).then(() => {
                    // once completed the payment calling the download image function with that it
                    // is navigating to invoice page
                    this.router.navigate(['/admin/invoice']);
                  });
                } else {
                  this.status = 'failed'
                  console.error('Incomplete Please Try again');
                  Swal.fire('Payment failed Please Try again')
                }
                localStorage.setItem('status', this.status);
                this.paymentdetails()
              } else {
                console.error('Invalid URL received from the server');
              }
            })
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          // Handle the error appropriately, e.g., show an error message to the user.
        }
      }
      //to store the mongodb senidng to server strat
      paymentdetails() {
        const customerdetails = {
          name: this.name,
          email: this.email,
          contact: this.contact,
          imagedeatils: this.images,
          totalprice: this.Totalamount,
          status: this.status,
          paymentmethod: this.selectedPayment,
          date: this.current,
          Tax:this.tax,
          Totalamountwithtax: this.Totalamountwithtax,
          CurrentAddress:this.currentAdress
        }
        console.log(customerdetails)
        this.api.storingdetails(customerdetails).subscribe((resp: any) => {
    
        })
    
      }
      // to store the mongodb senidng to server end
      //once payment is done download image start
      logAndDownloadImages() {
        const logCount = this.image.length; // Use the length of the array
        for (let i = 0; i < logCount; i++) {
          if (this.image.length > 0) {
            const currentBase64 = this.image.shift(); // Remove and get the first base64 value
            console.log(currentBase64); // Log the current base64 value to the console
            // Download the base64 image
            this.downloadBase64Image(currentBase64, `image${i}.png`);
          } else {
            console.log('No more base64 values to log.');
            break;
          }
        }
      }
      downloadBase64Image(base64: string, filename: string) {
        const a = document.createElement('a');
        a.href = `data:image/png;base64,${base64}`;
        a.download = filename;
        a.click();
      }
      // once payment is done download image end
      // for the scanner pay button
      scanner() {
        const customerdetails = {
          name: this.customerName,
          email: this.email,
          contact: this.contact,
          imagedetails: this.images,
          totalprice: this.Totalamount,
          status: this.status,
          paymentmethod: this.selectedPayment,
          date: this.current
        };
        console.log(customerdetails);
    
        if (customerdetails) {
          this.status = 'Succeeded';
          Swal.fire({
            title: 'Payment Completed Successfully',
          }).then(() => {
            // Upon successful payment, call the download image function and navigate to the invoice page
            this.logAndDownloadImages()  // for the download images calling the function
            this.router.navigate(['/admin/invoice']);// navugate to invoice page
          });
        } else {
          this.status = 'failed';
          console.error('Incomplete. Please try again');
          Swal.fire('Payment failed. Please try again');
        }
    
        localStorage.setItem('status', this.status);
        // calling the function to store mongodb
        this.paymentdetails();
      }

      pay() {
        localStorage.setItem('base64ImageData', this.base64ImageData);

        const pdfData = {
          name:this.name,
          email:this.email,
          contact:this.contact,
          companyname:this.base64ImageData,
          paymethod:this.selectedPayment,
          currentdate:this.current,
          selectedimages:this.images,
          totalamount:this.totalPrice,
          Totalamountwithtax:this.Totalamountwithtax,
          tax:this.tax,
          CurrentAddress:this.currentAdress
        };
        console.log(pdfData);
        const price = this.totalAmountWithTax*100 
        console.log('The Pdf data----->',pdfData);
        // Create an order using the service
        this.api.makeRazorPayment({amount:price,currency:'INR'}).subscribe(
          (data:any)=>{
            console.log(data);
            const parsedData = JSON.parse(data);
        // Create options object for Razorpay checkout form
                const options = {
                  key:'rzp_test_rh1sVK6w0pFVHD',
                  amount:price,
                  currency:'INR',
                  name:'DDM_Public',
                  description:'Order Your Wish',
                  image:  '../../../../../assets/images/Sakeesoft (2).png',
                  order_id:parsedData,
                  "handler":(response:any)=>{
                        this.api.capturePayment
                        ({paymentId:response.razorpay_payment_id,amount:price,currency:'INR',data:pdfData})
                        .subscribe(
                            (captureData: any) => {
                              const info = JSON.parse(captureData);
                              console.log(info);
                              if (info.status === 200) {
                                alert('Payment Successful');
                                this.logAndDownloadImages() 
                              } else {
                                alert('Payment failed');
                              }
                            });  
                },
                  prefill: {
                    name: this.name,
                    email: this.email,
                    contact: `+91${this.contact}`,
                  },
                  notes: {
                    address: 'Some address',
                  },
                  theme: {
                    color: '#ADD8E6',
                  },
                  modal: {
                    escape: true,
                    backdropclose: true,
                    ondismiss: function () {
                      // Handle modal dismissal
                      console.log("Modal dismissed");
                    }
                  }
                };
                
                // Create a Razorpay instance using options object
                const rzp = new Razorpay(options);
                rzp.on('payment.failed', function (response:any){
                  alert(response.error.code);
                  alert(response.error.description);
                  alert(response.error.source);
                  alert(response.error.step);
                  alert(response.error.reason);
                  alert(response.error.metadata.order_id);
                  alert(response.error.metadata.payment_id);
                });
                console.log(options);
                // Open Razorpay checkout form
                rzp.open();
              });
    }
  
    
    }
    
    
    
    
    
    
    
    
    
    
