import { Component } from '@angular/core';
import { AjaxUtil } from './ajaxUtil.service';
import './../../recorder.js';

@Component({
  selector: 'home-page',
  template: `
    <div class="container #7e57c2 deep-purple lighten-1">
      <button type="button" (click)="getNewUserKey()">Test</button>
      <button type="button" (click)="showUserKey()"> show</button>
      <button onclick="startRecording(this);">record</button>
      <button onclick="stopRecording(this);" disabled>stop</button>
    </div>
  `,
  providers: [AjaxUtil]
})
export class HomePage {
  private userKey : string;

  constructor (private ajaxUtil : AjaxUtil) {}

  getNewUserKey() {
    this.ajaxUtil.getNewUser().subscribe(identificationProfileId => this.userKey = identificationProfileId);
  }

  showUserKey() {
    console.log(this.userKey);
  }

}
