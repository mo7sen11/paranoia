import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(data:any[], text:string): any[] {
    return data.filter((item)=> {
      return item.title.toLowerCase().includes(text.toLowerCase())
    } );
  }

}
