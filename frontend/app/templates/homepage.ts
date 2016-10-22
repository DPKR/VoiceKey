import { Component } from '@angular/core';
import { AjaxUtil } from './ajaxUtil.service';

@Component({
  selector: 'home-page',
  template: `
    <div class="container #7e57c2 deep-purple lighten-1">
      <button type="button" (click)="getNewUserKey()">Test</button>
      <p> {{userKey}} </p>
    </div>
  `,
  providers: [AjaxUtil]
})
export class HomePage {
  private userKey : string;
  constructor (private ajaxUtil : AjaxUtil) {}

  getNewUserKey() {
    this.ajaxUtil.getNewUser().subscribe(identificationProfileId => this.userKey = identificationProfileId);
    console.log(this.userKey);
  }

}
