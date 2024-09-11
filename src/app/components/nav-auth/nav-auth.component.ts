import { Component, ElementRef, HostBinding, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';

@Component({
  selector: 'app-nav-auth',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,NgClass],
  templateUrl: './nav-auth.component.html',
  styleUrl: './nav-auth.component.scss'
})
export class NavAuthComponent  implements OnInit{
 
  theme:string=''
  private readonly _PLATFORM_ID=inject(PLATFORM_ID)

  @ViewChild('display') navElement!:ElementRef

private readonly _FlowbiteService=inject(FlowbiteService)

  ngOnInit(): void {
  if(isPlatformBrowser(this._PLATFORM_ID))
  {
    if(localStorage.getItem('theme')!=null)
      {
        this.theme=localStorage.getItem('theme')!
      }
      else
      {
        localStorage.setItem('theme','lightmode')
        this.theme='lightmode'
      }
  }
    this._FlowbiteService.loadFlowbite(()=>{})
  }
  

  displayNav():void
  {
   
   if(this.navElement.nativeElement.classList.contains('max-md:left-0'))
   {
     this.navElement.nativeElement.classList.replace('max-md:left-0','max-md:left-[-200%]');
   }
   else
   {
     this.navElement.nativeElement.classList.replace('max-md:left-[-200%]','max-md:left-0');
   }
    
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

