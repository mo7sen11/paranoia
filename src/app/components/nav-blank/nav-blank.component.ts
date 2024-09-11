import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss',
})
export class NavBlankComponent  implements OnInit {
  private readonly _Router = inject(Router);
  @ViewChild('display') navElement!: ElementRef;
  theme:string=''
  private readonly _PLATFORM_ID=inject(PLATFORM_ID)



ngOnInit(): void {
  if(isPlatformBrowser(this._PLATFORM_ID))
  {
    this.theme=localStorage.getItem('theme')!
  }
}


  displayNav(): void {
    if (this.navElement.nativeElement.classList.contains('max-md:left-0')) {
      this.navElement.nativeElement.classList.replace(
        'max-md:left-0',
        'max-md:left-[-100%]'
      );
    } else {
      this.navElement.nativeElement.classList.replace(
        'max-md:left-[-100%]',
        'max-md:left-0'
      );
    }
  }

  hideNav(): void {
    if (this.navElement.nativeElement.classList.contains('max-md:left-0')) {
      this.navElement.nativeElement.classList.replace(
        'max-md:left-0',
        'max-md:left-[-100%]'
      );
    }
  }

  logOut(): void {
    Swal.fire({
      title: 'Are you sure want to leave?',
      icon: 'warning',
      position: 'top',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
       cancelButtonColor:'red',
    confirmButtonColor:'green',
    background:'#edf2f7'
    }).then((result) => {
      if (result.value) {
        this._Router.navigate(['/login']);
        localStorage.removeItem('userToken');
      } 
    });
  }


  darkMode():void
  {
    localStorage.setItem('theme','darkmode')
    this.theme='darkmode'
  }
  lightMode():void
  {
    localStorage.setItem('theme','lightmode')
    this.theme='lightmode'
  }
}
