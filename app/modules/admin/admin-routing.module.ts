import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { PaymentgatewayComponent } from './components/paymentgateway/paymentgateway.component';
import { PublictemplatesComponent } from './components/publictemplates/publictemplates.component';
import { BookourdemoComponent } from './components/bookourdemo/bookourdemo.component';
import { HomeComponent } from './components/home/home.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: '/admin/home', pathMatch: 'full' },
      {path:'home',component:HomeComponent},
      { path: 'about', component: AboutComponent },
      { path: 'public', component: PublictemplatesComponent },
      {path:'cart',component:CartComponent},
      { path: 'payment', component: PaymentgatewayComponent },
      {path:'invoice',component:InvoiceComponent},
      {path:'bookourdemo',component:BookourdemoComponent},
      { path: 'contact', component: ContactComponent },
      {path:'productdetails',component:ProductdetailsComponent}
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),],

  exports: [RouterModule],
})
export class AdminRoutingModule { }
