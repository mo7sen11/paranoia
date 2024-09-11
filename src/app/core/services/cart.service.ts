import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly _HttpClient=inject(HttpClient)
header:string=localStorage.getItem('userToken')!



  addProductToCart(id:string):Observable<any>
  {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/cart`,
      {"productId":id},
      {headers:{token:this.header}}
    )
  }

  getUserCart():Observable<any>
  {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/cart`,{
      headers:{token:this.header}
    })
  }
  RemoveSpecificProduct(id:string):Observable<any>
  {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`,{
      headers:{token:this.header}
    })
  }
  clearCart():Observable<any>
  {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart`,{
      headers:{token:this.header}
    })
  }
  updateProductCount(id:string,count:number):Observable<any>
  {
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`,
      {"count":count },
      
      {
      headers:{token:this.header}
    })
  }
}
