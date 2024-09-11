import { IcartProduct } from './../../core/interfaces/icart-product';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Icart } from '../../core/interfaces/icart';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  cartProducts: Icart[] = [];
  cartInfo: IcartProduct | null = null;
  isLoading: boolean = false;
  deletedID: string = ''
  isLoadingDelete: boolean = false
  updateProductCountSubscribe!: Subscription;
  clearCartSubscribe!: Subscription;
  RemoveSpecificProductSubscribe!: Subscription;
  getUserCartSubscribe!: Subscription;

  ngOnInit(): void {
    this._NgxSpinnerService.show()
    this.getUserCartSubscribe = this._CartService.getUserCart().subscribe({
      next: (res) => {
        this.cartProducts = res.data.products;
        this.cartInfo = res;
        this._NgxSpinnerService.hide()
      },
      error: (err) => {
        this._NgxSpinnerService.hide()
      },
    });
  }

  removeProduct(id: string): void {
    this.deletedID=id
    Swal.fire({
      title: 'Are you sure want to Delete?',
      icon: 'warning',
      position: 'top',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      cancelButtonColor: 'red',
      confirmButtonColor: 'green',
      background: '#edf2f7',
    }).then((result) => {
      if (result.value) {
        this.isLoadingDelete=true
        this.RemoveSpecificProductSubscribe = this._CartService
          .RemoveSpecificProduct(id)
          .subscribe({
            next: (res) => {
              if (res.status == 'success') {
                this.isLoadingDelete=false
                this.cartProducts = res.data.products;
                this.cartInfo = res;
                this._ToastrService.info(`Item Deleted Successfully`, '', {
                  positionClass: 'toast-top-right',
                  timeOut: 3000,
                  progressBar: true,
                  tapToDismiss: true,
                  progressAnimation: 'decreasing',
                });
              }
            },
            error: (err) => {
              this.isLoadingDelete=false
            },
          });
      }
    });
  }

  updateCount(id: string, count: number): void {
    if (count != 0) {
      {
        this.updateProductCountSubscribe = this._CartService
          .updateProductCount(id, count)
          .subscribe({
            next: (res) => {
              this.cartProducts = res.data.products;
              this.cartInfo = res;
            },
            error: (err) => {
            },
          });
      }
    }
  }

  clearCart(): void {
    Swal.fire({
      title: 'Are you sure want to Delete All Products?',
      icon: 'warning',
      position: 'top',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      cancelButtonColor: 'red',
      confirmButtonColor: 'green',
      background: '#edf2f7',
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;
        this.clearCartSubscribe = this._CartService.clearCart().subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.message == 'success') {
              this.cartProducts = [];
              this.getUserCartSubscribe = this._CartService.getUserCart().subscribe({
                next: (res) => {
                  this.cartProducts = res.data.products;
                  this.cartInfo = res;
                },
                error: (err) => {
                },
              });
              this.cartInfo = null;
              this._ToastrService.info(`Cart Cleared Successfully`, '', {
                positionClass: 'toast-top-right',
                timeOut: 3000,
                progressBar: true,
                tapToDismiss: true,
                progressAnimation: 'decreasing',
              });
            }
          },
          error: (err) => {
            this.isLoading = false;
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.clearCartSubscribe?.unsubscribe();
    this.getUserCartSubscribe?.unsubscribe();
    this.RemoveSpecificProductSubscribe?.unsubscribe();
    this.updateProductCountSubscribe?.unsubscribe();
  }
}
