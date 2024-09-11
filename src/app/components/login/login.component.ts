import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  loginAuthSubscribe!: Subscription;
  isLoading: boolean = false;

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]]
  });

  loginAuthData(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginAuthSubscribe = this._AuthService
        .loginAuth(this.loginForm.value)
        .subscribe({
          next: (res) => {
            if (res.message === 'success') {
              localStorage.setItem('userToken', res.token);
              this._ToastrService.success(`Signed in successfully`, '', {
                positionClass: 'toast-top-right',
                timeOut: 3000,
                progressBar: true,
                tapToDismiss: true,
                progressAnimation: 'decreasing',
              });
              this._AuthService.getUserData();
              this._Router.navigate(['/home']);
            }
          },
          error: (err: HttpErrorResponse) => {
            this._ToastrService.error(`${err.error.message}`, '', {
              positionClass: 'toast-top-right',
              timeOut: 3000,
              progressBar: true,
              tapToDismiss: true,
              progressAnimation: 'decreasing',
            });
            this.isLoading = false;
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.loginAuthSubscribe?.unsubscribe();
  }
}
