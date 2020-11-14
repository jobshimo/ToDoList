import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'complete'
})
export class CompletePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
    
  }

  transform(tarea:string) {

    let result:string;

    if (tarea.includes('- FINISH')) {

      let completed = tarea.replace(tarea, `<span style='color: #5d2b30;
      font-size: 20px;
      padding-right: 5px;
      padding-left: 4px;
      padding-bottom: 3px;
      padding-top: 3px;
      border-radius: 4px;
      background-color: #c1b140;
      box-shadow: 7px 6px 12px 4px rgb(27 39 62 / 80%), 0 0 0 1px rgba(0, 0, 0, 0.3);'>${tarea}</span>`);
      result = completed;
      
    } else {
      result = tarea
    }
    return this.sanitized.bypassSecurityTrustHtml(result)  }

}
