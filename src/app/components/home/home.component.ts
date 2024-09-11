import { AfterContentInit, AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProducts } from '../../core/interfaces/iproducts';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategory } from '../../core/interfaces/icategory';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Icart } from '../../core/interfaces/icart';
import { WishlistService } from '../../core/services/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, CarouselModule, RouterLink, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  private readonly _ProductsService = inject(ProductsService)
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);



  getAllProductsSubscribe!: Subscription
  addToCartSubscribe!: Subscription
  getUserCartSubscribe!: Subscription
  addToWishlistSubscribe!: Subscription
  getWishlistSubscribe!: Subscription
  productsList: IProducts[] = []
  products: Icart[] = []
  wishlistProducts: any[] = []
  wishList: IProducts[] = []
  isLoading: boolean = false
  isAdded: boolean = false
isLoadingCart:boolean=false
isLoadingWishlist:boolean=false
productWishlistClickedId:string|null=null
productCartClickedId:string|null=null

  bannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: false,
    navSpeed: 1000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }






  ngOnInit(): void {
    this._NgxSpinnerService.show()
    this.getAllProductsSubscribe = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productsList = res.data
        this._NgxSpinnerService.hide()
      },
      error: (err) => {
        this._NgxSpinnerService.hide()
      }
    })
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

  addToCart(ProductId: string): void {
    this.productCartClickedId=ProductId
    this.isLoadingCart=true
    this.getUserCartSubscribe = this._CartService.getUserCart().subscribe({
      next: ((res) => {
        this.products = res.data.products
        for (const element of this.products) {
          if (ProductId == element.product.id) {
            this.isAdded = true
          }
        }
        if (this.isAdded) {
          this.isLoadingCart=false
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
                this.isLoadingCart=false
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
              this.isLoadingCart=false
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



  addToWishList(id: string): void {
    this.isLoadingWishlist=true
    this.productWishlistClickedId=id
    this.addToWishlistSubscribe = this._WishlistService.addToWishlist(id).subscribe({
      next: (res) => {
        this.wishlistProducts = res.data
        if (res.status == 'success') {
          this.isLoadingWishlist=false
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
        this.isLoadingWishlist=false
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



  ngOnDestroy(): void {
    this.getAllProductsSubscribe?.unsubscribe()
    this.addToCartSubscribe?.unsubscribe()
    this.getUserCartSubscribe?.unsubscribe()
    this.addToWishlistSubscribe?.unsubscribe()
    this.getWishlistSubscribe?.unsubscribe()
  }
}
