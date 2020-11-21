import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter'
})
export class CapitalizeFirstLetterPipe implements PipeTransform {

  transform(string: string): unknown {
    return  string.charAt(0).toUpperCase() + string.slice(1);;
  }

}
