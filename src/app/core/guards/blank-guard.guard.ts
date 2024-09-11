import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const blankGuardGuard: CanActivateFn = (route, state) => {
  let _Router=inject(Router);
  let _PLATFORM_ID=inject(PLATFORM_ID)

  if(isPlatformBrowser(_PLATFORM_ID))
  {
    if(localStorage.getItem('userToken')!=null)
      {
    _Router.navigate(['/home'])
        return false;
      }
      else
      {
        return true;
      }
  }
  else
  {
    return false
  }
 
};
