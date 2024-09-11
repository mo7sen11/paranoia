import { Component, inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);
  registerAuthSubscribe!: Subscription;
  isLoading: boolean = false;

  registerForm: FormGroup = this._FormBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
      rePassword: [null, Validators.required],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    },
    { validators: [this.confirmPassword] }
  );

  confirmPassword(g: AbstractControl) {
    if (g.get('password')?.value == g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  RegisterAuthData(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerAuthSubscribe = this._AuthService
        .registerAuth(this.registerForm.value)
        .subscribe({
          next: (res) => {
            if (res.message === 'success') {
              this._ToastrService.success(`Register Successfully`,'',{
                positionClass: 'toast-top-right',
                timeOut: 3000,
                progressBar: true,
                tapToDismiss:true,
                progressAnimation: 'decreasing'
              })
              localStorage.setItem('userToken', res.token);
              this._AuthService.getUserData();
              this._Router.navigate(['/home']);
            }
          },
          error: (error: HttpErrorResponse) => {
            this._ToastrService.error(`${error.error.message}`,'',{
              positionClass: 'toast-top-right',
              timeOut: 3000,
              progressBar: true,
              tapToDismiss:true,
              progressAnimation: 'decreasing'
            })
            this.isLoading = false;
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      this.registerForm.setErrors({ mismatch: true });
    }
  }

  ngOnDestroy(): void {
    this.registerAuthSubscribe?.unsubscribe();
  }
}
