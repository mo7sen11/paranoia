import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../../core/services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shippingdetails',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './shippingdetails.component.html',
  styleUrl: './shippingdetails.component.scss'
})
export class ShippingdetailsComponent implements OnInit,OnDestroy {
private readonly _FormBuilder=inject(FormBuilder)
private readonly _OrdersService=inject(OrdersService)
private readonly _ActivatedRoute=inject(ActivatedRoute)
private readonly _ToastrService=inject(ToastrService)
private readonly _Router=inject(Router)
cartID:string=''
paymentMethod:string=''
isLoading:boolean=false
activatedRouteSubscribe!:Subscription
checkOutSessionSubscribe!:Subscription
cashOrderSubscribe!:Subscription

ShippingForm:FormGroup=this._FormBuilder.group({
  details:[null,[Validators.required]],
  phone:[null,[Validators.required]],
  city:[null,[Validators.required]]
})


ngOnInit(): void {
 this.activatedRouteSubscribe= this._ActivatedRoute.paramMap.subscribe({
    next:((p)=>{
 this.cartID =p.get('id')!
 this.paymentMethod=p.get('method')!
    }),
    error:((p)=>{
      console.error(p)
    })
  })
    
      
 
}
checkOut():void
{  
if(this.ShippingForm.valid)
{
  this.isLoading=true
if(this.paymentMethod=='card'){
this.checkOutSessionSubscribe=  this._OrdersService.checkOutSession(this.cartID,this.ShippingForm.value).subscribe({
    next:((res)=>{
      window.open(res.session.url,'_self')
    }),
    error:((err)=>{
    this.isLoading=false
  
      console.log(err)
    })
  })
}
else if(this.paymentMethod=='cash')
{
 this.cashOrderSubscribe= this._OrdersService.cashOrder(this.cartID,this.ShippingForm.value).subscribe({
    next:((res)=>{
      this._ToastrService.success(`Your order is in the processing phase`, '', {
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true,
        tapToDismiss: true,
        progressAnimation: 'decreasing',
      });
      this._Router.navigate(['/allorders'])
    }),
    error:((err)=>{
    this.isLoading=false
      console.log(err)
    })
  })
}
}
else
{
  this.ShippingForm.markAllAsTouched()
}
}


ngOnDestroy(): void {
  this.cashOrderSubscribe?.unsubscribe()
  this.activatedRouteSubscribe?.unsubscribe()
  this.checkOutSessionSubscribe?.unsubscribe()
}
}
