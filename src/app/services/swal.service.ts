// ANGULAR
import { Injectable } from '@angular/core';

// EXTERNAL
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  constructor() {}

  async swalModalAllString(
    title: string,
    text: string,
    inputPlaceholder: string
  ) {
    const { value = '' } = await Swal.fire<string>({
      title: title,
      text: text,
      input: 'text',
      inputPlaceholder: inputPlaceholder,
      showCancelButton: true,
    });
    return value;
  }

  async swalModalInputValue(
    title: string,
    text: string,
    inputValue: string,
    inputPlaceholder: string
  ) {
    const { value = '' } = await Swal.fire<string>({
      title: title,
      text: text,
      input: 'text',
      inputValue: inputValue,
      inputPlaceholder: inputPlaceholder,
      showCancelButton: true,
    });
    return value;
  }
}
