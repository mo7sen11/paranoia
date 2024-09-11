import { IProducts } from './../../core/interfaces/iproducts';
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Icart } from '../../core/interfaces/icart';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CarouselModule, CurrencyPipe, NgClass],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService)
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  activatedRouteSubscribe!: Subscription;
  getSpecificProductSubscribe!: Subscription;
  addToWishlistSubscribe!: Subscription
  getWishlistSubscribe!: Subscription
  addToCartSubscribe!: Subscription
  getUserCartSubscribe!: Subscription
  wishList: IProducts[] = []
  wishlistProducts: any[] = []
  products: Icart[] = []
  productDetails!: IProducts
  productId: string = ''
  isAdded: boolean = false
  isLoadingWishlist: boolean = false
  isLoadingCart: boolean = false
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }

  ngOnInit(): void {
    this._NgxSpinnerService.show();
    this.activatedRouteSubscribe = this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productId = params.get('id')!;
        this.getSpecificProductSubscribe = this._ProductsService
          .getSpecificProduct(this.productId)
          .subscribe({
            next: (res) => {
              this.productDetails = res.data
              this._NgxSpinnerService.hide();
            },
            error: (err) => {
              this._NgxSpinnerService.hide();
            },
          });
      },
      error: (err) => {
      },
    });
  }
  ngAfterViewInit(): void {
    this.getWishlistSubscribe = this._WishlistService.getWishList().subscribe({
      next: (res) => {
        this.wishList = res.data
        for (const element of this.wishList) {

          this.wishlistProducts.push(element.id)
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }


  addToWishList(): void {
    this.isLoadingWishlist = true
    this.addToWishlistSubscribe = this._WishlistService.addToWishlist(this.productId).subscribe({
      next: (res) => {
        this.wishlistProducts = res.data
        if (res.status == 'success') {
          this.isLoadingWishlist = false
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
        this.isLoadingWishlist = false
        this._ToastrService.error(`Product doesn't added to wishlist`, '', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true,
          tapToDismiss: true,
          progressAnimation: 'decreasing',
        });
      }
    })
  }
  addToCart(ProductId: string): void {
    this.isLoadingCart = true
    this.getUserCartSubscribe = this._CartService.getUserCart().subscribe({
      next: ((res) => {
        this.products = res.data.products
        for (const element of this.products) {
          if (ProductId == element.product.id) {
            this.isAdded = true
          }
        }
        if (this.isAdded) {
          this.isLoadingCart = false
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
                this.isLoadingCart = false
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
              this.isLoadingCart = false
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
    this.activatedRouteSubscribe?.unsubscribe();
    this.getSpecificProductSubscribe?.unsubscribe();
    this.getWishlistSubscribe?.unsubscribe();
    this.addToWishlistSubscribe?.unsubscribe();
    this.addToCartSubscribe?.unsubscribe()
    this.getUserCartSubscribe?.unsubscribe()
  }
}
