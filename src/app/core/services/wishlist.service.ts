import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private readonly _HttpClient=inject(HttpClient)


getWishList():Observable<any>
{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`,{
    headers:{token:localStorage.getItem('userToken')!}
  })
}



addToWishlist(id:string):Observable<any>
{
  return this._HttpClient.post(`${environment.baseUrl}/api/v1/wishlist`,{
    "productId": id
  },
  {headers:{token:localStorage.getItem('userToken')!}})
}
removeFromWishlist(id:string):Observable<any>
{
  return this._HttpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${id}`,
  {headers:{token:localStorage.getItem('userToken')!}})
}
}
