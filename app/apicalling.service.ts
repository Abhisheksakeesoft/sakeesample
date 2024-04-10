import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'config.service';

@Injectable({
  providedIn: 'root'
})
export class ApicallingService {
  storedData: any
  dataStored: boolean = false;
  //  sever ip url from configservice file
  Configurl = this.configService.ConfigUrl;

  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  // template component start
  // template page getting the image 
  public getselected(selectedtemplate: any) {
    console.log("This is the main template");
    return this.httpClient.post(this.Configurl + 'templateData', selectedtemplate)

  }
  // addtocart selected images  with that customer details senidnd to server
  public addimage(customerDetails: any) {
    return this.httpClient.post(this.Configurl + 'selectedImages', customerDetails)
  }
  // template component end
  // book our demo component start
  // bookourdemo sending mail 
  public bookademo(bookdemo: any) {
    return this.httpClient.post(this.Configurl + 'bookourdemo', bookdemo)
  }
  // book our demo component end
  //  payment component start
  //  strippayment
  public makePayment(tokens: any) {
    return this.httpClient.post(this.Configurl + 'strippayment', tokens, { responseType: 'text' })
  }
  // geting the images  
  public gettingcartdata(customerEmail: any) {
    return this.httpClient.post(this.Configurl + 'getcartdata', customerEmail)
  }
  // sending to  payment details to server
  public storingdetails(customerdetails: any) {
    return this.httpClient.post(this.Configurl + 'paymentdeatils', customerdetails)
  }
  //  payment component end
  // invoive component start
  // pdfgeneratin
  public genratepdf(pdfvalues: any) {
    return this.httpClient.post(this.Configurl + 'genratepdf', pdfvalues, { responseType: 'blob' })
  }
  // invoive component end
  // cart component start
  // getting selcted images for the cart component
  public gettingdata(customerEmail: any) {
    return this.httpClient.post(this.Configurl + 'getselectedimages', customerEmail)
  }
  // sending the server  after removeing images
  public cartdata(cartimages:any) {
    return this.httpClient.post(this.Configurl + 'addtocart', cartimages)
  }
  // cart component end

    //Orderid
    makeRazorPayment(requestData:any){
      console.log("Api call is working")
      return this.httpClient.post(this.Configurl +'makeRazorPayment',requestData,{responseType:"text"})
    }
    
    capturePayment(requestData:any){
      console.log("Api call is working")
      return this.httpClient.post(this.Configurl +'capturePayment',requestData,{responseType:"text"})
    }

}
