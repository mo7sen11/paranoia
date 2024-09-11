import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private readonly _HttpClient=inject(HttpClient)
  header:string=localStorage.getItem('userToken')!

  checkOutSession(id:string,data:object):Observable<any>
  {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${id}?url=${environment.URL}`,
      {
        "shippingAddress": data
      },
      {headers:{token:this.header}}
      
    )
  }
  cashOrder(id:string,data:object):Observable<any>
  {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/${id}`,
      {
        "shippingAddress": data
      },
      {headers:{token:this.header}}
      
    )
  }

  getUserOrders(id:string):Observable<any>
  {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/orders/user/${id}`)
  }
}
