import {Component, Input} from '@angular/core';

@Component({
    selector: 'snack-bar-component',
    template: `<span class="snackbar">{{message}}</span>`,
    styles: [`.snackbar { color: hotpink; }`],
  })
  export class SnackBarComponent {
      @Input() message;
  }