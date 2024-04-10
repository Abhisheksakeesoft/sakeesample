import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/admin/home', pathMatch: 'full' },
  
  {
    path: 'admin',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./modules/admin/admin.module').then((m) => m.AdminModule),

  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
