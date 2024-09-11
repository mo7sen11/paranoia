import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, DoCheck, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgClass,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements DoCheck{
  title = 'E-commerce-Project';
private readonly _PLATFORM_ID=inject(PLATFORM_ID)
  
  check!:object
  ngDoCheck(): void {
    if(isPlatformBrowser(this._PLATFORM_ID))
    {
      this.check={
    'dark':localStorage.getItem('theme')=='darkmode'
    }
  }
  }
}
