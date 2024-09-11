import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { OrdersService } from '../../core/services/orders.service';
import { Iorders } from '../../core/interfaces/iorders';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit, OnDestroy {
  private readonly _OrdersService = inject(OrdersService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);

  userData: any;
  Orders: Iorders[] = [];
  getAllOrdersSubscribe!: Subscription;
  ngOnInit(): void {
    if (localStorage.getItem('userToken') != null) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
    }
    this._NgxSpinnerService.show()
    this.getAllOrdersSubscribe = this._OrdersService
      .getUserOrders(this.userData.id)
      .subscribe({
        next: (res) => {
          this.Orders = res;
          this._NgxSpinnerService.hide()
        },
        error: (err) => {
          this._NgxSpinnerService.hide()
        },
      });
  }
  ngOnDestroy(): void {
    this.getAllOrdersSubscribe?.unsubscribe();
  }
}
