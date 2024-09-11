import { IProducts } from './../../core/interfaces/iproducts';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { Icart } from '../../core/interfaces/icart';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {
  private readonly _WishlistService = inject(WishlistService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _CartService = inject(CartService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);

  RemoveSpecificProductSubscribe!: Subscription
  addToCartSubscribe!: Subscription
  getUserCartSubscribe!: Subscription
  getWishlistSubscribe!: Subscription
  wishList: IProducts[] = []
  products: Icart[] = []
  count: number = 0
  isAdded: boolean = false
  deletedID: string = ''
  isLoadingDelete: boolean = false
  isLoadingCart: boolean = false
  productCartClickedId: string | null = null





  ngOnInit(): void {
    this._NgxSpinnerService.show()
    this.getWishlistSubscribe = this._WishlistService.getWishList().subscribe({
      next: (res) => {
        if (res.status == 'success')
        this._NgxSpinnerService.hide()
          this.wishList = res.data
        this.count = res.count
      },
      error: (err) => {
        this._NgxSpinnerService.hide()
      }
    })
  }


  removeProduct(id: string): void {
    this.deletedID = id;
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
        this.isLoadingDelete = true
        this.RemoveSpecificProductSubscribe = this._WishlistService
          .removeFromWishlist(id)
          .subscribe({
            next: (res) => {
              if (res.status == 'success') {
                this.wishList.filter((item, index) => {
                  if (item.id == this.deletedID) {
                    this.wishList.splice(index, 1)
                  }
                })
                this.isLoadingDelete = false
                this._ToastrService.info(`${res.message}`, '', {
                  positionClass: 'toast-top-right',
                  timeOut: 3000,
                  progressBar: true,
                  tapToDismiss: true,
                  progressAnimation: 'decreasing',
                });
              }
            },
            error: (err) => {
              this.isLoadingDelete = false
            },
          });
      }
    });
  }


  addToCart(ProductId: string): void {
    this.isLoadingCart = true;
    this.productCartClickedId = ProductId;
    this.getUserCartSubscribe = this._CartService.getUserCart().subscribe({
      next: ((res) => {
        this.products = res.data.products
        for (const element of this.products) {
          if (ProductId == element.product.id) {
            this.isAdded = true
          }
        }
        if (this.isAdded) {
          this.isLoadingCart = false;
          this._ToastrService.warning(`Product is already in your cart`, '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true,
            tapToDismiss: true,
          })
          this.isAdded = false
        }
        else {
          this.addToCartSubscribe = this._CartService.addProductToCart(ProductId).subscribe({
            next: (res) => {
              if (res.status == 'success') {
                this.isLoadingCart = false;
                this._ToastrService.success(`${res.message}`, '', {
                  positionClass: 'toast-top-right',
                  timeOut: 3000,
                  progressBar: true,
                  tapToDismiss: true,
                  progressAnimation: 'decreasing',
                });
              }
            },
            error: (err) => {
              this.isLoadingCart = false;
              this._ToastrService.error(`Product doesn't added`, '', {
                positionClass: 'toast-top-right',
                timeOut: 3000,
                progressBar: true,
                tapToDismiss: true,
                progressAnimation: 'decreasing',
              });
            }
          })
        }
      })
    })

  }



  ngOnDestroy(): void {
    this.addToCartSubscribe?.unsubscribe()
    this.getUserCartSubscribe?.unsubscribe()
    this.getWishlistSubscribe?.unsubscribe()
    this.RemoveSpecificProductSubscribe?.unsubscribe()
  }
}
