import {  AfterViewInit, Component, inject,  OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProducts } from '../../core/interfaces/iproducts';
import { Icart } from '../../core/interfaces/icart';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { ICategory } from '../../core/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { WishlistService } from '../../core/services/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, FormsModule, SearchPipe, CarouselModule, NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {


  private readonly _ProductsService = inject(ProductsService)
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _WishlistService = inject(WishlistService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);

  getCategoriesSubscribe!: Subscription
  getAllProductsSubscribe!: Subscription
  getAllBrandsProductsSubscribe!: Subscription
  getFilteredProductsSubscribe!: Subscription
  getFilteredSubscribe!: Subscription
  addToCartSubscribe!: Subscription
  getUserCartSubscribe!: Subscription
  addToWishlistSubscribe!: Subscription
  getWishlistSubscribe!: Subscription
  wishList: IProducts[] = []
  wishlistProducts: any[] = []
  productsList: IProducts[] = []
  products: Icart[] = []
  categoryList: ICategory[] = []
  brandsList: ICategory[] = []
  isLoading: boolean = false
  isAddedToCart: boolean = false
  searchText: string = ''
  isLoadingCart:boolean=false
  isLoadingWishlist:boolean=false
  productWishlistClickedId:string|null=null
  productCartClickedId:string|null=null





  categoryOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplayHoverPause: true,
    autoplayTimeout: 4000,
    autoplay: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: {
        items: 5
      },
      1400: {
        items: 6
      }
    },
    nav: false
  }
  brandOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    autoplayHoverPause: true,
    autoplayTimeout: 2000,
    autoplay: true,
    dots: false,
    fluidSpeed:true,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: {
        items: 5
      },
      1400: {
        items: 6
      }
    },
    nav: true
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
    this.getCategoriesSubscribe = this._ProductsService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data
        this._NgxSpinnerService.hide()
      },
      error: (err) => {
        this._NgxSpinnerService.hide()
      }
    })
    this.getAllBrandsProductsSubscribe = this._ProductsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList = res.data
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
            this.isAddedToCart = true
          }
        }
        if (this.isAddedToCart) {
          this.isLoadingCart=false
          this._ToastrService.warning(`Product is already in your cart`, '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true,
            tapToDismiss: true,
          })
          this.isAddedToCart = false
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

filterProductsCategory(id:string):void
{
  this._NgxSpinnerService.show()
this.getFilteredProductsSubscribe=this._ProductsService.getFilteredProductsCategory(id).subscribe({
  next: (res) => {
    this.productsList = res.data
    this._NgxSpinnerService.hide()
  },
  error: (err) => {
    this._NgxSpinnerService.hide()
  }
})
}
filterProductsBrand(id:string):void
{
  this._NgxSpinnerService.show()
this.getFilteredSubscribe=this._ProductsService.getFilteredBrand(id).subscribe({
  next: (res) => {
    this.productsList = res.data
    this._NgxSpinnerService.hide()
  },
  error: (err) => {
    this._NgxSpinnerService.hide()
  }
})
}

allProducts():void{
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


  ngOnDestroy(): void {
    this.getAllProductsSubscribe?.unsubscribe()
    this.addToCartSubscribe?.unsubscribe()
    this.getUserCartSubscribe?.unsubscribe()
    this.getCategoriesSubscribe?.unsubscribe()
    this.getCategoriesSubscribe?.unsubscribe()
    this.addToWishlistSubscribe?.unsubscribe()
    this.getWishlistSubscribe?.unsubscribe()
    this.getFilteredProductsSubscribe?.unsubscribe()
  }
}

