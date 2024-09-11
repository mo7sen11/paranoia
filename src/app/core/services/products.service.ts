import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

private readonly _HttpClient=inject(HttpClient)



getAllProducts():Observable<any>
{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/products`,{
    params:{'limit':'60'}
  })
}
getAllCategories():Observable<any>
{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories`)
}
getAllBrands():Observable<any>
{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/brands`)
}
getSpecificProduct(id:string):Observable<any>
{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/products/${id}`)
}


getFilteredProductsCategory(categoryId:string):Observable<any>
{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/products`,{
    params:{'category[in]':`${categoryId}`}
  })
}
getFilteredBrand(brandId:string):Observable<any>
{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/products`,{
    params:{'brand':`${brandId}`}
  })
}
}
