import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResetpasswordService } from '../../core/services/resetpassword.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent implements OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ResetpasswordService = inject(ResetpasswordService);
  private readonly _AuthService = inject(AuthService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);

  emailValidationSubscribe!: Subscription;
  codeValidationSubscribe!: Subscription;
  resetPasswordValidationSubscribe!: Subscription;
  isLoading: boolean = false;
  step: number = 1;
  userEmail: string = '';

  emailValidationForm: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });
  codeValidationForm: FormGroup = this._FormBuilder.group({
    resetCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
  });

  resetPasswordForm: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });

  emailValidation(): void {
    if (this.emailValidationForm.valid) {
      this.isLoading = true;
      this.emailValidationSubscribe = this._ResetpasswordService
        .emailValidation(this.emailValidationForm.value)
        .subscribe({
          next: (res) => {
            if (res.statusMsg == 'success') {
              this.isLoading = false;
              this.step++;
              let Email = this.emailValidationForm.get('email')?.value;
              this.resetPasswordForm.get('email')?.patchValue(Email);
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
      this.emailValidationForm.markAllAsTouched();
    }
  }
  codeValidation(): void {
    if (this.codeValidationForm.valid) {
      this.isLoading = true;
      this.codeValidationSubscribe = this._ResetpasswordService
        .codeVerification(this.codeValidationForm.value)
        .subscribe({
          next: (res) => {
            if (res.status == 'Success') {
              this.isLoading = false;
              this.step++;
              this._ToastrService.success(`Verified Code`, '', {
                positionClass: 'toast-top-right',
                timeOut: 3000,
                progressBar: true,
                tapToDismiss: true,
                progressAnimation: 'decreasing',
              });
            }
          },
          error: (err) => {
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
      this.codeValidationForm.markAllAsTouched();
    }
  }
  resetPasswordValidation(): void {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      this.resetPasswordValidationSubscribe = this._ResetpasswordService
        .newPasswordVerification(this.resetPasswordForm.value)
        .subscribe({
          next: (res) => {
            if (res.token) {
              this.isLoading = false;
              localStorage.setItem('userToken', res.token);
              this._AuthService.getUserData();
              this._Router.navigate(['/home']);
              this._ToastrService.success(`Password Updated Successfully`, '', {
                positionClass: 'toast-top-right',
                timeOut: 3000,
                progressBar: true,
                tapToDismiss: true,
                progressAnimation: 'decreasing',
              });
            }
          },
          error: (err) => {
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
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.emailValidationSubscribe?.unsubscribe();
    this.codeValidationSubscribe?.unsubscribe();
    this.resetPasswordValidationSubscribe?.unsubscribe();
  }
}
