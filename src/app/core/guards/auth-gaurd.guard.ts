import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGaurdGuard: CanActivateFn = (route, state) => {
  let _Router=inject(Router)
  let _PLATFORM_ID=inject(PLATFORM_ID)

 if(isPlatformBrowser(_PLATFORM_ID))
 {
  if(localStorage.getItem('userToken')!=null)
    {
      return true;
    }
    else
    {
  _Router.navigate(['/login'])
      return false;
    }
 }
 else
 {
  return false
 }
};
