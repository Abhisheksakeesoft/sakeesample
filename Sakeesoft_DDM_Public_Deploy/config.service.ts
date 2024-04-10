import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }
  //  server url from apicalling.server.ts file
  ConfigUrl = 'https://api.ddmpublic.shop:4100/';
  //  strip publisg key  from tempale.ts file
  strippublish = 'pk_test_51NpS3BSEjQI60rCl2GFE7gn87PLLLVFf2xqyGSpRHCuScwazeg65xxGa1YKO80WN2zhBBnvexJHBLNSNgY3kmNVm009D2Mk7AK'
}
